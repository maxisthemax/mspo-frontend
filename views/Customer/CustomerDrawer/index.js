import { Form } from "react-final-form";

//*components
import { TextFieldForm } from "components/Form";
import { Button } from "components/Buttons";
import { useDialog } from "components/Dialogs";
import { GlobalDrawer } from "components/Drawers";

//*material-ui
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

//*zustand
import { customerDrawerStore } from "views/Customer";

//*validation
import { customerValidate } from "validation";

//*useSwr
import useGetAllCustomer from "useSwr/customer/useGetAllCustomer";
import useGetSingleCustomer from "useSwr/customer/useGetSingleCustomer";

function CustomerDrawer() {
  //*zustand
  const customerDrawerOpen = customerDrawerStore((state) => state.open);
  const closeCustomerDrawer = customerDrawerStore((state) => state.closeDrawer);
  const { customerId, mode, closeOnAdd } = customerDrawerStore(
    (state) => state.params
  );

  //*const
  const { Dialog, handleOpenDialog } = useDialog();
  const { addSingleCustomer, deleteSingleCustomer } = useGetAllCustomer();
  const {
    singleCustomerData,
    editSingleCustomer,
    singleCustomerDataIsLoading,
  } = useGetSingleCustomer(customerId);
  const dataAttribute = singleCustomerData?.data?.attributes;
  const initialValues =
    mode === "add"
      ? {}
      : {
          name: dataAttribute?.name,
          customer_no: dataAttribute?.customer_no,
          ic_no: dataAttribute?.ic_no,
          company_no: dataAttribute?.company_no,
          phone_no: dataAttribute?.phone_no,
          address_1: dataAttribute?.address_1,
          address_2: dataAttribute?.address_2,
          address_3: dataAttribute?.address_3,
        };

  //*function
  const onSubmit = async (data) => {
    mode === "add"
      ? await addSingleCustomer(data)
      : await editSingleCustomer(data);

    if (closeOnAdd) {
      closeCustomerDrawer();
    }
  };

  const handleDeleteCustomer = async () => {
    await deleteSingleCustomer(customerId);
    closeCustomerDrawer();
  };

  //*useFunction

  return (
    <GlobalDrawer open={customerDrawerOpen} closeDrawer={closeCustomerDrawer}>
      <Box p={4}>
        <Typography variant="h6" gutterBottom>
          {mode === "add" ? "Add" : "Edit"} Customer
        </Typography>
        <Box p={1} />
        <Form
          initialValues={initialValues}
          validate={customerValidate}
          onSubmit={onSubmit}
          validateOnBlur={false}
          render={({
            handleSubmit,
            submitting,
            form: { restart },
            validating,
            active,
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
                    disabled={validating && active !== "customer_no"}
                    label="Customer No."
                    name="customer_no"
                    required={true}
                  />
                  <TextFieldForm
                    disabled={validating && active !== "name"}
                    label="Customer Name"
                    name="name"
                    required={true}
                  />
                  <TextFieldForm
                    disabled={validating && active !== "ic_no"}
                    label="Customer IC No."
                    name="ic_no"
                    required={true}
                  />
                  <TextFieldForm
                    disabled={validating && active !== "company_no"}
                    label="Comapny No."
                    name="company_no"
                  />
                  <TextFieldForm
                    disabled={validating && active !== "phone_no"}
                    label="Phone No."
                    name="phone_no"
                  />
                  <TextFieldForm
                    disabled={validating && active !== "address_1"}
                    label="Address 1"
                    name="address_1"
                    multiline
                    rows={2}
                  />
                  <TextFieldForm
                    disabled={validating && active !== "address_2"}
                    label="Address 2"
                    name="address_2"
                    multiline
                    rows={2}
                  />
                  <TextFieldForm
                    disabled={validating && active !== "address_3"}
                    label="Address 3"
                    name="address_3"
                    multiline
                    rows={2}
                  />
                  <Button
                    disabled={
                      submitting || singleCustomerDataIsLoading || validating
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
        <Dialog title="Delete" handleOk={handleDeleteCustomer}>
          <Typography variant="h6">Are You Sure?</Typography>
        </Dialog>
      </Box>
    </GlobalDrawer>
  );
}
export default CustomerDrawer;
