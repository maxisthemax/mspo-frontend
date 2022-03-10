import * as Yup from "yup";
import { makeValidate } from "mui-rff";

const transporterValidate = makeValidate(
  Yup.object().shape({
    name: Yup.string().required("Transporter Name Is Required"),
    vehicle_no: Yup.string()
      .required("Transporter Name Is Required")
      .matches(/^\S*$/, "Space is not allowed"),
  })
);
export default transporterValidate;
