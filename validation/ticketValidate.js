import * as Yup from "yup";
import { makeValidate } from "mui-rff";
import axiosStrapi from "utils/http-anxios";
import qs from "qs";
import find from "lodash/find";

//*lodash
import toUpper from "lodash/toUpper";
import uniqBy from "lodash/uniqBy";
import toLower from "lodash/toLower";
import startCase from "lodash/startCase";

//*lib
import { getStrapiURL } from "lib/api";

let delayTimerVehicleNo = null;
let isValidVehicleNo = false;
let resolveRefVehicleNo = null;

let delayTimerTicketNo = null;
let isValidTicketNo = false;
let resolveRefTicketNo = null;

export const ticketValidate = makeValidate(
  Yup.object().shape({
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

export const vehicleNoCheck = async (
  value,
  error,
  vehicleValueRef,
  defaultData,
  handleSetFoundData,
  companyId
) => {
  if (vehicleValueRef.current === value) return error ? error : false;
  vehicleValueRef.current = value;
  clearTimeout(delayTimerVehicleNo);

  if (resolveRefVehicleNo) {
    resolveRefVehicleNo(isValidVehicleNo);
    resolveRefVehicleNo = null;
  }

  const vehicleNo = toUpper(value);
  if (!vehicleNo) {
    return "Vehicle No Is Required";
  }

  const data = find(uniqBy(defaultData, "id"), (data) => {
    return data?.attributes?.vehicle_no === vehicleNo;
  });

  if (data) {
    handleSetFoundData("transporter", data);
    return false;
  } else {
    return await new Promise((resolve) => {
      resolveRefVehicleNo = resolve;
      delayTimerVehicleNo = setTimeout(async () => {
        const strapiUrl = getStrapiURL("transporters");
        const queryString = qs.stringify({
          filters: {
            company: {
              id: {
                $eq: companyId || "",
              },
            },
            vehicle_no: {
              $eq: vehicleNo,
            },
          },
        });

        const { data: transporterData } = await axiosStrapi.get(
          `${strapiUrl}?${queryString}`
        );

        if (transporterData.data.length > 0) {
          handleSetFoundData("transporter", transporterData.data[0]);
          resolve(false);
          resolveRefVehicleNo = null;
        } else {
          resolve("Vehicle No. Not Found");
        }
      }, 1000);
    });
  }
};

export const ticketNoCheck = async (
  value,
  error,
  ticketValueRef,
  defaultData,
  handleSetFoundData,
  companyId
) => {
  if (ticketValueRef.current === value) return error ? error : false;
  ticketValueRef.current = value;
  clearTimeout(delayTimerTicketNo);

  if (resolveRefTicketNo) {
    resolveRefTicketNo(isValidTicketNo);
    resolveRefTicketNo = null;
  }

  const ticketNo = toLower(value);
  if (!ticketNo) {
    return "Ticket No Is Required";
  }

  const data = find(uniqBy(defaultData, "id"), (data) => {
    return toLower(data?.attributes?.ticket_no) === ticketNo;
  });

  if (data) {
    return "Duplicated Ticket No. Found";
  } else {
    return await new Promise((resolve) => {
      resolveRefTicketNo = resolve;
      delayTimerTicketNo = setTimeout(async () => {
        const strapiUrl = getStrapiURL("tickets");
        const queryString = qs.stringify({
          filters: {
            company: {
              id: {
                $eq: companyId || "",
              },
            },
            $or: [
              {
                ticket_no: {
                  $eq: ticketNo,
                },
              },
              {
                ticket_no: {
                  $eq: startCase(ticketNo),
                },
              },
              {
                ticket_no: {
                  $eq: toLower(ticketNo),
                },
              },
              {
                ticket_no: {
                  $eq: toUpper(ticketNo),
                },
              },
            ],
          },
        });

        const { data: ticketData } = await axiosStrapi.get(
          `${strapiUrl}?${queryString}`
        );

        if (ticketData.data.length > 0) {
          handleSetFoundData("ticket", ticketData.data[0]);
          resolve("Duplicated Ticket No. Found");
          resolveRefTicketNo = null;
        } else {
          return false;
        }
      }, 1000);
    });
  }
};
