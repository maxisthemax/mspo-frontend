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
import { ticketDrawerStore } from "views/Ticket";
import { transporterDrawerStore } from "views/Transporter";

function Ticket() {
  //*zustand
  const openTicketDrawer = ticketDrawerStore((state) => state.openDrawer);
  const openTransporterDrawer = transporterDrawerStore(
    (state) => state.openDrawer
  );

  //*useSwr
  const { allTicketData, allTicketDataIsLoading, allTicketDataIsValidating } =
    useGetAllTicket();

  //*const
  const rowsPerPage = allTicketData?.meta?.pagination?.pageSize;
  const total = allTicketData?.meta?.pagination?.total;

  //*useMemo
  const data = useMemo(() => {
    const returnData = map(allTicketData, (data) => {
      return {
        ...data,
        transporterValue: data.transporters?.transporterName
          ? ` ${data.transporters?.transporterName} - ${data.transporters?.transporterVehNo}`
          : "No Transporter",
        handleOpenTicketDrawer: () =>
          openTicketDrawer({
            params: {
              ticketId: data?.id,
              mode: "edit",
            },
          }),
        handleOpenTransporterDrawer: () =>
          data.transporters?.transporterId &&
          openTransporterDrawer({
            params: {
              transporterId: data.transporters.transporterId,
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
        accessor: "ticketNo",
        click: "handleOpenTicketDrawer",
      },
      {
        Header: "Ticket Date",
        accessor: "ticketDate",
        type: "date",
        sortType: "datetime",
        disableFilters: true,
      },
      {
        Header: "Transporter",
        accessor: "transporterValue",
        click: "handleOpenTransporterDrawer",
      },
      {
        Header: "First Weight",
        accessor: "firstWeight",
        disableFilters: true,
        type: "number",
        inExpand: true,
      },
      {
        Header: "Second Weight",
        accessor: "secondWeight",
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
        accessor: "nettWeight",
        disableFilters: true,
        type: "number",
        inExpand: true,
      },
      {
        Header: "Price Per MT",
        accessor: "priceMt",
        disableFilters: true,
        type: "number",
        inExpand: true,
      },
      {
        Header: "Total Price",
        accessor: "totalPrice",
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
        isLoading={allTicketDataIsValidating || allTicketDataIsLoading}
      />
    </Box>
  );
}
export default Ticket;
export { default as ticketDrawerStore } from "./TicketDrawer/store";
