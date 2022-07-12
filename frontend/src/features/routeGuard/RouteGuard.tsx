import { setEnv } from "@app/envSlice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    // on initial load - run auth check
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
    const split = url.split("?");
    const path = split[0];
    const env = split.filter((v) => v.includes("env="))[0]?.replace("env=", "");

    if (env) dispatch(setEnv(env as "healthcare" | "payment"));

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
