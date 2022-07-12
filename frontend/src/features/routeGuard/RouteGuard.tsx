import { useAppSelector } from "@app/hooks";
import { selectProcessName } from "@features/form/formSlice";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface Props {
  children: JSX.Element;
}

function RouteGuard(props: Props) {
  const { children } = props;
  const router = useRouter();
  const isSet = useAppSelector(selectProcessName);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // on initial load - run auth check
    console.log(isSet, ": test");
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSet]);

  function authCheck(url: string) {
    // redirect to login page if accessing a private page and not logged in
    const path = url.split("?")[0];
    if (!isSet && path !== "/" && !path.includes("/checklist/view")) {
      setAuthorized(false);
      router.push({
        pathname: "/",
      });
    } else {
      setAuthorized(true);
    }
  }

  return authorized ? children : null;
}

export default RouteGuard;
