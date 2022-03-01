import { useMemo } from "react";

//*lodash
import map from "lodash/map";

//*components
import { TableComponent } from "components/Table";

//*material-ui

//*useSwr
import useGetAllTicket from "useSwr/ticket/useGetAllTicket";

function Ticket() {
  const {
    ticketData,
    setTicketPage,
    ticketPage,
    setTicketPageSize,
    setTicketSort,
    resetTicketSort,
  } = useGetAllTicket();

  //*const
  const rowsPerPage = ticketData?.meta?.pagination?.pageSize;
  const total = ticketData?.meta?.pagination?.total;

  //*useMemo
  const data = useMemo(() => {
    const returnData = map(ticketData?.data, (data) => ({
      id: data.id,
      ...data.attributes,
      transporter: data.attributes.transporter.data?.attributes,
    }));
    return returnData;
  }, [ticketData]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        disableFilters: true,
      },
      {
        Header: "Ticket No",
        accessor: "ticket_no",
        disableFilters: true,
      },
      {
        Header: "First Weight",
        accessor: "first_weight",
        disableFilters: true,
        type: "number",
      },
      {
        Header: "Transporter",
        accessor: "transporter.name",
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
      page={ticketPage}
      setPage={setTicketPage}
      setPageSize={setTicketPageSize}
      setSort={setTicketSort}
      resetSort={resetTicketSort}
    />
  );
}
export default Ticket;
