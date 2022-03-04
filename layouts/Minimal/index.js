//*material-ui
import Box from "@mui/material/Box";

function Main({ children }) {
  return <Box sx={{ display: "flex", textAlign: "center" }}>{children}</Box>;
}

export default Main;
