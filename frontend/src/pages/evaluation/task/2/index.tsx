import { NextPage } from "next";
import Head from "next/head";
import { useAppDispatch } from "@app/hooks";
import { setLoading } from "@app/loadingSlice";
import { healthcareExamples } from "@app/healthcareExamples";
import { setDependencies } from "@features/form/dependencySlice";
import { setForm } from "@features/form/formSlice";
import { getDependencies } from "api/dependency";
import { getTemplate } from "api/template";
import Router from "next/router";

const Task1FollowUp: NextPage = () => {
  const dispatch = useAppDispatch();
  const callGenerateApi = async () => {
    dispatch(setLoading(true));
    const templateResponse = await getTemplate(
      JSON.stringify(healthcareExamples[0]),
      false,
      "healthcare"
    );
    const dependencyResponse = await getDependencies(
      JSON.stringify(healthcareExamples[0]),
      "healthcare"
    );
    dispatch(setLoading(false));
    dispatch(setForm(templateResponse));
    dispatch(setDependencies(dependencyResponse));
    Router.push("/evaluation/task/2/canvas");
  };

  return (
    <div className="space-y-2 mb-8">
      <Head>
        <title>Task 2 - Resource-based Checklist Generation</title>
      </Head>
      <div className="border border-transparent rounded-lg bg-white py-8 px-16 text-center space-y-5">
        <div className="text-bold text-3xl underline">Task 2</div>
        <div className="text-left">
          In this follow up task, the scenario is still the same as Task 1.
          However, instead of manually query more information, you will perform
          query the information from the suggestion option.
          <br />
          <br />
          More details are provided in the Google Forms.
        </div>
        <button
          className="border rounded-lg px-5 py-3 border-indigo-500 text-indigo-500 hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700"
          onClick={() => callGenerateApi()}
        >
          Start Task 2
        </button>
      </div>
    </div>
  );
};

export default Task1FollowUp;
