import { DatePicker } from "mui-rff";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import makeStyles from "@mui/styles/makeStyles";
import Box from "@mui/material/Box";

//*material-ui
const useStyles = makeStyles(() => ({
  dateLabel: {
    "& .MuiFormLabel-root.MuiInputLabel-formControl:not(.MuiInputLabel-shrink)":
      {
        transform: "translate(14px, 9px) scale(1)",
      },
  },
}));
function DateFieldForm({ name, label, required, disabled }) {
  const classes = useStyles();
  return (
    <Box className={classes.dateLabel}>
      <DatePicker
        disabled={disabled}
        label={label}
        name={name}
        required={required}
        dateFunsUtils={DateFnsUtils}
        toolbarFormat="yyyy-MM-dd"
        inputFormat="dd/MM/yyyy"
        InputProps={{
          size: "small",
        }}
      />
    </Box>
  );
}

export default DateFieldForm;
