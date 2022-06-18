import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NextPage } from "next";

interface Props {
  checklistName: string;
}

const Checklist: NextPage<Props> = (prop) => {
  const { checklistName } = prop;
  return (
    <div className="flex-col space-y-2 w-min cursor-pointer">
      <FontAwesomeIcon icon={faClipboardList} size="7x" color="#9ca3af" />
      <div className="flex justify-center text-sm">{checklistName}</div>
    </div>
  );
};

export default Checklist;
