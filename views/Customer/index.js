import { useMemo } from "react";

//*lodash
import map from "lodash/map";

//*components
import { Button } from "components/Buttons";
import { TableComponent } from "components/Table";

//*material-ui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

//*useSwr
import useGetAllCustomer from "useSwr/customer/useGetAllCustomer";

//*zustand
import { customerDrawerStore } from "views/Customer";

function Customer() {
  const {
    allCustomerData,
    setAllCustomerPage,
    allCustomerPage,
    setAllCustomerPageSize,
    setAllCustomerSort,
    resetAllCustomerSort,
    allCustomerDataIsValidating,
    allCustomerDataIsLoading,
  } = useGetAllCustomer();

  //*zustand
  const openDrawer = customerDrawerStore((state) => state.openDrawer);

  //*const
  const rowsPerPage = allCustomerData?.meta?.pagination?.pageSize;
  const total = allCustomerData?.meta?.pagination?.total;

  //*useMemo
  const data = useMemo(() => {
    const returnData = map(allCustomerData?.data, (data) => ({
      id: data.id,
      ...data.attributes,
      handleOpenCusomterDrawer: () =>
        openDrawer({ params: { customerId: data.id, mode: "edit" } }),
    }));

    return returnData;
  }, [allCustomerData]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        disableFilters: true,
      },
      {
        Header: "Customer No.",
        accessor: "customer_no",
        click: "handleOpenCusomterDrawer",
      },
      {
        Header: "Customer Name",
        accessor: "name",
      },
      {
        Header: "Customer IC No.",
        accessor: "ic_no",
      },
      {
        Header: "Company No.",
        accessor: "company_no",
      },
      {
        Header: "Address 1",
        accessor: "address_1",
        inExpand: true,
      },
      {
        Header: "Address 2",
        accessor: "address_2",
        inExpand: true,
      },
      {
        Header: "Address 3",
        accessor: "address_3",
        inExpand: true,
      },
    ],
    []
  );

  //*functions
  const handleOpenAddCustomerDrawer = () => {
    openDrawer({ params: { mode: "add" } });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Customer
      </Typography>
      <Button onClick={handleOpenAddCustomerDrawer}>Add</Button>
      <Box p={1}></Box>
      <TableComponent
        data={data}
        columns={columns}
        rowsPerPage={rowsPerPage}
        total={total}
        page={allCustomerPage}
        setPage={setAllCustomerPage}
        setPageSize={setAllCustomerPageSize}
        setSort={setAllCustomerSort}
        resetSort={resetAllCustomerSort}
        isLoading={allCustomerDataIsValidating || allCustomerDataIsLoading}
      />
    </Box>
  );
}
export default Customer;
export { default as customerDrawerStore } from "./CustomerDrawer/store";
