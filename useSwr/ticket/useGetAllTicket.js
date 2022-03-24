import { useEffect, useState } from "react";
import axiosStrapi from "utils/http-anxios";
import { useSnackbar } from "notistack";

//*useSwr
import useSwrHttp from "useSwr/useSwrHttp";
import useUser from "useSwr/user/useUser";

export default function useGetAllTicket(pageSizeDefault = 25) {
  //*define
  const { enqueueSnackbar } = useSnackbar();
  const { userData } = useUser();
  const companyId = userData?.company?.id;

  //*useState
  const [search, setSearch] = useState();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizeDefault);
  const [sort, setSort] = useState(["createdAt:desc"]);
  const [isLoading, setIsLoading] = useState(false);

  //*useSwr
  const { data, mutate, error, isValidating } = useSwrHttp(
    companyId ? "tickets" : null,
    {
      filters: {
        company: {
          id: {
            $eq: companyId || "",
          },
        },
        ...search,
      },
      pagination: { page, pageSize },
      sort: sort,
      populate: ["transporter"],
    }
  );

  //*function
  const addSingleTicket = async ({
    ticket_no,
    first_weight,
    second_weight,
    deduction,
    nett_weight,
    price_per_mt,
    total_price,
    transporter,
    ticket_date,
    attachments,
  }) => {
    setIsLoading(true);
    try {
      await axiosStrapi.post("tickets", {
        data: {
          ticket_no,
          first_weight,
          transporter,
          second_weight,
          deduction: deduction || 0,
          price_per_mt,
          total_price,
          nett_weight,
          ticket_date,
          company: companyId,
          attachments,
        },
      });
      enqueueSnackbar(`Ticket ${ticket_no} Added Success`, {
        variant: "success",
      });
      resetAllTicketSort();
      mutate();
    } catch (error) {
      if (error?.response?.data?.error?.message)
        enqueueSnackbar(error?.response?.data?.error?.message, {
          variant: "error",
        });
    }
    setIsLoading(false);
  };

  const deleteSingleTicket = async (id) => {
    setIsLoading(true);
    try {
      const deletedData = find(data.data, { id: id });
      await axiosStrapi.delete(`tickets/${id}`);
      enqueueSnackbar(`Tickets ${deletedData.attributes.ticket_no} Deleted`, {
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

  const resetAllTicketSort = () => {
    setSort(["createdAt:desc"]);
  };

  //*useEffect
  useEffect(() => {
    if (error?.response?.data?.error?.message)
      enqueueSnackbar(error?.response?.data?.error?.message, {
        variant: "error",
      });
  }, [error]);

  return {
    allTicketData: data,
    mutateAllTicketData: mutate,
    allTicketDataIsValidating: isValidating,
    allTicketDataIsLoading: isLoading,
    addSingleTicket,
    allTicketPage: page,
    setAllTicketPage: setPage,
    allTicketPageSize: pageSize,
    setAllTicketPageSize: setPageSize,
    allTicketSort: sort,
    setAllTicketSort: setSort,
    resetAllTicketSort,
    deleteSingleTicket,
    allTicketSearch: search,
    setAllTicketSearch: setSearch,
  };
}
