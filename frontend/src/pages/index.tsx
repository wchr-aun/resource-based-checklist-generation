import type { NextPage } from "next";
import ChecklistCreate from "@features/checklistCreate/create";
import ChecklistFinished from "@features/checklistFinished/finish";
import ChecklistInProgess from "@features/checklistInProgress/in-progress";
import Divider from "@components/Divider";
import ProcessInput from "@features/processInput/ProcessInput";

const Home: NextPage = () => {
  return (
    <div className="grid grid-cols-1">
      <ChecklistInProgess />
      <Divider />
      <ChecklistCreate />
      <Divider />
      <ChecklistFinished />
      <Divider />
      <ProcessInput />
    </div>
  );
};

export default Home;
