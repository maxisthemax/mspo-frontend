import { useEffect, useState } from "react";
import axios from "utils/http-anxios";
import useSwrHttp from "useSwr/useSwrHttp";
import useUser from "useSwr/user/useUser";
import { useSnackbar } from "notistack";

export default function useGetAllTicket() {
  //*define
  const { enqueueSnackbar } = useSnackbar();
  const { userData } = useUser();
  const companyId = userData?.company?.id;

  //*useState
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState(["createdAt:desc"]);
  const [isLoading, setIsLoading] = useState(false);

  const { data, mutate, error, isValidating } = useSwrHttp(
    companyId ? "tickets" : null,
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
      populate: ["transporter"],
    }
  );

  const addTicket = async ({ ticketNo }) => {
    setIsLoading(true);
    try {
      await axios.post("tickets", {
        data: {
          ticket_no: ticketNo,
          company: companyId,
        },
      });
      enqueueSnackbar(`Ticket ${ticketNo} Added Success`, {
        variant: "success",
      });
      resetTicketSort();
      mutate();
    } catch (error) {
      if (error?.response?.data?.error?.message)
        enqueueSnackbar(error?.response?.data?.error?.message, {
          variant: "error",
        });
    }
    setIsLoading(false);
  };

  const resetTicketSort = () => {
    setSort(["createdAt:desc"]);
  };

  useEffect(() => {
    if (error?.response?.data?.error?.message)
      enqueueSnackbar(error?.response?.data?.error?.message, {
        variant: "error",
      });
  }, [error]);

  return {
    ticketData: data,
    mutateTicketData: mutate,
    ticketDataIsValidating: isValidating,
    ticketDataIsLoading: isLoading,
    addTicket,
    ticketPage: page,
    setTicketPage: setPage,
    ticketPageSize: pageSize,
    setTicketPageSize: setPageSize,
    ticketSort: sort,
    setTicketSort: setSort,
    resetTicketSort,
  };
}
