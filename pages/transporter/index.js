import { useMemo, useCallback } from "react";

//*lodash
import map from "lodash/map";

//*components
import { TableComponent } from "components/Table";

//*material-ui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

//*useSwr
import useGetAllTransporter from "useSwr/transporter/useGetAllTransporter";

//*zustand
import store from "components/Drawers/store";

function Ticket() {
  const {
    transporterData,
    setTransporterPage,
    transporterPage,
    setTransporterPageSize,
    setTransporterSort,
    resetTransporterSort,
  } = useGetAllTransporter();

  //*zustand
  const openDrawer = store((state) => state.openDrawer);

  //*const
  const rowsPerPage = transporterData?.meta?.pagination?.pageSize;
  const total = transporterData?.meta?.pagination?.total;
  const handleOpenDrawer = useCallback(
    (params) => {
      openDrawer({ drawerId: "transporter", params: params });
    },
    [openDrawer]
  );

  //*useMemo
  const data = useMemo(() => {
    const returnData = map(transporterData?.data, (data) => ({
      id: data.id,
      ...data.attributes,
      handleOpenDrawer: () => handleOpenDrawer({ transporterId: data.id }),
    }));

    return returnData;
  }, [transporterData]);

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
    ],
    []
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Transporter
      </Typography>
      <TableComponent
        data={data}
        columns={columns}
        rowsPerPage={rowsPerPage}
        total={total}
        page={transporterPage}
        setPage={setTransporterPage}
        setPageSize={setTransporterPageSize}
        setSort={setTransporterSort}
        resetSort={resetTransporterSort}
      />
    </Box>
  );
}
export default Ticket;
