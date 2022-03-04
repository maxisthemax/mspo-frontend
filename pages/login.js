import { useEffect } from "react";
import { useRouter } from "next/router";
import { reactLocalStorage } from "reactjs-localstorage";

//*lodash

//*components
import { Button } from "components/Buttons";

//*material-ui
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

//*useSwr
import useUser from "useSwr/user/useUser";
const ISSERVER = typeof window === "undefined";

//*zustand

function Login() {
  //*define
  const router = useRouter();
  const { userData, handleLogin } = useUser();

  //zustand

  //*states

  //*const
  const jwt = ISSERVER || reactLocalStorage.get("jwt");

  //*let

  //*ref

  //*useEffect
  useEffect(() => {
    if (userData?.id) {
      router.push("/");
    }
  }, [userData, router, jwt]);

  //*functions
  const onSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await handleLogin(data.get("email"), data.get("password"));
  };

  return (
    !jwt && (
      <Container component="main" maxWidth="xs">
        <Box width="100%" mt="50%">
          <Box component="form" onSubmit={onSubmit} noValidate>
            <Stack spacing={3}>
              <Typography variant="h3">MYEZGM</Typography>
              <Typography variant="h5">LOGIN</Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email / Username"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button type="submit" size="large">
                LOGIN
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    )
  );
}

export default Login;
