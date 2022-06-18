import type { NextPage } from "next";
import Checklist from "./checklist";

const ChecklistInProgess: NextPage = () => {
  return (
    <div>
      <div className="font-bold underline mb-5 text-teal-500">In Progress</div>
      <Checklist checklistName="Test" />
    </div>
  );
};

export default ChecklistInProgess;
