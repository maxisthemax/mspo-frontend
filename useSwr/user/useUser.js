import { useEffect, useState } from "react";
import axios from "utils/http-anxios";
import { useRouter } from "next/router";
import { reactLocalStorage } from "reactjs-localstorage";
import { useSnackbar } from "notistack";
import useCountDown from "react-countdown-hook";
import moment from "moment";

//*components
import { Button } from "components/Buttons";

//useSwr
import useSwrHttp from "useSwr/useSwrHttp";

//*const
const ISSERVER = typeof window === "undefined";

const initialTime = 60 * 1000; // initial time in milliseconds, defaults to 60000
const interval = 1000; // interval to change remaining time amount, defaults to 1000

function useUser() {
  //*define
  const [timeLeft, { start }] = useCountDown(initialTime, interval);
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const { data, mutate, isValidating, error } = useSwrHttp("users/me", {
    populate: ["company"],
  });
  const jwt = ISSERVER || reactLocalStorage.get("jwt");
  const timer_login_attempt =
    ISSERVER || reactLocalStorage.get("timer_login_attempt");

  async function handleLogin(email, password) {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      if (error) {
        enqueueSnackbar(
          error?.response?.data?.error?.message ||
            error?.response?.data?.message[0].messages[0].message,
          {
            variant: "error",
          }
        );

        if (error?.response?.statusText === "Too Many Requests") {
          {
            reactLocalStorage.set(
              "timer_login_attempt",
              moment(new Date()).add(1, "m").toDate()
            );
            start();
          }
        }

        setIsLoading(false);
      }
    }
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

  async function handleRelogin() {
    setIsLoading(true);
    reactLocalStorage.remove("jwt");
    await mutate({}, true);
    setIsLoading(false);
    router.push("/login");
  }

  useEffect(() => {
    if (jwt && error) {
      const action = () => (
        <Button
          onClick={() => {
            closeSnackbar();
            handleRelogin();
          }}
        >
          Login
        </Button>
      );

      enqueueSnackbar("Please Login Again", {
        variant: "warning",
        persist: true,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
        action,
      });
    }
  }, [error]);

  useEffect(() => {
    const timeLeft = moment.duration(
      moment(new Date(timer_login_attempt)).diff(moment(new Date()))
    );
    if (timeLeft) {
      start(timeLeft.asMilliseconds());
    }
  }, []);

  return {
    userData: data,
    userDataIsValidating: isValidating,
    userDataIsLoading: isLoading,
    mutateUserData: mutate,
    handleLogin,
    handleLogout,
    timeLeft,
  };
}

export default useUser;
