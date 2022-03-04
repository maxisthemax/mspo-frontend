//*material-ui
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

//*zustand
import store from "./store";

//*custom components

function OverlayLoading() {
  //*zustand
  const open = store((state) => state.open);

  return (
    <Backdrop
      transitionDuration={{ appear: 0, enter: 0, exit: 2000 }}
      invisible={false}
      sx={{
        backgroundColor: "white",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={open}
    >
      <CircularProgress />
    </Backdrop>
  );
}

export default OverlayLoading;
