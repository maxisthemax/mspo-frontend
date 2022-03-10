import { useEffect, useState } from "react";
import useSwrHttp from "useSwr/useSwrHttp";
import axios from "utils/http-anxios";
import useUser from "useSwr/user/useUser";
import useGetAllTransporter from "./useGetAllTransporter";
import { useSnackbar } from "notistack";

export default function useGetSingleTransporter(id) {
  //*define
  const { enqueueSnackbar } = useSnackbar();
  const { userData } = useUser();
  const companyId = userData.company.id;
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

  const editSingleTransporter = async ({ name }) => {
    setIsLoading(true);
    try {
      await axios.put(`transporters/${id}`, {
        data: {
          name: name,
        },
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
