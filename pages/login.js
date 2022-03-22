import { useEffect } from "react";
import { useRouter } from "next/router";
import { reactLocalStorage } from "reactjs-localstorage";
import { Form } from "react-final-form";
import moment from "moment";
import { ThreeDots } from "react-loader-spinner";

//*components
import { Button } from "components/Buttons";
import { TextFieldForm } from "components/Form";

//*material-ui
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

//*useSwr
import useUser from "useSwr/user/useUser";
const ISSERVER = typeof window === "undefined";

//*zustand

//*validation
import { loginValidate } from "validation";

function Login() {
  //*define
  const router = useRouter();
  const { userData, handleLogin, userDataIsLoading, timeLeft } = useUser();

  //*const
  const jwt = ISSERVER || reactLocalStorage.get("jwt");

  //*useEffect
  useEffect(() => {
    if (userData?.id) {
      router.push("/");
    }
  }, [userData, router, jwt]);

  //*functions
  const onSubmit = async (data) => {
    if (!userDataIsLoading) {
      await handleLogin(data.emailUsername, data.password);
    }
  };
  const disabledFromLogin = timeLeft > 0;

  return (
    !jwt && (
      <Container component="main" maxWidth="xs">
        <Box width="100%" mt="50%">
          <Form
            validate={loginValidate}
            onSubmit={onSubmit}
            validateOnBlur={false}
            render={({ handleSubmit, submitting }) => {
              return (
                <form id="loginForm" onSubmit={handleSubmit} noValidate>
                  <Stack spacing={3}>
                    <Typography variant="h3">MYEZGM</Typography>
                    <Typography variant="h5">LOGIN</Typography>
                    {disabledFromLogin && (
                      <Typography variant="warningz" color="error">
                        Too Many Attemtps, Please Retry In{" "}
                        {Math.floor(
                          moment.duration(timeLeft, "milliseconds").asSeconds()
                        )}{" "}
                        seconds
                      </Typography>
                    )}
                    <TextFieldForm
                      disabled={
                        submitting || userDataIsLoading || disabledFromLogin
                      }
                      label="Email / Username"
                      name="emailUsername"
                      required={true}
                    />
                    <TextFieldForm
                      disabled={
                        submitting || userDataIsLoading || disabledFromLogin
                      }
                      label="Password"
                      name="password"
                      type="password"
                      required={true}
                    />
                    <Button
                      type="submit"
                      size="large"
                      disabled={
                        submitting || userDataIsLoading || disabledFromLogin
                      }
                      sx={{ height: "42.5px" }}
                    >
                      {!userDataIsLoading ? (
                        "LOGIN"
                      ) : (
                        <ThreeDots color="inherit" height="30" width="100" />
                      )}
                    </Button>
                  </Stack>
                </form>
              );
            }}
          />
        </Box>
      </Container>
    )
  );
}

export default Login;
