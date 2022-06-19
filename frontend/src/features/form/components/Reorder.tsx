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
    <span className="flex space-x-1 w-full">
      {order !== 0 && (
        <button
          className="rounded-lg bg-slate-300 text-gray-800 w-full"
          onClick={() => onClick("UP")}
        >
          <FontAwesomeIcon icon={faAngleUp} />
        </button>
      )}
      {order !== childrenNo && (
        <button
          className="rounded-lg bg-slate-300 text-gray-800 w-full"
          onClick={() => onClick("DOWN")}
        >
          <FontAwesomeIcon icon={faAngleDown} />
        </button>
      )}
    </span>
  );
};

export default Reorder;
