import { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import { useAppDispatch } from "@app/hooks";
import { setLoading } from "@app/loadingSlice";
import { setDependencies } from "@features/form/dependencySlice";
import { setForm } from "@features/form/formSlice";
import { getDependencies } from "api/dependency";
import { getTemplate } from "api/template";
import { healthcareExamples } from "@app/healthcareExamples";
import Modal from "@components/Modal";
import ProcessInput from "@features/processInput/ProcessInput";
import { useEffect, useRef } from "react";
import { setEnv } from "@app/envSlice";
import { resetProcessInput } from "@features/processInput/processSlice";

const Task3: NextPage = () => {
  const dispatch = useAppDispatch();
  const openModal = useRef((v: boolean) => {});
  const callGenerateApi = async (autogen: boolean) => {
    dispatch(setLoading(true));
    const templateResponse = await getTemplate(
      JSON.stringify(healthcareExamples[2]),
      autogen,
      "healthcare"
    );
    const dependencyResponse = await getDependencies(
      JSON.stringify(healthcareExamples[2]),
      "healthcare"
    );
    dispatch(setLoading(false));
    dispatch(setForm(templateResponse));
    dispatch(setDependencies(dependencyResponse));
    Router.push("/evaluation/task/5/canvas");
  };

  useEffect(() => {
    dispatch(resetProcessInput());
    dispatch(setEnv("healthcare"));
  }, []);

  return (
    <div className="space-y-2 mb-8">
      <Head>
        <title>Task 5 - Resource-based Checklist Generation</title>
      </Head>
      <div className="border border-transparent rounded-lg bg-white py-8 px-16 text-center space-y-5">
        <div className="text-bold text-3xl underline">Task 5</div>
        <div className="text-left">
          <span className="font-bold text-lg mr-1">Scenario:</span>
          You are a checklist designer of a healthcare workflow. A doctor wants
          you to create a checklist template for ProvideService process.
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
            1. OpenContract is one of the input information in this process. It
            contains six fields: idcontract, reqservid, providerid,
            time_requested, time_opened, and stateid.
          </div>
          <div className="ml-5">
            2. PendingHealthcare is both one of the input information and one of
            the output of this process. It contains nine fields: idreqserv,
            requesterid, serviceid, patientid, responsibleid, date, type,
            stateid, and notes.
          </div>
          <div className="ml-5">
            3. CompletedHealthcareService is another output of this process. It
            shares the same fields as PendingHealthcare: idreqserv, requesterid,
            serviceid, patientid, responsibleid, date, type, stateid, and notes.
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
          healthcare workflow. A doctor wants you to create a checklist template
          for ProvideService process. ProvideService is the process which the
          doctor who is assigned to perform a healthcare service to either 1.)
          update the status of the service from `pending` to `completed` or 2.)
          inform about obstacles have occurred and are blocking any further
          progress. The process contains two input information models namely
          OpenContract and PendingHealthcareService and expects the output to be
          either 1.) CompletedHealthcareService or 2.) Obstacle and
          PendingHealthcareService.
          <span className="italic">
            Hint: you may find the template auto-generation useful.
          </span>
          <br />
          <br />
          More details are provided in the Google Forms.
        </div>
        <button
          className="border rounded-lg px-5 py-3 border-indigo-500 text-indigo-500 hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700"
          onClick={() => openModal.current(true)}
        >
          Start Task 5
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

export default Task3;
