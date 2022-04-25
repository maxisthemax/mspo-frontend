import * as Yup from "yup";
import { makeValidate } from "mui-rff";

const transporterValidate = makeValidate(
  Yup.object().shape({
    customer_no: Yup.string().required("Customer No. Is Required"),
    name: Yup.string().required("Customer Name Is Required"),
    ic_no: Yup.string().required("Customer IC No. Is Required"),
  })
);

export default transporterValidate;
