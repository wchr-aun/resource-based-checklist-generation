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
            <div className="ml-5">
              1. OpenContract is one of the input information in this process.
              It contains six fields: idcontract, reqservid, providerid,
              time_requested, time_opened, and stateid.
            </div>
            <div className="ml-5">
              2. PendingHealthcare is both one of the input information and one
              of the output of this process. It contains nine fields: idreqserv,
              requesterid, serviceid, patientid, responsibleid, date, type,
              stateid, and notes.
            </div>
            <div className="ml-5">
              3. CompletedHealthcareService is another output of this process.
              It shares the same fields as PendingHealthcare: idreqserv,
              requesterid, serviceid, patientid, responsibleid, date, type,
              stateid, and notes.
            </div>
            <div className="ml-5">
              4. Obstacle is one of the output of this process. It only has one
              field which is name.
            </div>
            <br />
            <span className="italic">
              Hint: you may find the template auto-generation useful.
            </span>
            <br />
            <br />
            You need to create a checklist template based on the scenario above
            with the output being fully linked with the form. The template must
            match with the format given below. You are a checklist designer of a
            healthcare workflow. A doctor wants you to create a checklist
            template for ProvideService process. ProvideService is the process
            which the doctor who is assigned to perform a healthcare service to
            either 1.) update the status of the service from `pending` to
            `completed` or 2.) inform about obstacles have occurred and are
            blocking any further progress. The process contains two input
            information models namely OpenContract and PendingHealthcareService
            and expects the output to be either 1.) CompletedHealthcareService
            or 2.) Obstacle and PendingHealthcareService.
            <span className="italic">
              Hint: you may find the template auto-generation useful.
            </span>
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
