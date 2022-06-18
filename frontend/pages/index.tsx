import type { NextPage } from "next";
import ChecklistCreate from "../components/checklist/create";
import ChecklistFinished from "../components/checklist/finish";
import ChecklistInProgess from "../components/checklist/in-progress";
import Divider from "../components/divider";

const Home: NextPage = () => {
  return (
    <div className="grid grid-cols-1">
      <ChecklistInProgess />
      <Divider />
      <ChecklistCreate />
      <Divider />
      <ChecklistFinished />
    </div>
  );
};

export default Home;
