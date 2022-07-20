import { NextPage } from "next";
import Head from "next/head";
import { useAppDispatch } from "@app/hooks";
import { setLoading } from "@app/loadingSlice";
import { setDependencies } from "@features/form/dependencySlice";
import { setForm } from "@features/form/formSlice";
import { getDependencies } from "api/dependency";
import { getTemplate } from "api/template";
import Router from "next/router";
import { paymentExamples } from "@app/paymentExamples";
import Modal from "@components/Modal";
import ProcessInput from "@features/processInput/ProcessInput";
import { useEffect, useRef } from "react";
import { setEnv } from "@app/envSlice";
import { updateProcessInput } from "@features/processInput/processSlice";

const Task2FollowUp: NextPage = () => {
  const dispatch = useAppDispatch();
  const openModal = useRef((v: boolean) => {});
  const callGenerateApi = async (autogen: boolean) => {
    dispatch(setLoading(true));
    const templateResponse = await getTemplate(
      JSON.stringify(paymentExamples[0]),
      autogen,
      "payment"
    );
    const dependencyResponse = await getDependencies(
      JSON.stringify(paymentExamples[0]),
      "payment"
    );
    dispatch(setLoading(false));
    dispatch(setForm(templateResponse));
    dispatch(setDependencies(dependencyResponse));
    Router.push("/evaluation/task/4/canvas");
  };

  useEffect(() => {
    dispatch(updateProcessInput(JSON.stringify(paymentExamples[0], null, 2)));
    dispatch(setEnv("payment"));
  }, []);

  return (
    <div className="space-y-2 mb-8">
      <Head>
        <title>Task 4 - Resource-based Checklist Generation</title>
      </Head>
      <div className="border border-transparent rounded-lg bg-white py-8 px-16 text-center space-y-5">
        <div className="text-bold text-3xl underline">Task 4</div>
        <div className="text-left">
          In this follow up task, the scenario is still the same as Task 3.
          However, instead of manually creating the form, you will select the
          auto-generation option.
          <br />
          <br />
          More details are provided in the Google Forms.
        </div>
        <button
          className="border rounded-lg px-5 py-3 border-indigo-500 text-indigo-500 hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700"
          onClick={() => openModal.current(true)}
        >
          Start Task 4
        </button>
      </div>
      <Modal
        openModal={openModal}
        body={
          <ProcessInput
            onClickCreate={(autogen) => callGenerateApi(autogen)}
            blockNoAutoGen={true}
          />
        }
      />
    </div>
  );
};

export default Task2FollowUp;
