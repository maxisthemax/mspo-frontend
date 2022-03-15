import * as Yup from "yup";
import { makeValidate } from "mui-rff";
import find from "lodash/find";
import axios from "utils/http-anxios";
import qs from "qs";
import { getStrapiURL } from "lib/api";
let delayTimer = null;
let isValid = false;
let resolveRef = null;

const ticketValidate = (transporterData) =>
  makeValidate(
    Yup.object().shape({
      ticket_no: Yup.string().required("Ticket No. Is Required"),
      first_weight: Yup.number().required("First Weight Is Required"),
      vehicle_no: Yup.string()
        .required("Vehicle No. Is Required")
        .test(
          "vehicle_no", // Name
          "Vehicle No. Not Found", // Msg
          async (value) => {
            clearTimeout(delayTimer);

            const data = find(
              transporterData,
              ({ attributes: { vehicle_no } }) => {
                return vehicle_no === value;
              }
            );

            if (data) return true;
            else {
              if (resolveRef) {
                resolveRef(isValid);
                resolveRef = null;
              }

              return await new Promise((resolve) => {
                resolveRef = resolve;
                delayTimer = setTimeout(async () => {
                  const strapiUrl = getStrapiURL("transporters");
                  const queryString = qs.stringify({
                    filters: {
                      vehicle_no: {
                        $eq: value,
                      },
                    },
                  });
                  const { data } = await axios.get(
                    `${strapiUrl}?${queryString}`
                  );
                  isValid = data.data.length > 0;

                  resolve(isValid);
                  resolveRef = null;
                }, 1000);
              });
            }
          }
          // async (value) => {
          //   clearTimeout(delayTimer);
          // const data = find(
          //   transporterData,
          //   ({ attributes: { vehicle_no } }) => {
          //     return vehicle_no === value;
          //   }
          // );

          // if (data) return true;
          // else {
          //   const strapiUrl = getStrapiURL("transporters");
          // const queryString = qs.stringify({
          //   filters: {
          //     vehicle_no: {
          //       $eq: value,
          //     },
          //   },
          // });
          //   delayTimer = setTimeout(async () => {
          //     data = await axios.get(`${strapiUrl}?${queryString}`);
          //     console.log(data);
          //   }, 5000);
          //   console.log(data.data.data.length);
          //   return data.data.data.length;
          //   // }
          // }
        ),
      transporter: Yup.string().required("Transporter Is Required").nullable(),
    })
  );
export default ticketValidate;
