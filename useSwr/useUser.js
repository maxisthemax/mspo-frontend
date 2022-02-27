import axios from "utils/http-anxios";
import { useRouter } from "next/router";
import { reactLocalStorage } from "reactjs-localstorage";
import useSwrHttp from "./useSwrHttp";
import { useSnackbar } from "notistack";

function useUser(revalidateOnMount = true) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { data, mutate, isValidating, error } = useSwrHttp(
    "users/me",
    {},
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      revalidateOnReconnect: false,
      revalidateOnMount: revalidateOnMount,
    }
  );

  async function handleLogin(email, password) {
    try {
      const resData = await axios.post("auth/local", {
        identifier: email,
        password: password,
      });
      enqueueSnackbar("Login Success", {
        variant: "success",
      });

      reactLocalStorage.set("jwt", resData.data.jwt);
      mutate();
      if (router?.query?.callback) router.push(router?.query?.callback);
      else router.back();
    } catch (eror) {
      enqueueSnackbar(eror?.response?.statusText, {
        variant: "error",
      });
    }
  }

  function handleLogout() {
    reactLocalStorage.remove("jwt");
    mutate({}, true);
    router.replace("/");
  }

  return {
    userData: data,
    error,
    isValidating,
    handleLogin,
    handleLogout,
    mutate,
  };
}

export default useUser;
