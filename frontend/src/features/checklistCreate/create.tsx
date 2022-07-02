import { faClipboardList, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Template } from "@models";
import { useEffect, useState } from "react";

interface Props {
  onClickCreateTemplate: () => void;
}

function ChecklistCreate(props: Props) {
  const { onClickCreateTemplate } = props;
  // const recentModels = window.localStorage.getItem("recentModels")?.split(",") || [];
  const [recentModels, setRecentModels] = useState<string[]>([]);
  useEffect(() => {
    setRecentModels(
      window.localStorage
        .getItem("recentModels")
        ?.split(",")
        .filter((v) => v) || []
    );
    return () => {
      setRecentModels([]);
    };
  }, []);
  return (
    <div>
      <div className="flex space-x-5 justify-center lg:justify-start">
        <div
          className={`flex-col cursor-pointer self-end ${
            recentModels.length ? "lg:pr-8 lg:border-r lg:border-gray-400" : ""
          }`}
          onClick={onClickCreateTemplate}
        >
          <div className="h-max border-dashed flex justify-center py-9 px-16 rounded-md bg-white text-gray-500 hover:border-solid border-2 hover:border-sky-900 border-gray-400">
            <FontAwesomeIcon icon={faPlus} size="3x" />
          </div>
          <div className="text-center text-sm">Create a New Template</div>
        </div>
        {recentModels.length > 0 && (
          <div className="hidden lg:inline-block overflow-auto">
            <div className="text-sm underline text-gray-700">Recent Models</div>
            <div className="flex space-x-3">
              {recentModels.map((name, i) => (
                <div
                  className="flex-col space-y-0 w-min cursor-pointer text-gray-500 hover:underline"
                  key={i}
                >
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    size="7x"
                    className="hover:border-2 hover:border-solid hover:border-sky-900 border-2 border-transparent py-1 px-4 rounded-lg"
                  />
                  <div className="flex justify-center text-sm text-gray-900">
                    {name.length > 17 ? `${name.substring(0, 14)}...` : name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChecklistCreate;
