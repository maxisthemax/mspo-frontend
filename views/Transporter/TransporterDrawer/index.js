import { Form } from "react-final-form";

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
import { transporterDrawerStore } from "views/Transporter";

//*validation
import { transporterValidate } from "validation";

//*useSwr
import useGetAllTransporter from "useSwr/transporter/useGetAllTransporter";
import useGetSingleTransporter from "useSwr/transporter/useGetSingleTransporter";
import useCheckDuplicate from "validation/useCheckDuplicate";

function TransporterDrawer() {
  //*zustand
  const transporterDrawerOpen = transporterDrawerStore((state) => state.open);
  const closeTransporterDrawer = transporterDrawerStore(
    (state) => state.closeDrawer
  );
  const { transporterId, mode, defaultValue, closeOnAdd } =
    transporterDrawerStore((state) => state.params);

  //*const
  const { Dialog, handleOpenDialog } = useDialog();
  const { allTransporterData, addSingleTransporter, deleteSingleTransporter } =
    useGetAllTransporter();
  const {
    singleTransporterData,
    editSingleTransporter,
    singleTransporterDataIsLoading,
  } = useGetSingleTransporter(transporterId);
  const dataAttribute = singleTransporterData?.data?.attributes;
  const initialValues =
    mode === "add"
      ? {
          vehicle_no: defaultValue?.vehicle_no,
        }
      : {
          name: dataAttribute?.name,
          vehicle_no: dataAttribute?.vehicle_no,
          address: dataAttribute?.address,
        };

  //*function
  const onSubmit = async (data) => {
    mode === "add"
      ? await addSingleTransporter(data)
      : await editSingleTransporter(data);

    if (closeOnAdd) {
      closeTransporterDrawer();
    }
  };

  const handleDeleteTransporter = async () => {
    await deleteSingleTransporter(transporterId);
    closeTransporterDrawer();
  };
  //*useFunction
  const { checkDuplicate } = useCheckDuplicate({
    collectionId: "transporters",
    defaultData: allTransporterData?.data,
    name: "vehicle_no",
    label: "Vehicle No.",
  });

  return (
    <GlobalDrawer
      open={transporterDrawerOpen}
      closeDrawer={closeTransporterDrawer}
    >
      <Box p={4}>
        <Typography variant="h6" gutterBottom>
          {mode === "add" ? "Add" : "Edit"} Transporter
        </Typography>
        <Box p={1} />
        <Form
          initialValues={initialValues}
          validate={transporterValidate}
          onSubmit={onSubmit}
          validateOnBlur={false}
          render={({
            handleSubmit,
            submitting,
            form: { restart },
            validating,
            active,
            errors,
          }) => {
            return (
              <form
                id="userForm"
                onSubmit={(event) => {
                  handleSubmit(event)?.then(restart);
                }}
                noValidate
                autoComplete="off"
              >
                <Stack spacing={2}>
                  <TextFieldForm
                    disabled={validating && active !== "name"}
                    label="Transporter Name"
                    name="name"
                    required={true}
                  />
                  <TextField
                    disabled={validating && active !== "vehicle_no"}
                    name="vehicle_no"
                    validate={(value) =>
                      checkDuplicate(
                        value,
                        errors["vehicle_no"],
                        initialValues?.vehicle_no
                      )
                    }
                    size="small"
                    id="vehicle_no"
                    label="Vehicle No"
                    inputProps={{
                      style: { textTransform: "uppercase" },
                    }}
                    disabledKeycode={["Space"]}
                  />
                  <TextFieldForm
                    disabled={validating && active !== "address"}
                    label="Address"
                    name="address"
                    multiline
                    rows={3}
                  />
                  <Button
                    disabled={
                      submitting || singleTransporterDataIsLoading || validating
                    }
                    type="submit"
                    size="large"
                  >
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
        <Dialog title="Delete" handleOk={handleDeleteTransporter}>
          <Typography variant="h6">Are You Sure?</Typography>
        </Dialog>
      </Box>
    </GlobalDrawer>
  );
}
export default TransporterDrawer;
