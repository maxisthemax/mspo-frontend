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

function Login() {
  //*define
  const { handleLogin } = useUser();

  //*states

  //*const

  //*let

  //*ref

  //*useEffect

  //*functions
  const onSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await handleLogin(data.get("email"), data.get("password"));
  };

  return (
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
  );
}

export default Login;
