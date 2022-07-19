import { NextPage } from "next";
import FormTemplate from "@features/form/Form";
import Head from "next/head";
import Hint from "@features/hint/Hint";
import ScrollToTop from "@features/ScrollToTop/ScrollToTop";
import { Form } from "@models";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { setLoading } from "@app/loadingSlice";
import { resetDependencies } from "@features/form/dependencySlice";
import { resetForm } from "@features/form/formSlice";
import { saveTask } from "api/evaluation";
import { selectEvalId } from "@app/envSlice";

const Task1Canvas: NextPage = () => {
  const evalId = useAppSelector(selectEvalId);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const onSubmit = async (f: Form) => {
    dispatch(setLoading(true));

    const success = await saveTask(evalId, "task1", f);
    if (!success) {
      dispatch(setLoading(false));
      return;
    }

    dispatch(resetDependencies);
    dispatch(resetForm);

    dispatch(setLoading(false));
    router.push("/evaluation/task/1/follow-up");
  };

  return (
    <div>
      <ScrollToTop />
      <Hint
        children={
          <div>
            <span className="font-bold text-lg mr-1">Scenario:</span>
            You are a checklist designer of a healthcare workflow. A doctor asks
            you to create a checklist template from "AwardContract" process.
            AwardContract is the process which the doctor who is assigned to the
            contract decides to change the status of the contract from
            `assigned` to `open`. The process contains two useful input
            information including "ServiceProvider" and "AcceptedContract"
            models. ServiceProvider is the information of the doctor who is
            assigned to the contract, while AcceptedContract is the contract
            itself.
            <br />
            <br />
            You need to create a checklist template based on the scenario above.
            The template must include ONLY the following input information:
            doctor's name, doctor's surname, and service name. All other input
            information must be HIDDEN.
            <br />
            <br />
            Read more details in the Google Forms.
          </div>
        }
      />
      <Head>
        <title>Canvas Task 1: Resource-based Checklist Generation</title>
      </Head>

      <FormTemplate isEval={true} onEvalSubmit={onSubmit} />
    </div>
  );
};

export default Task1Canvas;
