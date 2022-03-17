//*components
import { CustomIcon } from "components/Icons";

//*material-ui
import makeStyles from "@mui/styles/makeStyles";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";

//*helpers
import { useGetScreen } from "helpers/screenSizeHelpers";

//*style
const useStyles = makeStyles((theme) => ({
  drawerClose: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: theme.spacing(1),
  },
}));

function GlobalDrawer({
  open,
  anchor = "right",
  size = 4,
  closeDrawer,
  children,
}) {
  //*define
  const width = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const classes = useStyles();
  const smDown = useGetScreen("md", "down");

  return (
    <Drawer
      open={open}
      variant="temporary"
      anchor={anchor}
      PaperProps={{
        style: {
          width: `${smDown ? 100 : width[size]}%`,
          maxHeight: "100%",
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      onClose={closeDrawer}
    >
      {smDown && (
        <div className={classes.drawerClose}>
          <IconButton onClick={closeDrawer} size="small">
            <CustomIcon icon="close" />
          </IconButton>
        </div>
      )}
      {children}
    </Drawer>
  );
}

export default GlobalDrawer;
