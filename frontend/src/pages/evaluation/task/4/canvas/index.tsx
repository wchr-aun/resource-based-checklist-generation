import { selectEvalId } from "@app/envSlice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { setLoading } from "@app/loadingSlice";
import { resetDependencies } from "@features/form/dependencySlice";
import FormTemplate from "@features/form/Form";
import { resetForm } from "@features/form/formSlice";
import Hint from "@features/hint/Hint";
import ScrollToTop from "@features/ScrollToTop/ScrollToTop";
import { Form } from "@models";
import { saveTask } from "api/evaluation";
import { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";

const Task2FollowUpCanvas: NextPage = () => {
  const evalId = useAppSelector(selectEvalId);
  const dispatch = useAppDispatch();
  const onSubmit = async (f: Form) => {
    dispatch(setLoading(true));

    const success = await saveTask(evalId, "task4", f);
    if (!success) {
      dispatch(setLoading(false));
      return;
    }

    dispatch(resetDependencies);
    dispatch(resetForm);

    dispatch(setLoading(false));
    Router.push("/evaluation/task/5");
  };

  return (
    <div>
      <ScrollToTop />
      <Hint
        children={
          <div>
            In this follow up task, the scenario is still the same as Task 3.
            However, instead of manually creating the form, you will select the
            auto-generation option.
            <br />
            <br />
            More details are provided in the Google Forms.
          </div>
        }
      />
      <Head>
        <title>Canvas Task 4: Resource-based Checklist Generation</title>
      </Head>

      <FormTemplate isEval={true} onEvalSubmit={onSubmit} />
    </div>
  );
};

export default Task2FollowUpCanvas;
