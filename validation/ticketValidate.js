import * as Yup from "yup";
import { makeValidate } from "mui-rff";

//*lodash
import find from "lodash/find";
import toLower from "lodash/toLower";
import trim from "lodash/trim";
import replace from "lodash/replace";

//*lib

export const ticketValidate = ({ allTransporterData, allTicketData }) =>
  makeValidate(
    Yup.object().shape({
      ticketNo: Yup.string()
        .required("Ticket No. Is Required")
        .test("Duplicate", "Duplicate Ticket No. Found", (values) => {
          if (!values) return true;
          const data = find(allTicketData, (data) => {
            return (
              replace(trim(toLower(data?.ticketNo)), " ", "") ===
              replace(trim(toLower(values)), " ", "")
            );
          });
          if (data) return false;
          else return true;
        }),
      transporterId: Yup.string()
        .required("Transporter Is Required")
        .nullable()
        .test("Exist", "No Vehicle No. Found", (values) => {
          if (!values) return true;
          const data = find(allTransporterData, (data) => {
            return (
              replace(trim(toLower(data?.transporterId)), " ", "") ===
              replace(trim(toLower(values)), " ", "")
            );
          });
          if (data) return true;
          else return false;
        }),
      ticketDate: Yup.date()
        .required("Ticket Date. Is Required")
        .nullable()
        .transform((v) => (v instanceof Date && !isNaN(v) ? v : null)),
      firstWeight: Yup.number()
        .required("First Weight Is Required")
        .nullable()
        .transform((v) => {
          return !isNaN(v) ? v : undefined;
        }),
      secondWeight: Yup.number()
        .required("Second Weight Is Required")
        .nullable()
        .transform((v) => {
          return !isNaN(v) ? v : undefined;
        }),
      nettWeight: Yup.number()
        .required("Nett Weight Is Required")
        .min(0.01, "Nett Weight Cannot Lower Than 0.01"),
      priceMt: Yup.number()
        .required("Price Per MT Is Required")
        .nullable()
        .nullable()
        .transform((v) => {
          return !isNaN(v) ? v : undefined;
        }),
      totalPrice: Yup.number()
        .required("Total Price Is Required")
        .min(0.01, "Total Price Cannot Lower Than 0.01"),
    })
  );
