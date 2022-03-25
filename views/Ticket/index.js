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
import { ticketDrawerStore } from "views/ticket";
import { transporterDrawerStore } from "views/transporter";

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
        transporter: transporterData?.attributes,
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
        Header: "",
        accessor: "id",
        disableFilters: true,
      },
      {
        Header: "Ticket No",
        accessor: "ticket_no",
        click: "handleOpenTicketDrawer",
      },
      {
        Header: "Ticket Date",
        accessor: "ticket_date",
        type: "date",
        disableFilters: true,
      },
      {
        Header: "Transporter",
        accessor: "transporter",
        click: "handleOpenTransporterDrawer",
        Cell: ({ value }) => {
          return (
            <span>
              {value.name} - {value.vehicle_no}
            </span>
          );
        },
      },
      {
        Header: "First Weight",
        accessor: "first_weight",
        disableFilters: true,
        type: "number",
        inExpand: true,
      },
      {
        Header: "Second Weight",
        accessor: "second_weight",
        disableFilters: true,
        type: "number",
        inExpand: true,
      },
      {
        Header: "Deduction",
        accessor: "deduction",
        disableFilters: true,
        type: "number",
        inExpand: true,
      },
      {
        Header: "Nett Weight",
        accessor: "nett_weight",
        disableFilters: true,
        type: "number",
        inExpand: true,
      },
      {
        Header: "Price Per MT",
        accessor: "price_per_mt",
        disableFilters: true,
        type: "number",
        inExpand: true,
      },
      {
        Header: "Total Price",
        accessor: "total_price",
        disableFilters: true,
        type: "number",
        inExpand: true,
        inRow: true,
      },
    ],
    []
  );

  //*functions
  const handleOpenAddTicketDrawer = () => {
    openTicketDrawer({ params: { mode: "add" } });
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
export { default as ticketDrawerStore } from "./TicketDrawer/store";
