import { useMemo, useEffect, useCallback } from "react";
import { useTable, useFilters, useSortBy } from "react-table";

//*lodash
import map from "lodash/map";

//*components
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
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { visuallyHidden } from "@mui/utils";

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

  const handleFirstPageButtonClick = useCallback((event) => {
    onPageChange(event, 0);
  }, []);

  const handleBackButtonClick = useCallback(
    (event) => {
      onPageChange(event, page - 1);
    },
    [page]
  );

  const handleNextButtonClick = useCallback(
    (event) => {
      onPageChange(event, page + 1);
    },
    [page]
  );

  const handleLastPageButtonClick = useCallback(
    (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    },
    [count, rowsPerPage]
  );

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

function TableComponent({
  data,
  columns,
  rowsPerPage = 0,
  total = 0,
  page,
  setPage,
  setPageSize,
  setSort,
  resetSort,
}) {
  //*define

  //*const

  //*useMemo
  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
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
      setSort(sortState);
    } else {
      resetSort();
    }
  }, [sortBy]);

  //*functions
  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: "85vh" }}>
      <Table stickyHeader size="medium" {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                return (
                  <TableCell
                    key={column.id}
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
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  const isClick = cell.row.original[cell.column["click"]]
                    ? true
                    : false;

                  return (
                    <TableCell
                      key={`${cell.column.id}_${cell.row.id}`}
                      {...cell.getCellProps()}
                      align={cell.column.type === "number" ? "right" : "left"}
                      onClick={cell.row.original[cell.column["click"]]}
                    >
                      {isClick ? (
                        <Link href=" #">{cell.render("Cell")}</Link>
                      ) : (
                        cell.render("Cell")
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow
            sx={{
              position: "sticky",
              bottom: 0,
              backgroundColor: "white",
            }}
          >
            <TablePagination
              rowsPerPageOptions={[25, 50, 100]}
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
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
  );
}
export default TableComponent;
