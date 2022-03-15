import { useMemo, useState } from "react";

//*components
import { Button } from "components/Buttons";

//*lodash
import map from "lodash/map";
import flatten from "lodash/flatten";
import uniqBy from "lodash/uniqBy";

//*material-ui
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

//*useSwr
import useUser from "useSwr/user/useUser";
import useSWRInfiniteHttp from "useSwr/useSWRInfiniteHttp";

function TransporterSelect({
  label,
  name,
  defaultValue,
  defaultOption,
  change,
  disabled = false,
}) {
  //*define
  const { userData } = useUser();
  const companyId = userData?.company?.id;
  const {
    data: allTransporterData,
    size,
    setSize,
    isValidating,
  } = useSWRInfiniteHttp("transporters", {
    filters: {
      company: {
        id: {
          $eq: companyId || "",
        },
      },
    },
    pagination: { page: 1, pageSize: 20 },
    sort: ["name:asc", "vehicle_no:desc"],
  });

  //*useState
  const [open, setOpen] = useState(false);

  //*useMemo
  const data = useMemo(() => {
    const returnData = flatten([
      defaultOption?.data,
      ...map(allTransporterData, (data) => {
        return data.data;
      }),
    ]);

    return uniqBy([defaultOption?.data, ...returnData], "id");
  }, [allTransporterData, defaultOption]);

  //*func
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  //*const
  const totalTransporterDataPage =
    allTransporterData && allTransporterData.length > 0
      ? allTransporterData[0]?.meta?.pagination?.pageCount
      : 0;

  return (
    <FormControl size="small" fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        disabled={disabled}
        size="small"
        name={name}
        label={label}
        open={open}
        onOpen={handleOpen}
        MenuProps={{ sx: { height: "500px" }, onClose: handleClose }}
        value={defaultValue}
      >
        {data.map((option, index) => (
          <MenuItem
            divider={defaultValue === option?.id}
            key={option?.id || index}
            value={option?.id}
            onClick={() => {
              change(name, option?.id);
              handleClose();
            }}
            selected={defaultValue === option?.id}
          >
            <Stack direction="row">
              <Box marginRight={2}>{`${option?.attributes?.vehicle_no}`}</Box>
              <Box marginRight={2}>-</Box>
              <Box>{`${option?.attributes?.name}`}</Box>
            </Stack>
          </MenuItem>
        ))}
        <Box>
          <Button
            disabled={totalTransporterDataPage === size || isValidating}
            size="large"
            fullWidth
            onClick={(e) => {
              e.preventDefault();
              setSize(size + 1);
              handleOpen();
            }}
          >
            Load More
          </Button>
        </Box>
      </Select>
    </FormControl>
  );
}

export default TransporterSelect;
