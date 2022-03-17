import { TextField } from "mui-rff";

//*lodash
import includes from "lodash/includes";

function TextFieldForm({
  name,
  label,
  required,
  disabledKeycode = [],
  ...props
}) {
  //*functions
  const myShowErrorFunction = ({
    meta: { submitError, dirtySinceLastSubmit, error, touched },
  }) => {
    return !!(((submitError && !dirtySinceLastSubmit) || error) && touched);
  };

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
    <TextField
      fieldProps={{
        ...fieldProps,
      }}
      size="small"
      fullWidth
      label={label}
      name={name}
      showError={myShowErrorFunction}
      required={required}
      onKeyPress={(ev) => {
        if (includes(disabledKeycode, ev.code)) {
          ev.preventDefault();
        }
      }}
      {...normalProps}
      {...props}
    />
  );
}

export default TextFieldForm;
