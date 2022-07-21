import { selectAppVersion } from "@app/envSlice";
import { useAppSelector } from "@app/hooks";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

function Footer() {
  const appVersion = useAppSelector(selectAppVersion);
  useEffect(() => {
    const cacheVersion = window.localStorage.getItem("appVersion") || "";
    if (cacheVersion !== appVersion) {
      window.localStorage.clear();
      window.localStorage.setItem("appVersion", appVersion);
    }
  }, []);

  return (
    <footer className="p-4 flex justify-center">
      <div className="w-fit text-sm text-gray-500 text-center opacity-50 hover:opacity-100">
        <div>
          © 2022{" "}
          <a href="http://www.workflowfm.com/" target="_blank">
            WorkflowFM
          </a>
          . All Rights Reserved.
        </div>
        <span className="cursor-pointer text-xs">
          <a href={process.env.GITHUB_URL} target="_blank">
            <FontAwesomeIcon className="mr-1" icon={faGithub} />
            GitHub: {process.env.GITHUB_URL?.replace("https://github.com/", "")}
          </a>
        </span>
        {" | "} Version: {appVersion}
      </div>
    </footer>
  );
}

export default Footer;
