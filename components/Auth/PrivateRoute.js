import { useEffect } from "react";
import { useRouter } from "next/router";

//useSwr
import useUser from "useSwr/user/useUser";

//constant
import { protectedRoutesPath } from "utils/constant";

export default function PrivateRoute({ children }) {
  const router = useRouter();
  const { userData, userDataIsValidating, userDataIsLoading } = useUser();

  const pathIsProtected = protectedRoutesPath.indexOf(router.pathname) !== -1;

  useEffect(() => {
    if (
      !userDataIsValidating &&
      !userData?.id &&
      pathIsProtected &&
      !userDataIsLoading
    ) {
      router.push("/login");
    }
  }, [userDataIsValidating, userData?.id, pathIsProtected, userDataIsLoading]);

  if (!userData?.id && pathIsProtected) {
    return <div />;
  }

  return children;
}
