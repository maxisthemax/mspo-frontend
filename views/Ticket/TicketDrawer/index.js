import { Form } from "react-final-form";
import "date-fns";
import { Autocomplete } from "mui-rff";

//*lodash
import find from "lodash/find";
import toLower from "lodash/toLower";
import trim from "lodash/trim";
import replace from "lodash/replace";
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
  const { allTransporterData } = useGetAllTransporter();
  const allTicketDataAttribute = singleTicketData?.data?.attributes;
  console.log(allTransporterData);
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

  //*function
  const handleCloseTicketDrawer = () => {
    closeTicketDrawer();
  };

  const onSubmit = async (data, { restart }) => {
    const foundTransporterData = find(allTransporterData, (transporterData) => {
      return (
        replace(trim(toLower(transporterData?.transporterVehNo)), " ", "") ===
        replace(trim(toLower(data.vehicleNo)), " ", "")
      );
    });
    if (getTotalUploadedFiles() > 0) {
      const resData = await startUpload();
      if (resData.data) {
        data.attachments = [...attachments, ...resData.data];
      }
    }

    mode === "add"
      ? await addSingleTicket({
          ...data,
          transporterId: foundTransporterData.transporterId,
        })
      : await editSingleTicket(data);
    restart();
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
          validate={ticketValidate({
            allTransporterData,
            allTicketData,
          })}
          onSubmit={onSubmit}
          render={({
            handleSubmit,
            submitting,
            form: { change },
            values,
            errors,
            validating,
          }) => {
            const { firstWeight, secondWeight, deduction, priceMt } = values;
            const onChangeExternal = (e) => {
              const name = e.target.name;
              const value = e.target.value;

              const changeValue = {
                firstWeight,
                secondWeight,
                deduction,
                priceMt,
              };
              changeValue[name] = value;
              change(name, value);
              const nettWeight =
                (changeValue.firstWeight || 0) -
                (changeValue.secondWeight || 0) -
                (changeValue.deduction || 0);
              change("nettWeight", round(nettWeight, 2));
              change(
                "totalPrice",
                round(
                  round((nettWeight || 0) * (changeValue.priceMt || 0), 2),
                  2
                )
              );
            };

            return (
              <form
                id="ticketForm"
                onSubmit={async (event) => {
                  event.preventDefault();
                  await handleSubmit(event);
                }}
                noValidate
                autoComplete="off"
              >
                <Stack spacing={2}>
                  <TextField
                    disabled={singleTicketDataIsLoading}
                    name="ticketNo"
                    size="small"
                    id="ticketNo"
                    label="Ticket No."
                  />
                  <Stack spacing={2}>
                    <DateFieldForm
                      disabled={singleTicketDataIsLoading}
                      label="Ticket Date"
                      name="ticketDate"
                      required={true}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Autocomplete
                      label="Vehicle No."
                      name="transporterId"
                      size="small"
                      required={true}
                      options={allTransporterData}
                      getOptionValue={(option) => {
                        return option.transporterId;
                      }}
                      getOptionLabel={(option) => {
                        return `${option.transporterName} - ${option.transporterVehNo}`;
                      }}
                      disableCloseOnSelect={true}
                      fullWidth
                    />

                    {/* <TextField
                      disabled={singleTicketDataIsLoading}
                      name="vehicleNo"
                      size="small"
                      id="vehicleNo"
                      label="Vehicle No."
                    /> */}
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
                      disabled={singleTicketDataIsLoading}
                      label="First Weight"
                      name="firstWeight"
                      type="number"
                      onChange={onChangeExternal}
                    />
                    <TextFieldForm
                      disabled={singleTicketDataIsLoading}
                      label="Second Weight"
                      name="secondWeight"
                      type="number"
                      onChange={onChangeExternal}
                    />
                  </Stack>
                  <Stack spacing={2} direction="row">
                    <TextFieldForm
                      disabled={singleTicketDataIsLoading}
                      label="Deduction"
                      name="deduction"
                      type="number"
                      onChange={onChangeExternal}
                    />
                    <TextFieldForm
                      disabled={true}
                      label="Nett Weight"
                      name="nettWeight"
                      type="number"
                    />
                  </Stack>
                  <Stack spacing={2} direction="row">
                    <TextFieldForm
                      disabled={singleTicketDataIsLoading}
                      label="Price per mt"
                      name="priceMt"
                      type="number"
                      onChange={onChangeExternal}
                    />
                    <TextFieldForm
                      disabled={true}
                      label="Total Price"
                      name="totalPrice"
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
