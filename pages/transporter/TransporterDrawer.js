import { Form } from "react-final-form";

//*lodash

//*components
import { TextFieldForm } from "components/Form";
import { Button } from "components/Buttons";
import { useDialog } from "components/Dialogs";

//*material-ui
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

//*useSwr

//*zustand
import { globalDrawerStore } from "components/Drawers/states";

//*validation
import { transporterValidate } from "validation";

//*useSwr
import useGetAllTransporter from "useSwr/transporter/useGetAllTransporter";
import useGetSingleTransporter from "useSwr/transporter/useGetSingleTransporter";

function TransporterDrawer() {
  //*const
  const { Dialog, handleOpenDialog } = useDialog();
  const closeDrawer = globalDrawerStore((state) => state.closeDrawer);
  const { transporterId, mode } = globalDrawerStore((state) => state.params);
  const { addSingleTransporter, deleteSingleTransporter } =
    useGetAllTransporter();
  const { singleTransporterData, editSingleTransporter } =
    useGetSingleTransporter(transporterId);
  const dataAttribute = singleTransporterData?.data?.attributes;

  //*const
  const initialValues =
    mode === "add"
      ? {}
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
  };

  const handleDeleteTransporter = async () => {
    await deleteSingleTransporter(transporterId);
    closeDrawer();
  };

  return (
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
        render={({ handleSubmit, submitting, form: { restart } }) => {
          return (
            <>
              <form
                id="userForm"
                onSubmit={(event) => {
                  handleSubmit(event)?.then(restart);
                }}
                noValidate
              >
                <Stack spacing={2}>
                  <TextFieldForm
                    label="Transporter Name"
                    name="name"
                    required={true}
                  />
                  <TextFieldForm
                    label="Vehicle No."
                    name="vehicle_no"
                    disabledKeycode={["Space"]}
                  />
                  <TextFieldForm label="Address" name="address" />
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
            </>
          );
        }}
      />
      <Dialog title="Delete" handleOk={handleDeleteTransporter}>
        <Typography variant="h6">Are You Sure?</Typography>
      </Dialog>
    </Box>
  );
}
export default TransporterDrawer;
