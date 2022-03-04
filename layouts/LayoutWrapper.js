import { useRouter } from "next/router";

//*lodash
import includes from "lodash/includes";

//*components
import Main from "./Main";
import Minimal from "./Minimal";

const minimialPath = ["/login", "/signup"];

function LayoutWrapper({ children }) {
  const router = useRouter();
  if (includes(minimialPath, router.pathname))
    return <Minimal>{children}</Minimal>;
  else return <Main>{children}</Main>;
}

export default LayoutWrapper;
