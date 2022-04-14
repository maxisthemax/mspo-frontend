import { Form } from "react-final-form";
import "date-fns";

//*lodash
import toUpper from "lodash/toUpper";
import round from "lodash/round";

//*components
import { TextFieldForm, TextField, DateFieldForm } from "components/Form";
import { Button } from "components/Buttons";
import { useDialog } from "components/Dialogs";
import { GlobalDrawer } from "components/Drawers";
import useUploadAttachment from "components/useUploadAttachment";

//*material-ui
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

//*zustand
import { ticketDrawerStore } from "views/Ticket";
import { transporterDrawerStore } from "views/Transporter";

//*validation
import { ticketValidate } from "validation";

//*useSwr
import useGetAllTicket from "useSwr/ticket/useGetAllTicket";
import useGetSingleTicket from "useSwr/ticket/useGetSingleTicket";
import useGetAllTransporter from "useSwr/transporter/useGetAllTransporter";
import useCheckDuplicate from "validation/useCheckDuplicate";
import useCheckExist from "validation/useCheckExist";

function TicketDrawer() {
  //*useState

  //*zustand
  const ticketDrawerOpen = ticketDrawerStore((state) => state.open);
  const { ticketId, mode } = ticketDrawerStore((state) => state.params);
  const closeTicketDrawer = ticketDrawerStore((state) => state.closeDrawer);
  const openTransporterDrawer = transporterDrawerStore(
    (state) => state.openDrawer
  );

  //*define
  const { Dialog, handleOpenDialog } = useDialog();

  //*userSwr
  const { allTicketData, addSingleTicket, deleteSingleTicket } =
    useGetAllTicket();
  const {
    singleTicketData,
    editSingleTicket,
    singleTicketDataIsLoading,
    mutateSingleTicketData,
  } = useGetSingleTicket(ticketId);
  const { allTransporterData } = useGetAllTransporter(100);
  const allTicketDataAttribute = singleTicketData?.data?.attributes;

  //*const
  const attachments = allTicketDataAttribute?.attachments?.data || [];
  const { startUpload, getTotalUploadedFiles, uploadAttachment } =
    useUploadAttachment(
      10,
      false,
      attachments,
      mutateSingleTicketData,
      ticketId
    );

  const initialValues =
    mode === "add"
      ? {}
      : {
          ticket_no: allTicketDataAttribute?.ticket_no || "",
          first_weight: allTicketDataAttribute?.first_weight || 0,
          vehicle_no:
            allTicketDataAttribute?.transporter.data?.attributes?.vehicle_no ||
            "",
          second_weight: allTicketDataAttribute?.second_weight || 0,
          deduction: allTicketDataAttribute?.deduction || 0,
          nett_weight: allTicketDataAttribute?.nett_weight || 0,
          price_per_mt: allTicketDataAttribute?.price_per_mt || 0,
          total_price: allTicketDataAttribute?.total_price || 0,
          ticket_date: allTicketDataAttribute?.ticket_date,
        };

  //*useRef

  //*useFunction
  const { checkDuplicate } = useCheckDuplicate({
    collectionId: "tickets",
    defaultData: allTicketData?.data,
    name: "ticket_no",
    label: "Ticket No.",
  });
  const {
    checkExist,
    foundData: foundTransporterData,
    setFoundData: setFoundTransporterData,
  } = useCheckExist({
    collectionId: "transporters",
    defaultData: allTransporterData?.data,
    name: "vehicle_no",
    label: "Vehicle No.",
  });

  //*function
  const handleCloseTicketDrawer = () => {
    closeTicketDrawer();
    setFoundTransporterData(null);
  };

  const onSubmit = async (data, { restart }) => {
    if (foundTransporterData?.id) data.transporter = foundTransporterData.id;

    if (getTotalUploadedFiles() > 0) {
      const resData = await startUpload();
      if (resData.data) {
        data.attachments = [...attachments, ...resData.data];
      }
    }

    mode === "add" ? await addSingleTicket(data) : await editSingleTicket(data);
    restart();
    setFoundTransporterData(null);
  };

  const handleDeleteTicket = async () => {
    await deleteSingleTicket(ticketId);
    handleCloseTicketDrawer();
  };

  return (
    <GlobalDrawer open={ticketDrawerOpen} closeDrawer={handleCloseTicketDrawer}>
      <Box p={4}>
        <Typography variant="h6" gutterBottom>
          {mode === "add" ? "Add" : "Edit"} Ticket
        </Typography>
        <Box p={1} />

        <Form
          initialValues={initialValues}
          validate={ticketValidate}
          onSubmit={onSubmit}
          render={({
            handleSubmit,
            submitting,
            form: { blur, change },
            values,
            errors,
            validating,
            active,
          }) => {
            const { first_weight, second_weight, deduction, price_per_mt } =
              values;
            const onChangeExternal = (e) => {
              const name = e.target.name;
              const value = e.target.value;

              const changeValue = {
                first_weight,
                second_weight,
                deduction,
                price_per_mt,
              };
              changeValue[name] = value;
              change(name, value);
              const nettWeight =
                (changeValue.first_weight || 0) -
                (changeValue.second_weight || 0) -
                (changeValue.deduction || 0);
              change("nett_weight", round(nettWeight, 2));
              change(
                "total_price",
                round(
                  round((nettWeight || 0) * (changeValue.price_per_mt || 0), 2),
                  2
                )
              );
            };

            return (
              <form
                id="ticketForm"
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (errors?.vehicle_no) {
                    blur("vehicle_no");
                  }
                  await handleSubmit(event);
                }}
                noValidate
                autoComplete="off"
              >
                <Stack spacing={2}>
                  <TextField
                    disabled={validating && active !== "ticket_no"}
                    name="ticket_no"
                    validate={(value) =>
                      checkDuplicate(
                        value,
                        errors["ticket_no"],
                        initialValues?.ticket_no
                      )
                    }
                    size="small"
                    id="ticket_no"
                    label="Ticket No"
                  />
                  <Stack spacing={2}>
                    <DateFieldForm
                      disabled={validating && active !== "ticket_date"}
                      label="Ticket Date"
                      name="ticket_date"
                      required={true}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <TextField
                      disabled={validating && active !== "vehicle_no"}
                      name="vehicle_no"
                      validate={(value) =>
                        checkExist(
                          value,
                          errors["vehicle_no"],
                          initialValues?.vehicle_no
                        )
                      }
                      disabledKeycode={["Space"]}
                      size="small"
                      id="vehicle_no"
                      label="Vehicle No"
                      helperText={
                        foundTransporterData &&
                        `Transporter Name: ${foundTransporterData?.attributes?.name}`
                      }
                      inputProps={{
                        style: { textTransform: "uppercase" },
                      }}
                    />
                    {errors?.vehicle_no === "Vehicle No. Not Found" && (
                      <Button
                        disabled={validating}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openTransporterDrawer({
                            params: {
                              defaultValue: {
                                vehicle_no: toUpper(values?.vehicle_no) || "",
                              },
                              mode: "add",
                              closeOnAdd: true,
                            },
                          });
                        }}
                      >
                        ADD
                      </Button>
                    )}
                  </Stack>
                  <Stack spacing={2} direction="row">
                    <TextFieldForm
                      disabled={
                        singleTicketDataIsLoading ||
                        (validating && active !== "first_weight")
                      }
                      label="First Weight"
                      name="first_weight"
                      type="number"
                      onChange={onChangeExternal}
                    />
                    <TextFieldForm
                      disabled={
                        singleTicketDataIsLoading ||
                        (validating && active !== "second_weight")
                      }
                      label="Second Weight"
                      name="second_weight"
                      type="number"
                      onChange={onChangeExternal}
                    />
                  </Stack>
                  <Stack spacing={2} direction="row">
                    <TextFieldForm
                      disabled={
                        singleTicketDataIsLoading ||
                        (validating && active !== "deduction")
                      }
                      label="Deduction"
                      name="deduction"
                      type="number"
                      onChange={onChangeExternal}
                    />
                    <TextFieldForm
                      disabled={true}
                      label="Nett Weight"
                      name="nett_weight"
                      type="number"
                    />
                  </Stack>
                  <Stack spacing={2} direction="row">
                    <TextFieldForm
                      disabled={
                        singleTicketDataIsLoading ||
                        (validating && active !== "price_per_mt")
                      }
                      label="Price per mt"
                      name="price_per_mt"
                      type="number"
                      onChange={onChangeExternal}
                    />
                    <TextFieldForm
                      disabled={true}
                      label="Total Price"
                      name="total_price"
                      type="number"
                    />
                  </Stack>
                  {uploadAttachment}
                  <Button
                    type="submit"
                    size="large"
                    disabled={
                      submitting || singleTicketDataIsLoading || validating
                    }
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
