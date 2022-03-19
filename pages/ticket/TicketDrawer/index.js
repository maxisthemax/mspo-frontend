import { Form, Field } from "react-final-form";
import axios from "utils/http-anxios";
import qs from "qs";
import { useRef, useState } from "react";

//*lodash
import find from "lodash/find";
import toUpper from "lodash/toUpper";

//*components
import { TextFieldForm, TextField } from "components/Form";
import { Button } from "components/Buttons";
import { useDialog } from "components/Dialogs";
import { GlobalDrawer } from "components/Drawers";

//*material-ui
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

//*zustand
import ticketDrawerStore from "./store";
import { transporterDrawerStore } from "pages/transporter";

//*validation
import { ticketValidate } from "validation";

//*useSwr
import useGetAllTicket from "useSwr/ticket/useGetAllTicket";
import useGetSingleTicket from "useSwr/ticket/useGetSingleTicket";
import useGetAllTransporter from "useSwr/transporter/useGetAllTransporter";

//*lib
import { getStrapiURL } from "lib/api";

//*helpers

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
        };

  //*useRef
  const vehicleNoRef = useRef();

  //*function
  const onSubmit = async (data, { restart }) => {
    data.transporter = transporterFound.id;
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

      const { data: transporterData } = await axios.get(
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
            return (
              <form
                id="ticketForm"
                onSubmit={async (event) => {
                  event.preventDefault();
                  blur("vehicle_no");
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
                  <TextFieldForm
                    disabled={singleTicketDataIsLoading}
                    label="First Weight"
                    name="first_weight"
                    type="number"
                  />
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Field name="vehicle_no" validate={vehicleNoCheck}>
                      {({ input, meta }) => {
                        const { error, touched } = meta;

                        return (
                          <TextField
                            disabledKeycode={["Space"]}
                            {...input}
                            size="small"
                            error={error && touched}
                            id="vehicle_no"
                            label="Vehicle No"
                            defaultValue="Hello World"
                            helperText={
                              touched &&
                              (error
                                ? error
                                : `Transporter Name: ${transporterFound?.attributes?.name}`)
                            }
                            inputProps={{
                              style: { textTransform: "uppercase" },
                            }}
                            inputRef={vehicleNoRef}
                          />
                        );
                      }}
                    </Field>
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
                          vehicleNoRef.current.focus();
                        }}
                      >
                        ADD
                      </Button>
                    )}
                  </Stack>

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
