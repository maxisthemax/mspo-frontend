import { Field } from "react-final-form";
import MuiTextField from "@mui/material/TextField";

//*lodash
import includes from "lodash/includes";

function TextField({
  name,
  label,
  required,
  disabledKeycode = [],
  enableUpperCaseAuto = false,
  validate,
  helperText,
  ...props
}) {
  //*functions

  const normalizeNumber = (value) => {
    return Number(value);
  };
  const numberCheckOnZero = (e) => {
    if (e.target.value === "0") e.target.value = "";
  };

  let fieldProps = {};
  let normalProps = {};

  if (props.type === "number") {
    fieldProps["parse"] = normalizeNumber;
    fieldProps["type"] = "number";
    normalProps["onClick"] = numberCheckOnZero;
  }

  return (
    <Field name={name} validate={validate}>
      {({ meta, input }) => {
        const { error, touched } = meta;
        return (
          <MuiTextField
            {...input}
            error={error && touched}
            size="small"
            fullWidth
            label={label}
            name={name}
            required={required}
            onKeyPress={(ev) => {
              if (includes(disabledKeycode, ev.code)) {
                ev.preventDefault();
              }
            }}
            inputProps={{
              style: {
                textTransform: enableUpperCaseAuto ? "uppercase" : "none",
                ...props?.inputProps?.style,
              },
              ...props.inputProps,
            }}
            helperText={error && touched ? error : helperText}
            {...normalProps}
            {...props}
          />
        );
      }}
    </Field>
  );
}

export default TextField;
