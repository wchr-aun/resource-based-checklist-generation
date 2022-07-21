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

    const success = await saveTask(evalId, "task3", f);
    if (!success) {
      dispatch(setLoading(false));
      return;
    }

    dispatch(setLoading(false));
    dispatch(resetDependencies);
    dispatch(resetForm);
    Router.push("/evaluation/done");
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
      <Head>
        <title>Canvas Task 3: Resource-based Checklist Generation</title>
      </Head>

      <FormTemplate isEval={true} onEvalSubmit={onSubmit} />
    </div>
  );
};

export default Task2Canvas;
