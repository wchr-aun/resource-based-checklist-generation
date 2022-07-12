import {
  faAngleDown,
  faAngleUp,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NextPage } from "next";

interface Props {
  order: number;
  childrenNo: number;
  onClick: (action: "UP" | "DOWN") => void;
  array?: boolean;
}

const Reorder: NextPage<Props> = (props) => {
  const { order, childrenNo, onClick, array = false } = props;
  return (
    <div className="flex space-x-1 w-full h-full">
      <div className="w-1/4 lg:px-3 lg:ml-1 flex self-center justify-center">
        {order <= 0 && order >= childrenNo ? (
          <button disabled className="text-xs py-2 w-full">
            <FontAwesomeIcon icon={faMinus} />
          </button>
        ) : (
          <div>
            <div
              className={
                order > 0 ? (order < childrenNo ? "-mb-2" : "") : "hidden"
              }
            >
              <button
                className="text-xs w-full border-2 border-transparent rounded-full focus:border-indigo-500 px-0.5"
                onClick={() => onClick("UP")}
              >
                <FontAwesomeIcon icon={faAngleUp} />
              </button>
            </div>
            <div className={order < childrenNo ? "" : "hidden"}>
              <button
                className="text-xs w-full border-2 border-transparent rounded-full focus:border-indigo-500 px-0.5"
                onClick={() => onClick("DOWN")}
              >
                <FontAwesomeIcon icon={faAngleDown} />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex self-center justify-center w-3/4 border-l-2">
        {array && "["}#{order + 1}
        {array && "]"}
      </div>
    </div>
  );
};

export default Reorder;
