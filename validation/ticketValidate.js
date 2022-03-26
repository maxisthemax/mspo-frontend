import * as Yup from "yup";
import { makeValidate } from "mui-rff";

const ticketValidate = makeValidate(
  Yup.object().shape({
    ticket_no: Yup.string().required("Ticket No. Is Required"),
    ticket_date: Yup.date()
      .required("Ticket Date. Is Required")
      .nullable()
      .transform((v) => (v instanceof Date && !isNaN(v) ? v : null)),
    first_weight: Yup.number()
      .required("First Weight Is Required")
      .nullable()
      .transform((v) => {
        return !isNaN(v) ? v : undefined;
      }),
    second_weight: Yup.number()
      .required("Second Weight Is Required")
      .nullable()
      .transform((v) => {
        return !isNaN(v) ? v : undefined;
      }),
    nett_weight: Yup.number()
      .required("Nett Weight Is Required")
      .min(0.01, "Nett Weight Cannot Lower Than 0.01"),
    price_per_mt: Yup.number()
      .required("Price Per MT Is Required")
      .nullable()
      .nullable()
      .transform((v) => {
        return !isNaN(v) ? v : undefined;
      }),
    total_price: Yup.number()
      .required("Total Price Is Required")
      .min(0.01, "Total Price Cannot Lower Than 0.01"),
  })
);

export default ticketValidate;
