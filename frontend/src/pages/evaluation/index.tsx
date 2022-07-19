import { useAppDispatch } from "@app/hooks";
import Divider from "@components/Divider";
import Input from "@components/inputs/Input";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { setEvalId } from "@app/envSlice";
import { bookEvalId } from "api/evaluation";
import { setLoading } from "@app/loadingSlice";

const Evaluation: NextPage = () => {
  function makeid() {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const [evalId, setEid] = useState(makeid());
  const [copyText, setCopyText] = useState("Copy");
  const dispatch = useAppDispatch();

  const bookingEvalId = async () => {
    let success = false;
    let id = evalId;
    while (!success) {
      dispatch(setLoading(true));
      success = await bookEvalId(id);
      dispatch(setLoading(false));
      if (!success) id = makeid();
    }
    setEid(id);
    dispatch(setEvalId(id));
  };

  useEffect(() => {
    bookingEvalId();
  }, []);

  return (
    <div className="space-y-2 mb-8">
      <Head>
        <title>Evaluation - Resource-based Checklist Generation</title>
      </Head>
      <div className="border border-transparent rounded-lg bg-white py-8 px-16 text-center space-y-5">
        <div className="text-bold text-3xl underline">User Evaluation</div>
        <div className="text-left">
          This project is a checklist generation tool for WorkflowFM, a
          logic-based workflow management framework developed at the University
          of Edinburgh. A checklist generation tool is a tool that can generate
          a checklist given the workflow process and the data models of each
          process. In other words, this tool is a form generator (such as Google
          Forms, Office Forms, etc.) for workflow management framework.
          <br />
          <br />
          This survey is to collect the data of user performance, functionality
          score, and usability score. All the personal information is anonymous,
          therefore, please enter your opinions truthfully.
          <br />
          <br />
          In the following sections, you will be given scenarios with tasks to
          do. In the first two tasks, there will be detailed instructions
          provided to help you get used to the system. In the final task, you
          will be given only the scenario and a list of things you need to do.
          Between each task, you will be asked to do functionality
          questionnaire.
          <br />
          <br />
          After all the tasks are done, you will be asked to do usability
          questionnaire. Then, followed by an optional open-ended feedback at
          the end.
        </div>
        <Divider />
        <div>
          You need to do the tasks provided in
          <span className="underline text-indigo-500 ml-1">
            <a href="https://forms.gle/ZAebC667MWWBCcUe6" target="_blank">
              Google Forms
            </a>
          </span>
        </div>
        <div className="text-rose-500">
          <div className="text-xl">
            ** Please do not close the browser window during the survey **
          </div>
          * If you do, you need to change the Evaluation ID in the Google Forms
          and start the whole evaluation again *
        </div>
        <div className="flex justify-center">
          <div className="flex items-center">Evaluation ID:</div>
          <div className="w-1/12 ml-2 flex items-center">
            <Input placeholder={evalId} value={evalId} autoFocus={true} />
          </div>
          <button
            className="ml-2 border border-indigo-500 text-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-50"
            onClick={() => {
              navigator.clipboard.writeText(evalId);
              setCopyText("Copied!");
              setInterval(() => {
                setCopyText("Copy");
              }, 1000);
            }}
          >
            {copyText}
          </button>
        </div>
        <Link href="/evaluation/task/1">
          <button className="border rounded-lg px-5 py-3 border-indigo-500 text-indigo-500 hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700">
            Start Evaluation
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Evaluation;
