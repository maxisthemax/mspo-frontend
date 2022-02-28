import { useMemo, useEffect } from "react";
import { useTable, useFilters, useSortBy } from "react-table";

//*lodash
import map from "lodash/map";

//*components
import { Button } from "components/Buttons";
import { CustomIcon } from "components/Icons";

//*material-ui
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { visuallyHidden } from "@mui/utils";

//*useSwr
import useTicket from "useSwr/useTicket";
import useUser from "useSwr/useUser";

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <TextField
      size="small"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <CustomIcon icon="first_page" />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <CustomIcon icon="keyboard_arrow_left" />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <CustomIcon icon="keyboard_arrow_right" />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <CustomIcon icon="last_page" />
      </IconButton>
    </Box>
  );
}
export default function Home() {
  const {
    ticketData,
    addTicket,
    setTicketPage,
    ticketPage,
    setTicketPageSize,
    setTicketSort,
    resetTicketSort,
  } = useTicket();

  const { handleLogin } = useUser();

  //*const
  const rowsPerPage = ticketData?.meta?.pagination?.pageSize;
  const total = ticketData?.meta?.pagination?.total;

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const data = useMemo(() => {
    const returnData = map(ticketData?.data, (data) => ({
      id: data.id,
      ...data.attributes,
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
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      manualSortBy: true,
    },
    useFilters,
    useSortBy
  );

  useEffect(() => {
    if (sortBy.length > 0) {
      const sortState = map(sortBy, (data) => {
        return `${data.id}:${data.desc ? "desc" : "asc"}`;
      });
      setTicketSort(sortState);
    } else resetTicketSort();
  }, [sortBy]);

  //*functions
  const handleChangePage = (event, newPage) => {
    setTicketPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setTicketPageSize(parseInt(event.target.value, 10));
    setTicketPage(0);
  };

  return (
    <Box>
      Ticket
      <Box>
        <Button
          onClick={() => {
            handleLogin("mail@mail.com", "test123");
          }}
        >
          Login
        </Button>
        <Button
          onClick={() => {
            addTicket();
          }}
        >
          ADD
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: "80vh" }}>
        <Table stickyHeader size="medium" {...getTableProps()}>
          <TableHead>
            {
              // Loop over the header rows
              headerGroups.map((headerGroup) => (
                // Apply the header row props
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    return (
                      <TableCell
                        {...column.getHeaderProps}
                        align={column.type === "number" ? "right" : "left"}
                        sortDirection={column.isSortedDesc ? "desc" : "asc"}
                      >
                        <TableSortLabel
                          sx={{ width: "100%" }}
                          {...column.getSortByToggleProps()}
                          active={column.isSorted}
                          direction={column.isSortedDesc ? "desc" : "asc"}
                        >
                          {column.render("Header")}
                          {column.isSorted ? (
                            <Box component="span" sx={visuallyHidden}>
                              {column.isSortedDesc
                                ? "sorted descending"
                                : "sorted ascending"}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                        <div>
                          {column.canFilter ? column.render("Filter") : null}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            }
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell
                        {...cell.getCellProps()}
                        align={cell.column.type === "number" ? "right" : "left"}
                      >
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                colSpan={3}
                count={total}
                rowsPerPage={rowsPerPage}
                page={ticketPage}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}
