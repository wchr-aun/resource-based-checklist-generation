import { faClipboardList, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NextPage } from "next";
import Link from "next/link";
import Checklist from "./checklist";

const ChecklistCreate: NextPage = () => {
  return (
    <div>
      <div className="font-bold underline mb-5 text-teal-500">
        Start A Checklist
      </div>
      <div className="flex space-x-5">
        <Link href="/canvas">
          <div className="flex-col w-24 cursor-pointer">
            <div className="h-max border border-dashed flex justify-center py-11 px-5 rounded-md bg-gray-100 text-gray-400 hover:bg-gray-50">
              <FontAwesomeIcon icon={faPlus} size="2x" />
            </div>
            <div className="text-center text-sm">Create a Template</div>
          </div>
        </Link>
        <Checklist checklistName="Create" />
      </div>
    </div>
  );
};

export default ChecklistCreate;
