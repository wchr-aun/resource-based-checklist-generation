import { NextPage } from "next";
import Head from "next/head";
import { useAppDispatch } from "@app/hooks";
import { setLoading } from "@app/loadingSlice";
import { setDependencies } from "@features/form/dependencySlice";
import { setForm } from "@features/form/formSlice";
import { getDependencies } from "api/dependency";
import { getTemplate } from "api/template";
import Router from "next/router";
import { setEnv } from "@app/envSlice";
import Modal from "@components/Modal";
import ProcessInput from "@features/processInput/ProcessInput";
import { updateProcessInput } from "@features/processInput/processSlice";
import { useEffect, useRef } from "react";
import { paymentExamples } from "@app/paymentExamples";

const Task1FollowUp: NextPage = () => {
  const openModal = useRef((v: boolean) => {});
  const dispatch = useAppDispatch();
  const callGenerateApi = async () => {
    dispatch(setLoading(true));
    const templateResponse = await getTemplate(
      JSON.stringify(paymentExamples[0]),
      true,
      "payment"
    );
    const dependencyResponse = await getDependencies(
      JSON.stringify(paymentExamples[0]),
      "payment"
    );
    dispatch(setLoading(false));
    dispatch(setForm(templateResponse));
    dispatch(setDependencies(dependencyResponse));
    Router.push("/evaluation/task/2/canvas");
  };

  useEffect(() => {
    dispatch(updateProcessInput(JSON.stringify(paymentExamples[0], null, 2)));
    dispatch(setEnv("payment"));
  }, []);

  return (
    <div className="space-y-2 mb-8">
      <Head>
        <title>Task 2 - Resource-based Checklist Generation</title>
      </Head>
      <div className="border border-transparent rounded-lg bg-white py-8 px-16 text-center space-y-5">
        <div className="text-bold text-3xl underline">Task 2</div>
        <div className="text-left">
          In this task, the scenario is still the same as Task 1. However,
          instead of manually adding information fields and form fields, you
          will be using help tools provided by the system.
          <br />
          <br />
          More details are provided in the Google Forms.
        </div>
        <button
          className="border rounded-lg px-5 py-3 border-indigo-500 text-indigo-500 hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700"
          onClick={() => openModal.current(true)}
        >
          Start Task 2
        </button>
      </div>
      <Modal
        openModal={openModal}
        body={
          <ProcessInput
            onClickCreate={() => callGenerateApi()}
            blockNoAutoGen={true}
          />
        }
      />
    </div>
  );
};

export default Task1FollowUp;
