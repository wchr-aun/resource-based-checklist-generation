import { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import { useAppDispatch } from "@app/hooks";
import { setLoading } from "@app/loadingSlice";
import { setDependencies } from "@features/form/dependencySlice";
import { setForm } from "@features/form/formSlice";
import { getDependencies } from "api/dependency";
import { getTemplate } from "api/template";
import { paymentExamples } from "@app/paymentExamples";
import Modal from "@components/Modal";
import ProcessInput from "@features/processInput/ProcessInput";
import { useEffect, useRef } from "react";
import { setEnv } from "@app/envSlice";
import { updateProcessInput } from "@features/processInput/processSlice";

const Task2: NextPage = () => {
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
          <span className="font-bold text-lg mr-1">Scenario:</span>
          You are a checklist designer of a transaction workflow. The owner
          wants you to create a checklist template for "CardInput" process.
          CardInput is the process which requires the credit/debit card number,
          expire date and security code for a given transaction. CardInput
          contains only "Transaction" model as the input information.
          Additionally, the form needs to be connected with the "CardDetails"
          output of the workflow process.
          <br />
          <br />
          Read more details in the Google Forms.
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
          <ProcessInput onClickCreate={(autogen) => callGenerateApi(autogen)} />
        }
      />
    </div>
  );
};

export default Task2;
