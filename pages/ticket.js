import { useMemo, useCallback } from "react";

//*lodash
import map from "lodash/map";

//*components
import { TableComponent } from "components/Table";

//*material-ui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

//*useSwr
import useGetAllTicket from "useSwr/ticket/useGetAllTicket";

//*zustand
import { globalDrawerStore } from "components/Drawers/states";

function Ticket() {
  const {
    ticketData,
    setTicketPage,
    ticketPage,
    setTicketPageSize,
    setTicketSort,
    resetTicketSort,
    isValidating,
  } = useGetAllTicket();

  //*zustand
  const openDrawer = globalDrawerStore((state) => state.openDrawer);

  //*const
  const rowsPerPage = ticketData?.meta?.pagination?.pageSize;
  const total = ticketData?.meta?.pagination?.total;
  const handleOpenTransporterDrawer = useCallback((params) => {
    openDrawer({ drawerId: "transporter", params: params });
  }, []);

  //*useMemo
  const data = useMemo(() => {
    const returnData = map(ticketData?.data, (data) => {
      const transporterData = data.attributes.transporter.data;
      return {
        id: data.id,
        ...data.attributes,
        transporter: transporterData.attributes,
        handleOpenTransporterDrawer: () =>
          handleOpenTransporterDrawer({
            transporterId: transporterData?.id,
            mode: "edit",
          }),
      };
    });

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
        click: "handleOpenTransporterDrawer",
      },
    ],
    []
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ticket
      </Typography>
      {!isValidating && (
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
      )}
    </Box>
  );
}
export default Ticket;
