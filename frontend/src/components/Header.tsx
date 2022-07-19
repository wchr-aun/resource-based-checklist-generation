import { selectEnv, selectEvalId, setEnv } from "@app/envSlice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import Dropdown from "./inputs/Dropdown";

function Header() {
  const router = useRouter();
  const env = useAppSelector(selectEnv);
  const evalId = useAppSelector(selectEvalId);
  const dispatch = useAppDispatch();

  const onChangeEnv = (env: string) => {
    dispatch(setEnv(env as "healthcare" | "payment"));
    router.query.env = env;
    router.push(router);
  };

  return (
    <div>
      <nav className="flex items-center justify-between flex-wrap bg-white p-6 text-indigo-900">
        {!router.pathname.includes("/preview") &&
          !router.pathname.includes("/checklist") && (
            <div
              className="flex items-center flex-shrink-0 mr-6 cursor-pointer"
              onClick={() =>
                !router.pathname.includes("/evaluation/") && Router.push("/")
              }
            >
              <span className="font-semibold text-xl">WorkflowFM:</span>
              <span className="text-lg ml-2 font-extrabold capitalize">
                {router.pathname === "/"
                  ? "Checklist Generation Tool"
                  : router.pathname.replace(/\//g, " ")}
              </span>
            </div>
          )}
        {router.pathname.includes("/checklist") && (
          <Link href="/">
            <div className="flex items-center flex-shrink-0 mr-6 cursor-pointer">
              <span className="font-semibold text-xl">WorkflowFM:</span>
              <span className="text-lg ml-2 font-extrabold capitalize">
                Checklist #{router.query.id}
              </span>
            </div>
          </Link>
        )}
        {router.pathname.includes("/preview") && (
          <Link href={Router.asPath.replace("/preview", "")}>
            <div className="flex items-center flex-shrink-0 mr-6 cursor-pointer">
              <span className="font-semibold text-xl">WorkflowFM:</span>
              <span className="text-lg ml-2 font-extrabold capitalize">
                Back to Canvas
              </span>
            </div>
          </Link>
        )}
        {router.pathname === "/" ? (
          <div className="flex space-x-3">
            <Link href="/evaluation">
              <div className="flex self-center w-full cursor-pointer">
                Go to Evaluation
              </div>
            </Link>
            <Dropdown
              className="uppercase"
              options={["healthcare", "payment"]}
              value={env}
              name="Select Env"
              onUpdateValue={(_, value) => onChangeEnv(value)}
            />
          </div>
        ) : !router.pathname.includes("/evaluation") ? (
          <div className="uppercase text-sm">{env}</div>
        ) : (
          <div className="text-sm">EvalID: {evalId}</div>
        )}
      </nav>
    </div>
  );
}

export default Header;
