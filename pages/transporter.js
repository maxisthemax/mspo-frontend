import { useMemo } from "react";

//*lodash
import map from "lodash/map";

//*components
import { TableComponent } from "components/Table";

//*material-ui

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
  );
}
export default Ticket;
