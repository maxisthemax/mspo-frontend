import { useEffect, useState } from "react";
import useSwrHttp from "useSwr/useSwrHttp";
import axios from "utils/http-anxios";
import { useSnackbar } from "notistack";

//*useSwr
import useUser from "useSwr/user/useUser";
import useGetAllTicket from "./useGetAllTicket";

export default function useGetSingleTicket(id) {
  //*define
  const { enqueueSnackbar } = useSnackbar();
  const { userData } = useUser();
  const companyId = userData?.company?.id;
  const { mutateAllTicketData } = useGetAllTicket();

  //*useState
  const [isLoading, setIsLoading] = useState(false);

  //*useSwr
  const { data, mutate, error, isValidating } = useSwrHttp(
    id && companyId ? `tickets/${id}` : null,
    {
      filters: {
        company: {
          id: {
            $eq: companyId || "",
          },
        },
      },
      populate: ["transporter"],
    }
  );

  //*function
  const editSingleTicket = async ({
    ticket_no,
    first_weight,
    second_weight,
    deduction,
    nett_weight,
    price_per_mt,
    total_price,
    transporter,
  }) => {
    setIsLoading(true);
    try {
      await axios.put(`tickets/${id}`, {
        data: {
          ticket_no,
          transporter,
          first_weight,
          second_weight,
          deduction: deduction || 0,
          nett_weight,
          price_per_mt,
          total_price,
        },
      });
      enqueueSnackbar(`Ticket ${ticket_no} Saved Success`, {
        variant: "success",
      });
      mutate();
      mutateAllTicketData();
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

  return {
    singleTicketData: data,
    mutateSingleTicketData: mutate,
    singleTicketDataIsValidating: isValidating,
    singleTicketDataIsLoading: isLoading,
    editSingleTicket,
  };
}
