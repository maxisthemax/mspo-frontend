//*material-ui
import Icon from "@mui/material/Icon";

function CustomIcon({
  active = true,
  icon,
  size = "default",
  color = "inherit",
  width = "auto",
  height = "auto",
  variant = "filled",
}) {
  const baseClassName = {
    outlined: "material-icons-outlined",
    filled: "material-icons",
  };

  return icon ? (
    <Icon
      baseClassName={baseClassName[variant]}
      fontSize={size}
      style={{
        width: width,
        height: height,
        color: color ? color : "inherit",
        opacity: active ? "1" : "0.4",
        display: "flex",
        alignItems: "center",
      }}
      color={active ? "primary" : "action"}
    >
      {icon}
    </Icon>
  ) : null;
}

export default CustomIcon;
