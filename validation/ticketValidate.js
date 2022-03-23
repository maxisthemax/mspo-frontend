import * as Yup from "yup";
import { makeValidate } from "mui-rff";

const ticketValidate = makeValidate(
  Yup.object().shape({
    ticket_no: Yup.string().required("Ticket No. Is Required"),
    ticket_date: Yup.date().required("Ticket Date. Is Required").nullable(),
    first_weight: Yup.number().required("First Weight Is Required"),
    second_weight: Yup.number().required("Second Weight Is Required"),
    nett_weight: Yup.number()
      .required("Nett Weight Is Required")
      .min(0.01, "Nett Weight Cannot Lower Than 0"),
    price_per_mt: Yup.number().required("Price Per MT Is Required"),
    total_price: Yup.number()
      .required("Total Price Is Required")
      .min(0.01, "Nett Weight Cannot Lower Than 0"),
  })
);

export default ticketValidate;
