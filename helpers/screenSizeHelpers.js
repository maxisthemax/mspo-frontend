import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export function useGetScreen(size, direction) {
  const theme = useTheme();

  let themeBreakpoint;

  if (direction === "up") themeBreakpoint = theme.breakpoints.up(size);
  else if (direction === "down") themeBreakpoint = theme.breakpoints.down(size);

  return useMediaQuery(themeBreakpoint, {
    defaultMatches: true,
  });
}
