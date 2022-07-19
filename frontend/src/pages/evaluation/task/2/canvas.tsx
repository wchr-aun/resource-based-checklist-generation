import { NextPage } from "next";
import FormTemplate from "@features/form/Form";
import Hint from "@features/hint/Hint";
import ScrollToTop from "@features/ScrollToTop/ScrollToTop";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { setLoading } from "@app/loadingSlice";
import { resetDependencies } from "@features/form/dependencySlice";
import { resetForm } from "@features/form/formSlice";
import { Form } from "@models";
import Router from "next/router";
import Head from "next/head";
import { saveTask } from "api/evaluation";
import { selectEvalId } from "@app/envSlice";
import Link from "next/link";

const Task2Canvas: NextPage = () => {
  const evalId = useAppSelector(selectEvalId);
  const dispatch = useAppDispatch();
  const onSubmit = async (f: Form) => {
    dispatch(setLoading(true));

    const success = await saveTask(evalId, "task2", f);
    if (!success) {
      dispatch(setLoading(false));
      return;
    }

    dispatch(setLoading(false));
    dispatch(resetDependencies);
    dispatch(resetForm);
    Router.push("/evaluation/task/2/follow-up");
  };

  return (
    <div>
      <div className="underline mb-5 flex justify-center text-bold text-lg">
        <Link href="./">
          <span className="cursor-pointer capitalize">
            Click Here to Restart This Task
          </span>
        </Link>
      </div>

      <ScrollToTop />
      <Hint
        children={
          <div>
            <span className="font-bold text-lg mr-1">Scenario:</span>
            You are a checklist designer of a transaction workflow. The owner
            wants you to create a checklist template for "CardInput" process.
            CardInput is the process which requires the credit/debit card
            number, expire date and security code for a given transaction.
            CardInput contains only "Transaction" model as the input
            information. Additionally, the form needs to be connected with the
            "CardDetails" output of the workflow process.
            <br />
            <br />
            Read more details in the Google Forms.
          </div>
        }
      />
      <Head>
        <title>Canvas Task 2: Resource-based Checklist Generation</title>
      </Head>

      <FormTemplate isEval={true} onEvalSubmit={onSubmit} />
    </div>
  );
};

export default Task2Canvas;
