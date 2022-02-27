//*components
import { Button } from "components/Buttons";

//*material-ui
import Box from "@mui/material/Box";

//*useSwr
import useTicket from "useSwr/useTicket";
import useUser from "useSwr/useUser";

export default function Home() {
  const { ticketData, addTicket } = useTicket();
  const { handleLogin } = useUser();

  return (
    <Box>
      {ticketData?.data[0].attributes.ticket_no}
      <Button
        onClick={() => {
          handleLogin("mail@mail.com", "test123");
        }}
      >
        Login
      </Button>
      <Button
        onClick={() => {
          addTicket();
        }}
      >
        ADD
      </Button>
      Ticket
    </Box>
  );
}
