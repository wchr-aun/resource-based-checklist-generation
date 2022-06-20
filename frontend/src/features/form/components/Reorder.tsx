import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NextPage } from "next";

interface Props {
  order: number;
  childrenNo: number;
  onClick: (action: "UP" | "DOWN") => void;
}

const Reorder: NextPage<Props> = (props) => {
  const { order, childrenNo, onClick } = props;
  return (
    <div className="flex space-x-1 w-full">
      {order > 0 && (
        <button
          className="py-2 w-full rounded-md border border-gray-300 shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-teal-500"
          onClick={() => onClick("UP")}
        >
          <FontAwesomeIcon icon={faAngleUp} />
        </button>
      )}
      {order < childrenNo && (
        <button
          className="py-2 w-full rounded-md border border-gray-300 shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-teal-500"
          onClick={() => onClick("DOWN")}
        >
          <FontAwesomeIcon icon={faAngleDown} />
        </button>
      )}
    </div>
  );
};

export default Reorder;
