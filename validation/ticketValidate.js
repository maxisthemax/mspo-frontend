import * as Yup from "yup";
import { makeValidate } from "mui-rff";

const ticketValidate = makeValidate(
  Yup.object().shape({
    ticket_no: Yup.string().required("Ticket No. Is Required"),
    transporter: Yup.string().required("Transporter Is Required"),
  })
);
export default ticketValidate;
