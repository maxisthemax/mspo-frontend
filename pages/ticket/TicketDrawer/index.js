import { Form } from "react-final-form";

//*lodash

//*components
import { TextFieldForm } from "components/Form";
import { Button } from "components/Buttons";
import { useDialog } from "components/Dialogs";
import { GlobalDrawer } from "components/Drawers";

//*material-ui
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

//*useSwr

//*zustand
import ticketDrawerStore from "./store";
import { transporterDrawerStore } from "pages/transporter";

//*validation
import { ticketValidate } from "validation";

//*useSwr
import useGetAllTicket from "useSwr/ticket/useGetAllTicket";
import useGetSingleTicket from "useSwr/ticket/useGetSingleTicket";
import useGetAllTransporter from "useSwr/transporter/useGetAllTransporter";

function TicketDrawer() {
  //*zustand
  const open = ticketDrawerStore((state) => state.open);
  const { ticketId, mode } = ticketDrawerStore((state) => state.params);
  const closeTicketDrawer = ticketDrawerStore((state) => state.closeDrawer);
  const openTransporterDrawer = transporterDrawerStore(
    (state) => state.openDrawer
  );

  //*define
  const { Dialog, handleOpenDialog } = useDialog();

  //*userSwr
  const { addSingleTicket, deleteSingleTicket } = useGetAllTicket();
  const { singleTicketData, editSingleTicket, singleTicketDataIsLoading } =
    useGetSingleTicket(ticketId);
  const { allTransporterData } = useGetAllTransporter(100);
  const allTicketDataAttribute = singleTicketData?.data?.attributes;

  //*const
  const initialValues =
    mode === "add"
      ? {}
      : {
          ticket_no: allTicketDataAttribute?.ticket_no || "",
          first_weight: allTicketDataAttribute?.first_weight || "",
          vehicle_no:
            allTicketDataAttribute?.transporter.data?.attributes?.vehicle_no ||
            "",
          transporter: allTicketDataAttribute?.transporter.data.id || "",
        };
  const validate = ticketValidate(allTransporterData?.data);

  //*function
  const onSubmit = async (data) => {
    mode === "add" ? await addSingleTicket(data) : await editSingleTicket(data);
  };

  const handleDeleteTicket = async () => {
    await deleteSingleTicket(ticketId);
    closeTicketDrawer();
  };

  return (
    <GlobalDrawer open={open} closeDrawer={closeTicketDrawer}>
      <Box p={4}>
        <Typography variant="h6" gutterBottom>
          {mode === "add" ? "Add" : "Edit"} Ticket
        </Typography>
        <Box p={1} />

        <Form
          initialValues={initialValues}
          validate={validate}
          onSubmit={onSubmit}
          validateOnBlur={false}
          render={({ handleSubmit, submitting, form: { restart }, errors }) => {
            return (
              <form
                id="ticketForm"
                onSubmit={(event) => {
                  handleSubmit(event)?.then(restart);
                }}
                noValidate
                autoComplete="off"
              >
                <Stack spacing={2}>
                  <TextFieldForm
                    disabled={singleTicketDataIsLoading}
                    label="Ticket No"
                    name="ticket_no"
                    required={true}
                  />
                  <TextFieldForm
                    disabled={singleTicketDataIsLoading}
                    label="First Weight"
                    name="first_weight"
                    type="number"
                  />
                  <TextFieldForm
                    disabled={singleTicketDataIsLoading}
                    label="Vehicle No."
                    name="vehicle_no"
                    InputProps={{
                      endAdornment: errors["vehicle_no"] && (
                        <InputAdornment position="end">
                          <Button
                            onClick={() =>
                              openTransporterDrawer({
                                params: {
                                  transporterId: "",
                                  mode: "add",
                                },
                              })
                            }
                          >
                            ADD
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    size="large"
                    disabled={submitting || singleTicketDataIsLoading}
                  >
                    {mode === "add" ? "Create" : "Edit"}
                  </Button>
                  {mode === "edit" && (
                    <Button
                      disabled={submitting || singleTicketDataIsLoading}
                      color="warning"
                      size="large"
                      onClick={handleOpenDialog}
                    >
                      DELETE
                    </Button>
                  )}
                </Stack>
              </form>
            );
          }}
        />

        <Dialog title="Delete" handleOk={handleDeleteTicket}>
          <Typography variant="h6">Are You Sure?</Typography>
        </Dialog>
      </Box>
    </GlobalDrawer>
  );
}
export default TicketDrawer;
