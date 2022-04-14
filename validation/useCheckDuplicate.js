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

//*useSwr
import useUser from "useSwr/user/useUser";

let delayTimer = null;
let isValid = false;
let resolveRef = null;

function useCheckDuplicate({
  collectionId,
  defaultData,
  name,
  label,
  isRequired = true,
}) {
  //*define

  //*states
  const [foundData, setFoundData] = useState();

  //*const
  const { userData } = useUser();
  const companyId = userData?.company?.id;

  //*let

  //*ref
  const valueRef = useRef("");

  //*useEffect
  const checkDuplicate = async (value, error, defaultValue) => {
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
      return `Duplicated ${label} Found`;
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
            resolve(`Duplicated ${label} Found`);
            resolveRef = null;
          } else {
            resolve(false);
          }
        }, 1000);
      });
    }
  };

  return { checkDuplicate, foundData };
}

export default useCheckDuplicate;
