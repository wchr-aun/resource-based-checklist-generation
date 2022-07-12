import { selectEnv, setEnv } from "@app/envSlice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import Dropdown from "./inputs/Dropdown";

function Header() {
  const router = useRouter();
  const env = useAppSelector(selectEnv);
  const dispatch = useAppDispatch();

  const onChangeEnv = (env: string) => {
    dispatch(setEnv(env as "healthcare" | "payment"));
    router.query.env = env;
    router.push(router);
  };

  return (
    <div>
      <nav className="flex items-center justify-between flex-wrap bg-white p-6 text-indigo-900">
        {router.pathname !== "/preview" &&
          !router.pathname.includes("/checklist") && (
            <Link href="/">
              <div className="flex items-center flex-shrink-0 mr-6 cursor-pointer">
                <span className="font-semibold text-xl">WorkflowFM:</span>
                <span className="text-lg ml-2 font-extrabold capitalize">
                  {router.pathname === "/"
                    ? "Checklist Generation Tool"
                    : router.pathname.replace("/", "")}
                </span>
              </div>
            </Link>
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
        {router.pathname === "/preview" && (
          <Link href="/canvas">
            <div className="flex items-center flex-shrink-0 mr-6 cursor-pointer">
              <span className="font-semibold text-xl">WorkflowFM:</span>
              <span className="text-lg ml-2 font-extrabold capitalize">
                Back to Canvas
              </span>
            </div>
          </Link>
        )}
        {router.pathname === "/" ? (
          <div>
            <Dropdown
              className="uppercase"
              options={["healthcare", "payment"]}
              value={env}
              name="Select Env"
              onUpdateValue={(_, value) => onChangeEnv(value)}
            />
          </div>
        ) : (
          <div className="uppercase text-sm">{env}</div>
        )}
      </nav>
    </div>
  );
}

export default Header;
