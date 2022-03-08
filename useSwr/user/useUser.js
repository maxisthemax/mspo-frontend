import axios from "utils/http-anxios";
import { useRouter } from "next/router";
import { reactLocalStorage } from "reactjs-localstorage";
import useSwrHttp from "useSwr/useSwrHttp";
import { useSnackbar } from "notistack";
import { useState } from "react";

function useUser() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const { data, mutate, isValidating } = useSwrHttp(
    "users/me",
    {
      populate: ["company"],
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      revalidateOnReconnect: false,
    }
  );

  async function handleLogin(email, password) {
    setIsLoading(true);
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
      router.push("/");
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.error?.message, {
        variant: "error",
      });
    }
    setIsLoading(false);
  }

  async function handleLogout() {
    setIsLoading(true);
    reactLocalStorage.remove("jwt");
    await mutate({}, true);
    enqueueSnackbar("Logout Success", {
      variant: "success",
    });
    setIsLoading(false);
    router.push("/login");
  }

  return {
    userData: data,
    userDataIsValidating: isValidating,
    userDataIsLoading: isLoading,
    mutateUserData: mutate,
    handleLogin,
    handleLogout,
  };
}

export default useUser;
