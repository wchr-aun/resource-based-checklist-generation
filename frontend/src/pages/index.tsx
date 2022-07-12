import type { NextPage } from "next";
import ChecklistCreate from "@features/checklistCreate/create";
import ChecklistFinished from "@features/checklistFinished/finish";
import ProcessInput from "@features/processInput/ProcessInput";
import store from "@app/store";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { resetForm, setForm } from "@features/form/formSlice";
import Router from "next/router";
import { getTemplate, getTemplates } from "api/template";
import { getDependencies } from "api/dependency";
import {
  resetDependencies,
  setDependencies,
} from "@features/form/dependencySlice";
import Modal from "@components/Modal";
import { useEffect, useRef, useState } from "react";
import { Template } from "@models";
import { resetForeignTable } from "@features/form/foreignTableSlice";
import { deleteChecklist } from "api/checklist";
import { setLoading } from "@app/loadingSlice";
import { selectEnv } from "@app/envSlice";
import { selectProcess } from "@features/processInput/processSlice";

const Home: NextPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const openModal = useRef((v: boolean) => {});
  const env = useAppSelector(selectEnv);
  const dispatch = useAppDispatch();
  const callGenerateApi = async (autolink: boolean) => {
    dispatch(setLoading(true));
    const templateResponse = await getTemplate(
      store.getState().processInput.process,
      autolink,
      env
    );
    const dependencyResponse = await getDependencies(
      store.getState().processInput.process,
      env
    );
    dispatch(setLoading(false));
    dispatch(setForm(templateResponse));
    dispatch(setDependencies(dependencyResponse));
    Router.push("/canvas");
    openModal.current(false);
  };

  const callViewApi = async (id: number) => {
    Router.push(`/checklist/view/${id}`);
  };

  const callDeleteApi = async (id: number) => {
    await deleteChecklist(id, env);
    const res = await getTemplates(env);
    setTemplates(res.templates);
  };

  useEffect(() => {
    dispatch(setLoading(true));
    getTemplates(env).then((res) => {
      setTemplates(res.templates);
      dispatch(setLoading(false));
    });
    dispatch(selectProcess(""));
    return () => {};
  }, [env]);

  useEffect(() => {
    dispatch(resetForm());
    dispatch(resetDependencies());
    dispatch(resetForeignTable());
    return () => {};
  }, []);

  return (
    <div className="grid grid-cols-1 space-y-5">
      <div className="lg:px-64 py-8 bg-gray-100 lg:-mx-32 -mx-8 px-8 -my-4">
        <ChecklistCreate
          onClickCreateTemplate={() => openModal.current(true)}
        />
      </div>
      <div className="pt-8">
        <ChecklistFinished
          templates={templates}
          onClickStart={(id) => callViewApi(id)}
          onClickDelete={(id) => callDeleteApi(id)}
        />
      </div>
      <style>{"body { background-color: white; }"}</style>
      <Modal
        openModal={openModal}
        body={
          <ProcessInput
            onClickCreate={(autolink) => callGenerateApi(autolink)}
          />
        }
      />
    </div>
  );
};

export default Home;
