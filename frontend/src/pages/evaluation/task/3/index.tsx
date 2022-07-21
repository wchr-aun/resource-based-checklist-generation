import { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import { useAppDispatch } from "@app/hooks";
import { setLoading } from "@app/loadingSlice";
import { setDependencies } from "@features/form/dependencySlice";
import { setForm } from "@features/form/formSlice";
import { getDependencies } from "api/dependency";
import { getTemplate } from "api/template";
import Modal from "@components/Modal";
import ProcessInput from "@features/processInput/ProcessInput";
import { useEffect, useRef } from "react";
import { setEnv } from "@app/envSlice";
import { updateProcessInput } from "@features/processInput/processSlice";
import { healthcareExamples } from "@app/healthcareExamples";

const Task2: NextPage = () => {
  const dispatch = useAppDispatch();
  const openModal = useRef((v: boolean) => {});
  const callGenerateApi = async (autogen: boolean) => {
    dispatch(setLoading(true));
    const templateResponse = await getTemplate(
      JSON.stringify(healthcareExamples[0]),
      autogen,
      "healthcare"
    );
    const dependencyResponse = await getDependencies(
      JSON.stringify(healthcareExamples[0]),
      "healthcare"
    );
    dispatch(setLoading(false));
    dispatch(setForm(templateResponse));
    dispatch(setDependencies(dependencyResponse));
    Router.push("/evaluation/task/3/canvas");
  };

  useEffect(() => {
    dispatch(
      updateProcessInput(JSON.stringify(healthcareExamples[0], null, 2))
    );
    dispatch(setEnv("healthcare"));
  }, []);

  return (
    <div className="space-y-2 mb-8">
      <Head>
        <title>Task 3 - Resource-based Checklist Generation</title>
      </Head>
      <div className="border border-transparent rounded-lg bg-white py-8 px-16 text-center space-y-5">
        <div className="text-bold text-3xl underline">Task 3</div>
        <div className="text-left">
          <span className="font-bold text-lg mr-1">Scenario:</span>
          You are a checklist designer for a healthcare workflow. A doctor asks
          you to create a checklist template for an AwardContract process. In
          this process, a clinician agrees to another member of clinical staff,
          (the ServiceProvider) to provide a medical service on their behalf
          (i.e. delegating the task to someone else). The process contains two
          useful pieces of input information: the ServiceProvider that contains
          information on the doctor who is assigned to the contract, and
          AcceptedContract that contains information about the contract itself
          (i.e. the nature of the clinical task, details about the patient,
          etc).
          <br />
          <br />
          You need to create a checklist template based on the scenario above
          with fully linked dependencies followed the Format Required. You are
          also allowed to use any help tools introduced in Task 2 to perform
          this task; however, there are no instructions in this task..
          <br />
          <br />
          More details are provided in the Google Forms.
        </div>
        <button
          className="border rounded-lg px-5 py-3 border-indigo-500 text-indigo-500 hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700"
          onClick={() => openModal.current(true)}
        >
          Start Task 3
        </button>
      </div>
      <Modal
        openModal={openModal}
        body={
          <ProcessInput onClickCreate={(autogen) => callGenerateApi(autogen)} />
        }
      />
    </div>
  );
};

export default Task2;
