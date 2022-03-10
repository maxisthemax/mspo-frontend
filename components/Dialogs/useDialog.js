import { useState, useCallback } from "react";

//*lodash

//*components
import { CustomIcon } from "components/Icons";
import { Button } from "components/Buttons";

//*material-ui
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

//*assets

//*redux

//*utils

//*helpers
import { useGetScreen } from "helpers/screenSizeHelpers";

//*style

//*custom components
function DialogComponent({
  title,
  open,
  handleCancel,
  handleOk,
  children,
  size = "sm",
  canCloseOutside = false,
  ...others
}) {
  //*define
  const smDown = useGetScreen("sm", "down");

  //*states

  //*const

  //*let

  //*ref

  //*useEffect

  //*functions

  return (
    <Dialog
      fullScreen={smDown}
      open={open}
      maxWidth={size}
      fullWidth={true}
      onClose={canCloseOutside ? handleCancel : null}
      {...others}
    >
      <AppBar sx={{ position: "relative" }} color="primary" variant="dense">
        <Toolbar variant="dense">
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {title}
              </Typography>
            </Box>
            <Box>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCancel}
                aria-label="close"
              >
                <CustomIcon icon="close" color="white" />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <DialogContent dividers>
        <Box>{children}</Box>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        {handleOk && <Button onClick={handleOk}>Ok</Button>}
      </DialogActions>
    </Dialog>
  );
}

const useDialog = (defaultOpen = false) => {
  const [open, setOpen] = useState(defaultOpen);
  const [params, setParams] = useState();

  //*functions
  const handleOpenDialog = (params) => {
    setParams(params);
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setParams(null);
    setOpen(false);
  };

  const Dialog = useCallback(
    ({ children, ...props }) => {
      if (open)
        return (
          <DialogComponent
            open={open}
            handleCancel={() => setOpen(false)}
            {...props}
          >
            {children}
          </DialogComponent>
        );
      else return <div></div>;
    },
    [open]
  );

  return { isOpen: open, handleOpenDialog, handleCloseDialog, Dialog, params };
};

export default useDialog;
