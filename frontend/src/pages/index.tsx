import type { NextPage } from "next";
import ChecklistCreate from "@features/checklistCreate/create";
import ChecklistFinished from "@features/checklistFinished/finish";
import ChecklistInProgess from "@features/checklistInProgress/in-progress";
import Divider from "@components/Divider";
import ProcessInput from "@features/processInput/ProcessInput";
import store from "@app/store";
import { useAppDispatch } from "@app/hooks";
import { setForm } from "@features/form/formSlice";
import Router from "next/router";

const defaultTemplate = {
  name: "AwardContract",
  inputs: [
    {
      argType: "VARR",
      name: "AcceptedContract",
      args: [],
    },
    {
      argType: "VARR",
      name: "ServiceProvider",
      args: [],
    },
  ],
  output: {
    argType: "VARR",
    name: "OpenContract",
    args: [],
  },
};

const jsonValidation = (s: string) => {
  try {
    JSON.parse(s);
    return s;
  } catch {
    return JSON.stringify(defaultTemplate);
  }
};

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const callApi = async () => {
    const res = await fetch(`${process.env.BACKEND_URL}/template`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonValidation(store.getState().processInput.process),
    }).catch((error) => {
      console.log(error);
    });
    if (!res) return {};
    const templateResponse = await res.json();

    dispatch(setForm(templateResponse));
    Router.push("/canvas");
  };

  return (
    <div className="grid grid-cols-1 space-y-5">
      <div className="lg:px-64 py-8 bg-gray-100 lg:-mx-32 -mx-8 px-8 -my-4">
        <ChecklistCreate onClickCreateTemplate={() => callApi()} />
      </div>
      <div className="pt-5">
        <ChecklistInProgess />
      </div>
      <Divider />
      <ChecklistFinished />
      <Divider />
      <ProcessInput />
      <style>{"body { background-color: white; }"}</style>
    </div>
  );
};

export default Home;
