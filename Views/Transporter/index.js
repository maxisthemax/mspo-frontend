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
import useGetAllTransporter from "useSwr/transporter/useGetAllTransporter";

//*zustand
import { transporterDrawerStore } from "views/transporter";

function Transporter() {
  const {
    allTransporterData,
    setAllTransporterPage,
    allTransporterPage,
    setAllTransporterPageSize,
    setAllTransporterSort,
    resetAllTransporterSort,
    allTransporterDataIsValidating,
    allTransporterDataIsLoading,
  } = useGetAllTransporter();

  //*zustand
  const openDrawer = transporterDrawerStore((state) => state.openDrawer);

  //*const
  const rowsPerPage = allTransporterData?.meta?.pagination?.pageSize;
  const total = allTransporterData?.meta?.pagination?.total;

  //*useMemo
  const data = useMemo(() => {
    const returnData = map(allTransporterData?.data, (data) => ({
      id: data.id,
      ...data.attributes,
      handleOpenTransporterDrawer: () =>
        openDrawer({ params: { transporterId: data.id, mode: "edit" } }),
    }));

    return returnData;
  }, [allTransporterData]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        disableFilters: true,
      },
      {
        Header: "Transporter Name",
        accessor: "name",
        click: "handleOpenTransporterDrawer",
      },
      {
        Header: "Vehicle No.",
        accessor: "vehicle_no",
      },
      {
        Header: "Address",
        accessor: "address",
      },
    ],
    []
  );

  //*functions
  const handleOpenAddTransporterDrawer = () => {
    openDrawer({ params: { mode: "add" } });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Transporter
      </Typography>
      <Button onClick={handleOpenAddTransporterDrawer}>Add</Button>
      <Box p={1}></Box>
      <TableComponent
        data={data}
        columns={columns}
        rowsPerPage={rowsPerPage}
        total={total}
        page={allTransporterPage}
        setPage={setAllTransporterPage}
        setPageSize={setAllTransporterPageSize}
        setSort={setAllTransporterSort}
        resetSort={resetAllTransporterSort}
        isLoading={
          allTransporterDataIsValidating || allTransporterDataIsLoading
        }
      />
    </Box>
  );
}
export default Transporter;
export { default as transporterDrawerStore } from "./TransporterDrawer/store";
