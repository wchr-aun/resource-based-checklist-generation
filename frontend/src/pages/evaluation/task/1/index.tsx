import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAppDispatch } from "@app/hooks";
import { setLoading } from "@app/loadingSlice";
import store from "@app/store";
import { setDependencies } from "@features/form/dependencySlice";
import { setForm } from "@features/form/formSlice";
import { getDependencies } from "api/dependency";
import { getTemplate } from "api/template";
import Modal from "@components/Modal";
import ProcessInput from "@features/processInput/ProcessInput";
import { useEffect, useRef } from "react";
import { setEnv } from "@app/envSlice";
import { updateProcessInput } from "@features/processInput/processSlice";
import { paymentExamples } from "@app/paymentExamples";

const Task1: NextPage = () => {
  const dispatch = useAppDispatch();
  const openModal = useRef((v: boolean) => {});
  const router = useRouter();
  const callGenerateApi = async () => {
    dispatch(setLoading(true));
    const templateResponse = await getTemplate(
      JSON.stringify(paymentExamples[0]),
      false,
      "payment"
    );
    const dependencyResponse = await getDependencies(
      store.getState().processInput.process,
      "payment"
    );
    dispatch(setLoading(false));
    dispatch(setForm(templateResponse));
    dispatch(setDependencies(dependencyResponse));
    router.push("/evaluation/task/1/canvas");
  };

  useEffect(() => {
    dispatch(updateProcessInput(JSON.stringify(paymentExamples[0], null, 2)));
    dispatch(setEnv("payment"));
  }, []);

  return (
    <div className="space-y-2 mb-8">
      <Head>
        <title>Task 1 - Resource-based Checklist Generation</title>
      </Head>
      <div className="border border-transparent rounded-lg bg-white py-8 px-16 text-center space-y-5">
        <div className="text-bold text-3xl underline">Task 1</div>
        <div className="text-left">
          <span className="font-bold text-lg mr-1">Scenario:</span>
          You are a checklist designer for a payment workflow. The owner wants
          you to create a checklist template for a CardInput process. In this
          process, a customer needs to enter the credit/debit card number,
          expire date, and security code to pay for some purchased items. The
          process contains OrderTransaction as the input information, with
          fields as described below. Additionally, the output form needs to be
          linked with the CardDetails output of the workflow process.
          <br />
          <br />
          You will be given the instructions to create a checklist template
          based on the scenario above.
          <br />
          <br />
          More details are provided in the Google Forms.
        </div>
        <button
          className="border rounded-lg px-5 py-3 border-indigo-500 text-indigo-500 hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700"
          onClick={() => openModal.current(true)}
        >
          Start Task 1
        </button>
      </div>
      <Modal
        openModal={openModal}
        body={
          <ProcessInput
            onClickCreate={() => callGenerateApi()}
            blockYesAutoGen={true}
          />
        }
      />
    </div>
  );
};

export default Task1;
