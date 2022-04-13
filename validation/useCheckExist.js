import { useState, useRef } from "react";

import axiosStrapi from "utils/http-anxios";
import qs from "qs";

//*lodash
import find from "lodash/find";
import toUpper from "lodash/toUpper";
import uniqBy from "lodash/uniqBy";
import toLower from "lodash/toLower";
import startCase from "lodash/startCase";

//*lib
import { getStrapiURL } from "lib/api";

let delayTimer = null;
let isValid = false;
let resolveRef = null;

function useCheckExist({
  collectionId,
  defaultData,
  companyId,
  name,
  label,
  isRequired = true,
}) {
  //*define

  //*states
  const [foundData, setFoundData] = useState();

  //*const

  //*let

  //*ref
  const valueRef = useRef("");

  //*useEffect
  const checkExist = async (value, error, defaultValue) => {
    const lowerCaseValue = toLower(value);
    if (!lowerCaseValue && isRequired) {
      return `${label} Is Required`;
    }

    if (toLower(defaultValue) === toLower(value)) return false;
    if (valueRef.current === value) return error ? error : false;
    valueRef.current = value;
    clearTimeout(delayTimer);

    if (resolveRef) {
      resolveRef(isValid);
      resolveRef = null;
    }

    const data = find(uniqBy([...defaultData, foundData], "id"), (data) => {
      return toLower(data?.attributes[name]) === lowerCaseValue;
    });

    if (data) {
      setFoundData(data);
      return false;
    } else {
      return await new Promise((resolve) => {
        resolveRef = resolve;
        delayTimer = setTimeout(async () => {
          const strapiUrl = getStrapiURL(collectionId);
          const queryString = qs.stringify({
            filters: {
              company: {
                id: {
                  $eq: companyId || "",
                },
              },
              $or: [
                {
                  [name]: {
                    $eq: lowerCaseValue,
                  },
                },
                {
                  [name]: {
                    $eq: startCase(lowerCaseValue),
                  },
                },
                {
                  [name]: {
                    $eq: toLower(lowerCaseValue),
                  },
                },
                {
                  [name]: {
                    $eq: toUpper(lowerCaseValue),
                  },
                },
              ],
            },
          });

          const { data } = await axiosStrapi.get(`${strapiUrl}?${queryString}`);

          if (data.data.length > 0) {
            setFoundData(data.data[0]);
            resolve(false);
            resolveRef = null;
          } else {
            resolve(`${label} Not Found`);
          }
        }, 1000);
      });
    }
  };

  return { checkExist, setFoundData, foundData };
}

export default useCheckExist;
