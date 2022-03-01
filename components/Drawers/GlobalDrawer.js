import { useMemo } from "react";

//*lodash

//*components
import { CustomIcon } from "components/Icons";

//*material-ui
import makeStyles from "@mui/styles/makeStyles";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";

//*assets

//*zustand
import store from "./store";

//*utils

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

//*custom components

function GlobalDrawer({ size = 4, anchor = "right", maxHeight = "100%" }) {
  //*define
  const width = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const classes = useStyles();
  const smDown = useGetScreen("md", "down");

  //*zustand
  const open = store((state) => state.open);
  const drawerId = store((state) => state.drawerId);
  const closeDrawer = store((state) => state.closeDrawer);

  //*useMemo
  const drawerChildren = useMemo(() => {
    switch (drawerId) {
      case "transporter":
        return <div>transporter</div>;

      default:
        return <div />;
    }
  }, [drawerId]);

  return (
    <Drawer
      open={open}
      variant="temporary"
      anchor={anchor}
      PaperProps={{
        style: {
          width: `${smDown ? 100 : width[size]}%`,
          maxHeight: maxHeight,
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
      {drawerChildren}
    </Drawer>
  );
}

export default GlobalDrawer;
