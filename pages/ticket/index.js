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
import useGetAllTicket from "useSwr/ticket/useGetAllTicket";

//*zustand
import { ticketDrawerStore } from "pages/ticket";
import { transporterDrawerStore } from "pages/transporter";

function Ticket() {
  //*zustand
  const openTicketDrawer = ticketDrawerStore((state) => state.openDrawer);
  const openTransporterDrawer = transporterDrawerStore(
    (state) => state.openDrawer
  );

  //*useSwr
  const {
    allTicketData,
    allTicketDataIsLoading,
    allTicketDataIsValidating,
    allTicketPage,
    resetAllTicketSort,
    setAllTicketPage,
    setAllTicketPageSize,
    setAllTicketSort,
  } = useGetAllTicket();

  //*const
  const rowsPerPage = allTicketData?.meta?.pagination?.pageSize;
  const total = allTicketData?.meta?.pagination?.total;

  //*useMemo
  const data = useMemo(() => {
    const returnData = map(allTicketData?.data, (data) => {
      const transporterData = data.attributes.transporter.data;
      return {
        id: data.id,
        ...data.attributes,
        transporter: transporterData.attributes,
        handleOpenTicketDrawer: () =>
          openTicketDrawer({
            params: {
              ticketId: data?.id,
              mode: "edit",
            },
          }),
        handleOpenTransporterDrawer: () =>
          openTransporterDrawer({
            params: {
              transporterId: transporterData?.id,
              mode: "edit",
            },
          }),
      };
    });

    return returnData;
  }, [allTicketData]);

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
        click: "handleOpenTicketDrawer",
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

  //*functions
  const handleOpenAddTicketDrawer = () => {
    openTransporterDrawer({ params: { transporterId: "", mode: "add" } });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ticket
      </Typography>
      <Button onClick={handleOpenAddTicketDrawer}>Add</Button>
      <Box p={1}></Box>
      <TableComponent
        data={data}
        columns={columns}
        rowsPerPage={rowsPerPage}
        total={total}
        page={allTicketPage}
        setPage={setAllTicketPage}
        setPageSize={setAllTicketPageSize}
        setSort={setAllTicketSort}
        resetSort={resetAllTicketSort}
        isLoading={allTicketDataIsValidating || allTicketDataIsLoading}
      />
    </Box>
  );
}
export default Ticket;
export { ticketDrawerStore } from "./TicketDrawer/store";
