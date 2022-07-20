import { NextPage } from "next";
import FormTemplate from "@features/form/Form";
import Head from "next/head";
import Hint from "@features/hint/Hint";
import ScrollToTop from "@features/ScrollToTop/ScrollToTop";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { setLoading } from "@app/loadingSlice";
import { Form } from "@models";
import Router from "next/router";
import { resetDependencies } from "@features/form/dependencySlice";
import { resetForm } from "@features/form/formSlice";
import Link from "next/link";
import { selectEvalId } from "@app/envSlice";
import { saveTask } from "api/evaluation";

const Task3Canvas: NextPage = () => {
  const evalId = useAppSelector(selectEvalId);
  const dispatch = useAppDispatch();
  const onSubmit = async (f: Form) => {
    dispatch(setLoading(true));

    const success = await saveTask(evalId, "task5", f);
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
      <Hint
        children={
          <div>
            <span className="font-bold text-lg mr-1">Scenario:</span>
            You are a checklist designer of a healthcare workflow. A doctor
            wants you to create a checklist template for ProvideService process.
            ProvideService is the process which the doctor who is assigned to
            perform a healthcare service to either 1.) update the status of the
            service from `pending` to `completed` or 2.) inform about obstacles
            have occurred and are blocking any further progress. The process
            contains two input information models namely OpenContract and
            PendingHealthcareService and expects the output to be either 1.)
            CompletedHealthcareService or 2.) Obstacle and
            PendingHealthcareService.
            <br />
            <br />
            <span className="italic">
              Hint: you may find the template auto-generation useful.
            </span>
            <br />
            <br />
            You need to create a checklist template based on the scenario above
            <br />
            <br />
            More details are provided in the Google Forms.
          </div>
        }
      />
      <Head>
        <title>Canvas Task 5: Resource-based Checklist Generation</title>
      </Head>

      <FormTemplate isEval={true} onEvalSubmit={onSubmit} />
    </div>
  );
};

export default Task3Canvas;
