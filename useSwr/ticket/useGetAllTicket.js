import { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

//*useSwr
import useSwr from "swr";

export default function useGetAllTicket() {
  //*define
  const { enqueueSnackbar } = useSnackbar();
  const coId = 2; //temporarily define

  //*useState
  const [isLoading, setIsLoading] = useState(false);

  //*useSwr
  const { data, mutate, error, isValidating } = useSwr(
    `http://localhost:3000/api/tickets/getAll?coId=${coId}`
  );

  //*function
  const addSingleTicket = async (data) => {
    setIsLoading(true);
    try {
      await axios.post("http://localhost:3000/api/tickets/add", {
        coId: 2,
        ...data,
      });
      enqueueSnackbar(`Ticket ${data.ticketNo} Added Success`, {
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

  return {
    allTicketData: data,
    mutateAllTicketData: mutate,
    allTicketDataIsValidating: isValidating,
    allTicketDataIsLoading: isLoading,
    addSingleTicket,
  };
}
