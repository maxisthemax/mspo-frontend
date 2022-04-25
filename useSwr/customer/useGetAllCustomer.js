import { useEffect, useState } from "react";
import axiosStrapi from "utils/http-anxios";
import { useSnackbar } from "notistack";

//*lodash
import find from "lodash/find";

//*useSwr
import useSwrHttp from "useSwr/useSwrHttp";
import useUser from "useSwr/user/useUser";

export default function useGetAllCustomer(pageSizeDefault = 25) {
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
    companyId ? "customers" : null,
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
    }
  );

  //*function
  const resetAllCustomerSort = () => {
    setSort(["name:asc"]);
  };

  const addSingleCustomer = async ({
    customer_no,
    company_no,
    phone_no,
    address_1,
    address_2,
    address_3,
    name,
    ic_no,
  }) => {
    setIsLoading(true);
    try {
      await axiosStrapi.post("customers", {
        data: {
          customer_no,
          company_no,
          phone_no,
          address_1,
          address_2,
          address_3,
          name,
          ic_no,
          company: companyId,
        },
      });
      enqueueSnackbar(`Customer ${name} Added Success`, {
        variant: "success",
      });
      resetAllCustomerSort();
      mutate();
    } catch (error) {
      if (error?.response?.data?.error?.message)
        enqueueSnackbar(error?.response?.data?.error?.message, {
          variant: "error",
        });
    }
    setIsLoading(false);
  };

  const deleteSingleCustomer = async (id) => {
    setIsLoading(true);
    try {
      const deletedData = find(data.data, { id: id });
      await axiosStrapi.delete(`customers/${id}`);
      enqueueSnackbar(`Customer ${deletedData.attributes.name} Deleted`, {
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
    allCustomerData: data,
    mutateAllCustomerData: mutate,
    addSingleCustomer,
    allCustomerDataIsValidating: isValidating,
    allCustomerDataIsLoading: isLoading,
    allCustomerPage: page,
    setAllCustomerPage: setPage,
    allCustomerPageSize: pageSize,
    setAllCustomerPageSize: setPageSize,
    allCustomerSort: sort,
    setAllCustomerSort: setSort,
    resetAllCustomerSort,
    deleteSingleCustomer,
    allCustomerSearch: search,
    setAllCustomerSearch: setSearch,
  };
}
