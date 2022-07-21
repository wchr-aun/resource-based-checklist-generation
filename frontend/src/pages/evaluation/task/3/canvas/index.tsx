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

const Task2Canvas: NextPage = () => {
  const evalId = useAppSelector(selectEvalId);
  const dispatch = useAppDispatch();
  const onSubmit = async (f: Form) => {
    dispatch(setLoading(true));

    const success = await saveTask(evalId, "task3", f);
    if (!success) {
      dispatch(setLoading(false));
      return;
    }

    dispatch(setLoading(false));
    dispatch(resetDependencies);
    dispatch(resetForm);
    Router.push("/evaluation/task/4");
  };

  return (
    <div>
      <ScrollToTop />
      <Hint
        children={
          <div>
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
            <div className="ml-5">
              1. OrderTransaction is the input information of this process. It
              contains three main fields: id, customer_id, and total_price.
            </div>
            <div className="ml-5">
              2. CardDetails is the only output of this process. The output form
              is required to link to three fields within this output in order to
              fulfil the data model. The fields are card_no, expire, and code.
            </div>
            <br />
            You need to create a checklist template based on the scenario above
            with the output being fully linked with the form. The template must
            match with the format given below. You need to create a checklist
            template based on the scenario above.
            <br />
            <br />
            More details are provided in the Google Forms.
          </div>
        }
      />
      <Head>
        <title>Canvas Task 3: Resource-based Checklist Generation</title>
      </Head>

      <FormTemplate isEval={true} onEvalSubmit={onSubmit} />
    </div>
  );
};

export default Task2Canvas;
