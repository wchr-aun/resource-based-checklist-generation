import type { NextPage } from "next";
import ChecklistCreate from "@features/checklistCreate/create";
import ChecklistFinished from "@features/checklistFinished/finish";
import ProcessInput from "@features/processInput/ProcessInput";
import store from "@app/store";
import { useAppDispatch } from "@app/hooks";
import { setForm } from "@features/form/formSlice";
import Router from "next/router";
import { getTemplate, getTemplates } from "api/template";
import { getDependencies } from "api/dependency";
import { setDependencies } from "@features/form/dependencySlice";
import Modal from "@components/Modal";
import { useRef } from "react";
import { Template } from "@models";

interface Props {
  templates: Template[];
}

const Home: NextPage<Props> = (props: Props) => {
  const { templates } = props;
  const openModal = useRef((v: boolean) => {});
  const dispatch = useAppDispatch();
  const callApi = async () => {
    const templateResponse = await getTemplate(
      store.getState().processInput.process
    );
    const dependencyResponse = await getDependencies(
      store.getState().processInput.process
    );
    dispatch(setForm(templateResponse));
    dispatch(setDependencies(dependencyResponse));
    Router.push("/canvas");
    openModal.current(false);
  };

  return (
    <div className="grid grid-cols-1 space-y-5">
      <div className="lg:px-64 py-8 bg-gray-100 lg:-mx-32 -mx-8 px-8 -my-4">
        <ChecklistCreate
          onClickCreateTemplate={() => openModal.current(true)}
        />
      </div>
      <div className="pt-8">
        <ChecklistFinished templates={templates} />
      </div>
      <style>{"body { background-color: white; }"}</style>
      <Modal
        openModal={openModal}
        body={<ProcessInput onClickCreate={() => callApi()} />}
      />
    </div>
  );
};

Home.getInitialProps = async () => {
  const res = await getTemplates();
  return { templates: res.templates };
};

export default Home;
