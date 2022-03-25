import { Form } from "react-final-form";
import axiosStrapi from "utils/http-anxios";
import qs from "qs";
import { useState } from "react";
import "date-fns";

//*lodash
import find from "lodash/find";
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

//*lib
import { getStrapiURL } from "lib/api";

function TicketDrawer() {
  //*useState
  const [transporterFound, setTransporterFound] = useState(null);

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
  const { addSingleTicket, deleteSingleTicket } = useGetAllTicket();
  const {
    singleTicketData,
    editSingleTicket,
    singleTicketDataIsLoading,
    mutateSingleTicketData,
  } = useGetSingleTicket(ticketId);
  const { allTransporterData } = useGetAllTransporter(100);
  const allTicketDataAttribute = singleTicketData?.data?.attributes;

  //*const
  const attachments = allTicketDataAttribute?.attachments?.data;
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

  //*function
  const onSubmit = async (data, { restart }) => {
    data.transporter = transporterFound.id;
    if (getTotalUploadedFiles() > 0) {
      const resData = await startUpload();
      if (resData.data) {
        data.attachments = [...attachments, ...resData.data];
      }
    }

    mode === "add" ? await addSingleTicket(data) : await editSingleTicket(data);

    restart();
  };

  const handleDeleteTicket = async () => {
    await deleteSingleTicket(ticketId);
    closeTicketDrawer();
  };

  const vehicleNoCheck = async (value) => {
    const vehicleNo = toUpper(value);
    if (!vehicleNo) {
      return "Vehicle No Is Required";
    }

    if (transporterFound?.attributes?.vehicle_no === vehicleNo) return;

    const data = find(
      allTransporterData?.data,
      ({ attributes: { vehicle_no } }) => {
        return vehicle_no === vehicleNo;
      }
    );

    if (data) setTransporterFound(data);
    else {
      const strapiUrl = getStrapiURL("transporters");
      const queryString = qs.stringify({
        filters: {
          vehicle_no: {
            $eq: vehicleNo,
          },
        },
      });

      const { data: transporterData } = await axiosStrapi.get(
        `${strapiUrl}?${queryString}`
      );

      if (transporterData.data.length > 0) {
        setTransporterFound(transporterData.data[0]);
      } else {
        setTransporterFound(null);
        return "Vehicle No. Not Found";
      }
    }
  };

  return (
    <GlobalDrawer open={ticketDrawerOpen} closeDrawer={closeTicketDrawer}>
      <Box p={4}>
        <Typography variant="h6" gutterBottom>
          {mode === "add" ? "Add" : "Edit"} Ticket
        </Typography>
        <Box p={1} />

        <Form
          initialValues={initialValues}
          validate={ticketValidate}
          onSubmit={onSubmit}
          validateOnBlur={true}
          render={({
            handleSubmit,
            submitting,
            form: { blur },
            values,
            errors,
          }) => {
            const {
              first_weight,
              second_weight,
              deduction,
              price_per_mt,
              nett_weight,
            } = values;
            const nettWeight =
              (first_weight || 0) - (second_weight || 0) - (deduction || 0);

            values["nett_weight"] = round(nettWeight, 2);
            values["total_price"] = round(
              (nett_weight || 0) * (price_per_mt || 0),
              2
            );

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
                  <TextFieldForm
                    disabled={singleTicketDataIsLoading}
                    label="Ticket No"
                    name="ticket_no"
                    required={true}
                  />
                  <Stack spacing={2}>
                    <DateFieldForm name="ticket_date" />
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <TextField
                      name="vehicle_no"
                      validate={vehicleNoCheck}
                      disabledKeycode={["Space"]}
                      size="small"
                      id="vehicle_no"
                      label="Vehicle No"
                      helperText={`Transporter Name: ${transporterFound?.attributes?.name}`}
                      inputProps={{
                        style: { textTransform: "uppercase" },
                      }}
                    />
                    {errors?.vehicle_no === "Vehicle No. Not Found" && (
                      <Button
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
                      name="first_weight"
                      type="number"
                    />
                    <TextFieldForm
                      disabled={singleTicketDataIsLoading}
                      label="Second Weight"
                      name="second_weight"
                      type="number"
                    />
                  </Stack>
                  <Stack spacing={2} direction="row">
                    <TextFieldForm
                      disabled={singleTicketDataIsLoading}
                      label="Deduction"
                      name="deduction"
                      type="number"
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
                      disabled={singleTicketDataIsLoading}
                      label="Price per mt"
                      name="price_per_mt"
                      type="number"
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
