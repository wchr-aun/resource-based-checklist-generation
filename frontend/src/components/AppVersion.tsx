import { selectAppVersion } from "@app/envSlice";
import { useAppSelector } from "@app/hooks";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

function AppVersion() {
  const appVersion = useAppSelector(selectAppVersion);
  useEffect(() => {
    const cacheVersion = window.localStorage.getItem("appVersion") || "";
    if (cacheVersion !== appVersion) {
      window.localStorage.clear();
      window.localStorage.setItem("appVersion", appVersion);
    }
  }, []);

  return (
    <div className="fixed opacity-20 bottom-0.5 left-0.5 bg-gray-700 px-3 py-1 text-gray-200 text-xs hover:opacity-40">
      <span className="cursor-pointer">
        <a href={process.env.GITHUB_URL} target="_blank">
          <FontAwesomeIcon className="mr-1" icon={faGithub} />
          GitHub
        </a>
      </span>
      {" - "}
      Application Version: {appVersion}
    </div>
  );
}

export default AppVersion;
