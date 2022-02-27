import PropsTypes from "prop-types";

//*material-ui
import Icon from "@mui/material/Icon";

//*style

function CustomIcon({
  active = true,
  icon,
  size = "default",
  color,
  width = "auto",
  height = "auto",
  variant = "filled",
}) {
  //*define

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
        color: color ? color : "",
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

CustomIcon.propTypes = {
  active: PropsTypes.bool,
  icon: PropsTypes.string,
  size: PropsTypes.string,
  color: PropsTypes.string,
  width: PropsTypes.number,
  height: PropsTypes.number,
};

export default CustomIcon;
