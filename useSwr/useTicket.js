import { useState } from "react";
import axios from "utils/http-anxios";
import useSwrHttp from "./useSwrHttp";
import useUser from "./useUser";

export default function useTicket() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState();

  const { data, mutate, error, isValidating } = useSwrHttp("tickets", {
    pagination: { page, pageSize },
    sort: sort,
  });

  const { userData } = useUser();

  const addTicket = async () => {
    await axios.post("tickets", {
      data: {
        ticket_no: Math.random().toString(),
        createdBy: userData.id,
      },
    });
    resetTicketSort();
    mutate();
  };

  const resetTicketSort = () => {
    setSort(["createdAt:desc"]);
  };

  return {
    ticketData: data,
    mutate,
    error,
    isValidating,
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