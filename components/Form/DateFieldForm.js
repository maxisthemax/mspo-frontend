import { Field } from "react-final-form";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

//*material-ui
import DatePicker from "@mui/lab/DatePicker";
import TextField from "@mui/material/TextField";

function DateFieldForm({ name, helperText, ...props }) {
  return (
    <Field name={name}>
      {({ meta, input }) => {
        const { error, touched } = meta;
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              {...input}
              okText="Now"
              toolbarFormat="yyyy-MM-dd"
              inputFormat="dd/MM/yyyy"
              label="Ticket Date"
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={touched && (error ? error : helperText)}
                  error={error && touched}
                  size="small"
                />
              )}
              {...props}
            />
          </LocalizationProvider>
        );
      }}
    </Field>
  );
}

export default DateFieldForm;
