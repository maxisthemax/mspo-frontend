import { useEffect, useState } from "react";
import useSwrHttp from "useSwr/useSwrHttp";
import axios from "utils/http-anxios";
import { useSnackbar } from "notistack";

//*lodash
import replace from "lodash/replace";
import upperCase from "lodash/upperCase";

//*useSwr
import useUser from "useSwr/user/useUser";
import useGetAllTransporter from "./useGetAllTransporter";

export default function useGetSingleTransporter(id) {
  //*define
  const { enqueueSnackbar } = useSnackbar();
  const { userData } = useUser();
  const companyId = userData?.company?.id;
  const { mutateAllTransporterData } = useGetAllTransporter();

  //*useState
  const [isLoading, setIsLoading] = useState(false);

  const { data, mutate, error, isValidating } = useSwrHttp(
    id && companyId ? `transporters/${id}` : null,
    {
      filters: {
        company: {
          id: {
            $eq: companyId || "",
          },
        },
      },
    }
  );

  const editSingleTransporter = async ({ name, vehicle_no, address }) => {
    setIsLoading(true);
    try {
      await axios.put(`transporters/${id}`, {
        data: {
          name,
          vehicle_no: replace(upperCase(vehicle_no), /\s+/g, ""),
          address,
        },
      });
      enqueueSnackbar(`Transporter ${name} Saved Success`, {
        variant: "success",
      });
      mutate();
      mutateAllTransporterData();
    } catch (error) {
      if (error?.response?.data?.error?.message)
        enqueueSnackbar(error?.response?.data?.error?.message, {
          variant: "error",
        });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (error?.response?.data?.error?.message)
      enqueueSnackbar(error?.response?.data?.error?.message, {
        variant: "error",
      });
  }, [error]);

  return {
    singleTransporterData: data,
    mutateSingleTransporterData: mutate,
    singleTransporterDataIsValidating: isValidating,
    singleTransporterDataIsLoading: isLoading,
    editSingleTransporter,
  };
}
