import { useEffect, useState } from "react";
import useSwrHttp from "useSwr/useSwrHttp";
import axiosStrapi from "utils/http-anxios";
import { useSnackbar } from "notistack";

//*lodash

//*useSwr
import useUser from "useSwr/user/useUser";
import useGetAllCustomer from "./useGetAllCustomer";

export default function useGetSingleCustomer(id) {
  //*define
  const { enqueueSnackbar } = useSnackbar();
  const { userData } = useUser();
  const companyId = userData?.company?.id;
  const { mutateAllCustomerData } = useGetAllCustomer();

  //*useState
  const [isLoading, setIsLoading] = useState(false);

  const { data, mutate, error, isValidating } = useSwrHttp(
    id && companyId ? `customers/${id}` : null,
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

  const editSingleCustomer = async ({
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
      await axiosStrapi.put(`customers/${id}`, {
        data: {
          customer_no,
          company_no,
          phone_no,
          address_1,
          address_2,
          address_3,
          name,
          ic_no,
        },
      });
      enqueueSnackbar(`Customer ${name} Saved Success`, {
        variant: "success",
      });
      mutate();
      mutateAllCustomerData();
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
    singleCustomerData: data,
    mutateSingleCustomerData: mutate,
    singleCustomerDataIsValidating: isValidating,
    singleCustomerDataIsLoading: isLoading,
    editSingleCustomer,
  };
}
