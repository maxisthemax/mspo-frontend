import { Form } from "react-final-form";

//*lodash

//*components
import { TextFieldForm } from "components/Form";
import { Button } from "components/Buttons";
import { useDialog } from "components/Dialogs";
import { TransporterSelect } from "components/Autocomplete";

//*material-ui
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

//*useSwr

//*zustand
import { globalDrawerStore } from "components/Drawers/states";

//*validation
import { ticketValidate } from "validation";

//*useSwr
import useGetAllTicket from "useSwr/ticket/useGetAllTicket";
import useGetSingleTicket from "useSwr/ticket/useGetSingleTicket";

function TicketDrawer() {
  //*const
  const { Dialog, handleOpenDialog } = useDialog();
  const closeDrawer = globalDrawerStore((state) => state.closeDrawer);
  const { ticketId, mode } = globalDrawerStore((state) => state.params);
  const { addSingleTicket, deleteSingleTicket } = useGetAllTicket();
  const { singleTicketData, editSingleTicket, singleTicketDataIsValidating } =
    useGetSingleTicket(ticketId);
  const dataAttribute = singleTicketData?.data?.attributes;

  //*const
  const initialValues =
    mode === "add"
      ? {}
      : {
          ticket_no: dataAttribute?.ticket_no || "",
          first_weight: dataAttribute?.first_weight || "",
          transporter: dataAttribute?.transporter.data.id || "",
        };

  //*function
  const onSubmit = async (data) => {
    mode === "add" ? await addSingleTicket(data) : await editSingleTicket(data);
  };

  const handleDeleteTicket = async () => {
    await deleteSingleTicket(ticketId);
    closeDrawer();
  };

  return (
    <Box p={4}>
      <Typography variant="h6" gutterBottom>
        {mode === "add" ? "Add" : "Edit"} Ticket
      </Typography>
      <Box p={1} />

      {!singleTicketDataIsValidating && (
        <Form
          initialValues={initialValues}
          validate={ticketValidate}
          onSubmit={onSubmit}
          validateOnBlur={false}
          render={({ handleSubmit, submitting, form: { restart } }) => {
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
                    label="Ticket No"
                    name="ticket_no"
                    required={true}
                  />
                  <TextFieldForm
                    label="First Weight"
                    name="first_weight"
                    type="number"
                  />
                  <TransporterSelect label="Transporter" name="transporter" />
                  <Button type="submit" size="large" disabled={submitting}>
                    {mode === "add" ? "Create" : "Edit"}
                  </Button>
                  {mode === "edit" && (
                    <Button
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
      )}

      <Dialog title="Delete" handleOk={handleDeleteTicket}>
        <Typography variant="h6">Are You Sure?</Typography>
      </Dialog>
    </Box>
  );
}
export default TicketDrawer;
