import { useEffect } from "react";
import useSwrHttp from "useSwr/useSwrHttp";
import { useSnackbar } from "notistack";

//*lodash

export default function useGetMspoQuery(collectionId) {
  //*define
  const { enqueueSnackbar } = useSnackbar();

  //*useState

  const { data, error, isValidating } = useSwrHttp(
    collectionId ? `mspoqueryall/${collectionId}` : null
  );

  useEffect(() => {
    if (error?.response?.data?.error?.message)
      enqueueSnackbar(error?.response?.data?.error?.message, {
        variant: "error",
      });
  }, [error]);

  return {
    data,
    isValidating,
  };
}
