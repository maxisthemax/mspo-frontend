import { useMemo, useCallback } from "react";

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
import { globalDrawerStore } from "components/Drawers/states";

function Ticket() {
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
  const openDrawer = globalDrawerStore((state) => state.openDrawer);

  //*const
  const rowsPerPage = allTransporterData?.meta?.pagination?.pageSize;
  const total = allTransporterData?.meta?.pagination?.total;
  const handleOpenDrawer = useCallback(
    (params) => {
      openDrawer({ drawerId: "transporter", params: params });
    },
    [openDrawer]
  );

  //*useMemo
  const data = useMemo(() => {
    const returnData = map(allTransporterData?.data, (data) => ({
      id: data.id,
      ...data.attributes,
      handleOpenDrawer: () =>
        handleOpenDrawer({ transporterId: data.id, mode: "edit" }),
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
        click: "handleOpenDrawer",
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
    handleOpenDrawer({ transporterId: "", mode: "add" });
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
export default Ticket;
