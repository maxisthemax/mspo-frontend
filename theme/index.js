import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import components from "./components";
import typography from "./typography";

// Create a theme instance.

const palette = {
  primary: {
    main: "#333333",
  },
  secondary: {
    main: "#555555",
  },
  error: {
    main: red.A400,
  },
};

const baseTheme = {
  palette,
  components,
  typography,
};

const theme = createTheme(baseTheme);

export default theme;
