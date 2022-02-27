import axios from "utils/http-anxios";
import useSwrHttp from "./useSwrHttp";
import useUser from "./useUser";

export default function useTicket() {
  const { data, mutate, error, isValidating } = useSwrHttp("tickets", {
    sort: ["createdAt:desc"],
  });

  const { userData } = useUser();

  const addTicket = async () => {
    await axios.post("tickets", {
      data: {
        ticket_no: Math.random().toString(),
        createdBy: userData.id,
      },
    });
    mutate();
  };

  return {
    ticketData: data,
    mutate,
    error,
    isValidating,
    addTicket,
  };
}
