import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import components from "./components";
import typography from "./typography";
import { primaryColor, secondaryColor } from "utils/constant";

// Create a theme instance.

const palette = {
  primary: {
    main: primaryColor,
  },
  secondary: {
    main: secondaryColor,
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
