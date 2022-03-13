import { Autocomplete } from "mui-rff";

//*material-ui

//*useSwr
import useGetMspoQuery from "useSwr/useGetMspoQuery";

function TransporterSelect({ label, name }) {
  const { data, isValidating } = useGetMspoQuery(
    "api::transporter.transporter"
  );

  return (
    !isValidating && (
      <Autocomplete
        label={label}
        name={name}
        size="small"
        required={true}
        options={data || []}
        getOptionValue={(option) => {
          return option.id;
        }}
        getOptionLabel={(option) => {
          return option.name;
        }}
      />
    )
  );
}

export default TransporterSelect;
