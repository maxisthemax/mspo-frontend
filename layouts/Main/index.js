import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import { useRouter } from "next/router";

//*components
import { CustomIcon } from "components/Icons";

//*material-ui
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

//*const
const pages = [
  { label: "Ticket", url: "ticket" },
  { label: "Transporter", url: "transporter" },
];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Main({ children }) {
  //*define
  const router = useRouter();
  const userMenuPopupState = usePopupState({
    variant: "popover",
    popupId: "userMenu",
  });
  const navPopupState = usePopupState({
    variant: "popover",
    popupId: "userMenu",
  });

  return (
    <>
      <AppBar position="static">
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            >
              MYEZGM
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                {...bindTrigger(navPopupState)}
              >
                <CustomIcon icon="menu" />
              </IconButton>
              <Menu {...bindMenu(navPopupState)}>
                {pages.map((page) => (
                  <MenuItem
                    key={page.url}
                    onClick={() => router.push(page.url)}
                  >
                    <Typography textAlign="center">{page.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              MYEZGM
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page.url}
                  sx={{ my: 2, color: "white", display: "block" }}
                  onClick={() => router.push(page.url)}
                >
                  {page.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton {...bindTrigger(userMenuPopupState)} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: 6 }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                {...bindMenu(userMenuPopupState)}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth={false}>
        <Toolbar disableGutters variant="dense" />
        {children}
      </Container>
    </>
  );
}

export default Main;
