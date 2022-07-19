import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAppDispatch } from "@app/hooks";
import { setLoading } from "@app/loadingSlice";
import { healthcareExamples } from "@app/healthcareExamples";
import store from "@app/store";
import { setDependencies } from "@features/form/dependencySlice";
import { setForm } from "@features/form/formSlice";
import { getDependencies } from "api/dependency";
import { getTemplate } from "api/template";

const Task1: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const callGenerateApi = async () => {
    dispatch(setLoading(true));
    const templateResponse = await getTemplate(
      JSON.stringify(healthcareExamples[0]),
      false,
      "healthcare"
    );
    const dependencyResponse = await getDependencies(
      store.getState().processInput.process,
      "healthcare"
    );
    dispatch(setLoading(false));
    dispatch(setForm(templateResponse));
    dispatch(setDependencies(dependencyResponse));
    router.push("/evaluation/task/1/canvas");
  };

  return (
    <div className="space-y-2 mb-8">
      <Head>
        <title>Task 1 - Resource-based Checklist Generation</title>
      </Head>
      <div className="border border-transparent rounded-lg bg-white py-8 px-16 text-center space-y-5">
        <div className="text-bold text-3xl underline">Task 1</div>
        <div className="text-left">
          <span className="font-bold text-lg mr-1">Scenario:</span>
          You are a checklist designer of a healthcare workflow. A doctor asks
          you to create a checklist template from "AwardContract" process.
          AwardContract is the process which the doctor who is assigned to the
          contract decides to change the status of the contract from `assigned`
          to `open`. The process contains two useful input information including
          "ServiceProvider" and "AcceptedContract" models. ServiceProvider is
          the information of the doctor who is assigned to the contract, while
          AcceptedContract is the contract itself.
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
        <button
          className="border rounded-lg px-5 py-3 border-indigo-500 text-indigo-500 hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700"
          onClick={() => callGenerateApi()}
        >
          Start Task 1
        </button>
      </div>
    </div>
  );
};

export default Task1;
