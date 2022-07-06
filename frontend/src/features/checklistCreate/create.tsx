import { useAppDispatch } from "@app/hooks";
import { chooseProcess } from "@features/processInput/processSlice";
import { faFile, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface Props {
  onClickCreateTemplate: () => void;
}

function ChecklistCreate(props: Props) {
  const { onClickCreateTemplate } = props;
  const [recentModels, setRecentModels] = useState<string[]>([]);
  const dispatch = useAppDispatch();
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
          <div className="h-max border-dashed flex justify-center py-9 px-16 rounded-md bg-white text-indigo-800 hover:text-indigo-700 hover:bg-indigo-50 hover:border-solid border-2 hover:border-indigo-800 border-gray-400">
            <FontAwesomeIcon icon={faPlus} size="3x" />
          </div>
          <div className="text-center text-sm">Create a New Template</div>
        </div>
        {recentModels.length > 0 && (
          <div className="hidden lg:inline-block overflow-x-auto">
            <div className="text-sm underline text-gray-700 absolute">
              Recent Models
            </div>
            <div className="flex space-x-3 mt-5">
              {recentModels.map((name, i) => (
                <div
                  className="relative flex-col space-y-0 w-min cursor-pointer hover:underline"
                  key={i}
                  onClick={() => {
                    dispatch(chooseProcess(name));
                    onClickCreateTemplate();
                  }}
                >
                  <span className="absolute text-white text-2xl border-2 py-11 px-10 rounded-lg hover:border-indigo-900 border-transparent">
                    &#60;/&#62;
                  </span>
                  <FontAwesomeIcon
                    icon={faFile}
                    size="6x"
                    className="text-indigo-900 py-3 px-6"
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
