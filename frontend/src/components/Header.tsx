import Link from "next/link";
import { useRouter } from "next/router";

function Header() {
  const router = useRouter();
  return (
    <div>
      {router.pathname !== "/preview" &&
        !router.pathname.includes("/checklist") && (
          <nav className="flex items-center justify-between flex-wrap bg-white p-6 text-indigo-900">
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
          </nav>
        )}
      {router.pathname.includes("/checklist") && (
        <nav className="flex items-center justify-between flex-wrap bg-white p-6 text-indigo-900">
          <Link href="/">
            <div className="flex items-center flex-shrink-0 mr-6 cursor-pointer">
              <span className="font-semibold text-xl">WorkflowFM:</span>
              <span className="text-lg ml-2 font-extrabold capitalize">
                Checklist #{router.query.id}
              </span>
            </div>
          </Link>
        </nav>
      )}
      {router.pathname === "/preview" && (
        <nav className="flex items-center justify-between flex-wrap bg-white p-6 text-indigo-900 shadow-sm">
          <Link href="/canvas">
            <div className="flex items-center flex-shrink-0 mr-6 cursor-pointer">
              <span className="font-semibold text-xl">WorkflowFM:</span>
              <span className="text-lg ml-2 font-extrabold capitalize">
                Back to Canvas
              </span>
            </div>
          </Link>
        </nav>
      )}
    </div>
  );
}

export default Header;
