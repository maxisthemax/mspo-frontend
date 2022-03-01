import { useMemo } from "react";

//*lodash
import map from "lodash/map";

//*components
import { TableComponent } from "components/Table";

//*material-ui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

//*useSwr
import useTransporter from "useSwr/useTransporter";

function Ticket() {
  const {
    transporterData,
    setTransporterPage,
    transporterPage,
    setTransporterPageSize,
    setTransporterSort,
    resetTransporterSort,
  } = useTransporter();

  //*const
  const rowsPerPage = transporterData?.meta?.pagination?.pageSize;
  const total = transporterData?.meta?.pagination?.total;

  //*useMemo
  const data = useMemo(() => {
    const returnData = map(transporterData?.data, (data) => ({
      id: data.id,
      ...data.attributes,
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
