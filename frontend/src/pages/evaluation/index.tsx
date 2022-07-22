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
import Checkbox from "@components/inputs/Checkbox";
import Tooltip from "@components/Tooltip";

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
  const [agree, setAgree] = useState(false);
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

        <div className="border rounded-lg py-5 border-gray-400 bg-gray-50">
          <div>
            You need to do the tasks provided in
            <span className="underline text-indigo-700 ml-1">
              <a href="https://forms.gle/ZAebC667MWWBCcUe6" target="_blank">
                Google Forms
              </a>
            </span>
          </div>
          <div className="text-rose-500">
            <div className="text-xl">
              ** Please do not close the browser window during the survey. **
            </div>
            * If you do, you need to change the Evaluation ID in the Google
            Forms and start the whole evaluation again. *
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
                setTimeout(() => {
                  setCopyText("Copy");
                }, 1000);
              }}
            >
              {copyText}
            </button>
          </div>
        </div>
        <Divider />
        <div className="text-left">
          This project involves a checklist generation tool for WorkflowFM, a
          logic-based workflow management framework developed at the University
          of Edinburgh. A checklist generation tool is a tool to create
          checklists or forms (similarly to Google Forms, Microsoft Form, etc.)
          that allows people to perform tasks as part of a larger, collaborative
          workflow of individual processes.
          <br />
          <br />
          This survey aims to collect feedback related to user performance,
          functionality, and usability. All personal or identifiable information
          will be fully anonymised, therefore, please enter your opinions
          truthfully.
          <br />
          <br />
          <span className="font-bold">
            More details are provided in the Participant Information Sheet{" "}
            <a
              className="text-indigo-700 underline"
              href="https://github.com/wchr-aun/resource-based-checklist-generation/blob/main/overleaf/pdf/Participant%20Information%20Sheet%20.pdf"
              target="_blank"
            >
              Here
            </a>
          </span>
          <br />
          <br />
          <span className="italic">
            This survey has been approved by Informatics Research Ethics
            committee. <br /> The Ethics application number is 486463.
          </span>
          <br />
          <br />
          In the following sections, you will be given scenarios with tasks to
          do in order to generate specific checklists. In the first two tasks,
          instructions will be provided to help you get used to the system. In
          the final task, you will be given only the scenario and a list of
          things you need to do. Between each task, you will be asked to do a
          functionality questionnaire.
          <br />
          <br />
          After all the tasks are done, you will be asked to fill in a short
          questionnaire and an optional open-ended feedback at the end.
          <Divider className="py-10" />
          By participating in the study, you agree that: your opinions regarding
          the user interface and user experience will be used to evaluate the
          functionality and usability of the project.
          <div className="ml-5 list-disc">
            <li>
              I have read and understood the Participant Information Sheet for
              this study, I have had the opportunity to ask questions, and any
              questions I had were answered to my satisfaction.
            </li>
            <li>
              My participation is voluntary, and I can withdraw at any time
              without giving a reason. Withdrawing will not affect any of my
              rights.
            </li>
            <li>
              I consent to my anonymised data being used in an MSc Dissertation
              as well as potential academic publications and presentations.
            </li>
            <li>
              I understand that my anonymised data will be stored for the
              duration outlined in the Participant Information Sheet.
            </li>
            <li>
              I allow my data to be used in future ethically approved research.
            </li>
            <li>I agree to take part in this study.</li>
          </div>
        </div>
        <Divider />
        <div className="flex justify-center">
          <span className="text-rose-500 mr-2">*</span>
          <Checkbox
            name="I have read and agreed to both the Participant Information Sheet and
          the the Participant Consent Form above."
            checked={agree}
            onChecked={() => setAgree(!agree)}
          />
        </div>
        {agree ? (
          <Link href="/evaluation/task/1">
            <button className="border shadow-sm rounded-lg px-5 py-3 border-indigo-500 text-indigo-500 hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700">
              Start Evaluation
            </button>
          </Link>
        ) : (
          <div className="flex justify-center">
            <Tooltip
              className="w-fit"
              position="mb-12"
              tip="Please check the box to agree to the above statements."
            >
              <button
                disabled={true}
                className="border rounded-lg px-5 py-3 border-gray-400 text-gray-400 cursor-not-allowed"
              >
                Start Evaluation
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default Evaluation;
