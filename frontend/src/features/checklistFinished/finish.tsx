import type { NextPage } from "next";
import Checklist from "@components/ChecklistIcon";

const ChecklistFinished: NextPage = () => {
  return (
    <div>
      <div className="font-bold underline mb-5 text-teal-500">Finished</div>
      <Checklist checklistName="Test" />
    </div>
  );
};

export default ChecklistFinished;
