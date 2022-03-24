import { useEffect, useState } from "react";
import axiosStrapi from "utils/http-anxios";
import { useSnackbar } from "notistack";

//*lodash
import find from "lodash/find";
import replace from "lodash/replace";
import toUpper from "lodash/toUpper";

//*useSwr
import useSwrHttp from "useSwr/useSwrHttp";
import useUser from "useSwr/user/useUser";

export default function useGetAllTransporter(pageSizeDefault = 25) {
  //*define
  const { enqueueSnackbar } = useSnackbar();
  const { userData } = useUser();
  const companyId = userData?.company?.id;

  //*useState
  const [search, setSearch] = useState();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizeDefault);
  const [sort, setSort] = useState(["name:asc"]);
  const [isLoading, setIsLoading] = useState(true);

  //*useSwr
  const { data, mutate, error, isValidating } = useSwrHttp(
    companyId ? "transporters" : null,
    {
      filters: {
        company: {
          id: {
            $eq: companyId || "",
          },
        },
        ...search,
      },
      pagination: { page: page + 1, pageSize },
      sort: sort,
      populate: ["ticket"],
    }
  );

  //*function
  const resetAllTransporterSort = () => {
    setSort(["name:asc"]);
  };

  const addSingleTransporter = async ({ name, vehicle_no, address }) => {
    setIsLoading(true);
    try {
      await axiosStrapi.post("transporters", {
        data: {
          name: name,
          company: companyId,
          vehicle_no: replace(toUpper(vehicle_no), /\s+/g, ""),
          address,
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

  const deleteSingleTransporter = async (id) => {
    setIsLoading(true);
    try {
      const deletedData = find(data.data, { id: id });
      await axiosStrapi.delete(`transporters/${id}`);
      enqueueSnackbar(`Transporter ${deletedData.attributes.name} Deleted`, {
        variant: "success",
      });
      mutate();
    } catch (error) {
      if (error?.response?.data?.error?.message)
        enqueueSnackbar(error?.response?.data?.error?.message, {
          variant: "error",
        });
    }
    setIsLoading(false);
  };

  //*useEffect
  useEffect(() => {
    if (error?.response?.data?.error?.message)
      enqueueSnackbar(error?.response?.data?.error?.message, {
        variant: "error",
      });
  }, [error]);

  useEffect(() => {
    if (data) setIsLoading(false);
  }, [data]);

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
    deleteSingleTransporter,
    allTransporterSearch: search,
    setAllTransporterSearch: setSearch,
  };
}
