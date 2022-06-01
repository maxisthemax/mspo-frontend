import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

//*lodash

//*useSwr
import useSwr from "swr";

export default function useGetAllTransporter() {
  //*define
  const { enqueueSnackbar } = useSnackbar();
  const coId = 2; //temporarily define

  //*useState
  const [isLoading, setIsLoading] = useState(true);

  //*useSwr
  const { data, mutate, error, isValidating } = useSwr(
    `http://localhost:3000/api/transporters/getAll?coId=${coId}`
  );

  //*function

  const addSingleTransporter = async () => {};

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
  };
}
