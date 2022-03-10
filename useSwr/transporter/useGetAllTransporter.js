import { useEffect, useState } from "react";
import axios from "utils/http-anxios";
import useSwrHttp from "useSwr/useSwrHttp";
import useUser from "useSwr/user/useUser";
import { useSnackbar } from "notistack";

export default function useGetAllTransporter() {
  //*define
  const { enqueueSnackbar } = useSnackbar();
  const { userData } = useUser();
  const companyId = userData.company.id;

  //*useState
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { data, mutate, error, isValidating } = useSwrHttp(
    companyId ? "transporters" : null,
    {
      filters: {
        company: {
          id: {
            $eq: companyId || "",
          },
        },
      },
      pagination: { page, pageSize },
      sort: sort,
      populate: ["ticket"],
    }
  );

  const resetAllTransporterSort = () => {
    setSort();
  };

  const addSingleTransporter = async ({ name }) => {
    setIsLoading(true);
    try {
      await axios.post("transporters", {
        data: {
          name: name,
          createdBy: userData.id,
        },
      });
      enqueueSnackbar(`Transporter ${name} Added Success`, {
        variant: "success",
      });
      resetAllTransporterSort();
      mutate();
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
    allTransporterData: data,
    mutateAllTransporterData: mutate,
    addSingleTransporter,
    allTransporterDataIsValidating: isValidating,
    allTransporterDataIsLoading: isLoading,
    allTransporterPage: page,
    setAllTransporterPage: setPage,
    allTransporterPageSize: pageSize,
    setAllTransporterPageSize: setPageSize,
    allTransporterSort: sort,
    setAllTransporterSort: setSort,
    resetAllTransporterSort,
  };
}
