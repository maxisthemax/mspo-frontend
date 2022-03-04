import { useEffect } from "react";
import { useRouter } from "next/router";

//useSwr
import useUser from "useSwr/user/useUser";

//constant
import { protectedRoutesPath } from "utils/constant";

export default function PrivateRoute({ children }) {
  const router = useRouter();
  const { userData, isValidating } = useUser();

  const pathIsProtected = protectedRoutesPath.indexOf(router.pathname) !== -1;

  useEffect(() => {
    if (!isValidating && !userData?.id && pathIsProtected) {
      router.push("/login");
    }
  }, [isValidating, userData?.id, pathIsProtected]);

  if (!userData?.id && pathIsProtected) {
    return <div />;
  }

  return children;
}
