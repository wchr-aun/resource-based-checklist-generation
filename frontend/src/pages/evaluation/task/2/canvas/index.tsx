import { NextPage } from "next";
import FormTemplate from "@features/form/Form";
import Head from "next/head";
import Hint from "@features/hint/Hint";
import ScrollToTop from "@features/ScrollToTop/ScrollToTop";
import { Form } from "@models";
import Router from "next/router";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { setLoading } from "@app/loadingSlice";
import { resetDependencies } from "@features/form/dependencySlice";
import { resetForm } from "@features/form/formSlice";
import { saveTask } from "api/evaluation";
import { selectEvalId } from "@app/envSlice";
import Divider from "@components/Divider";
import Tabs from "@components/Tabs";
import { useState } from "react";

const Task1FollowUpCanvas: NextPage = () => {
  const evalId = useAppSelector(selectEvalId);
  const dispatch = useAppDispatch();
  const onSubmit = async (f: Form) => {
    dispatch(setLoading(true));

    const success = await saveTask(evalId, "task2", f);
    if (!success) {
      dispatch(setLoading(false));
      return;
    }

    dispatch(resetDependencies);
    dispatch(resetForm);
    dispatch(setLoading(false));
    Router.push("/evaluation/task/3");
  };

  const [currentTab, setCurrentTab] = useState(0);

  return (
    <div>
      <ScrollToTop />
      <Hint
        name="Instructions"
        children={
          <div className="overflow-auto" style={{ maxHeight: "70vh" }}>
            <Tabs
              tabs={["Instructions", "Format Required"]}
              currentTab={currentTab}
              onTabChange={(v) => setCurrentTab(v)}
            />
            {currentTab === 0 ? (
              <div className="px-3 pt-1">
                <div className="text-lg font-bold">Instructions</div>
                <div>
                  These instructions are given in order to help users create a
                  template according to the{" "}
                  <span
                    className="cursor-pointer underline text-indigo-700"
                    onClick={() => setCurrentTab(1)}
                  >
                    Format Required
                  </span>
                  .
                </div>
                <div className="ml-5 list-decimal">
                  <li>Click on "Start Task 2" to start the task.</li>
                  <li>
                    Create an <span className="italic">CardInput</span> process
                    template WITH auto-generation.
                  </li>
                  <li>Change the name of the form to "Card Details Form".</li>
                  <li>
                    Hide the <span className="italic">customer_id</span> field
                    in the input information section (second section).
                  </li>
                  <li>
                    Then, query 2 new fields using id of the{" "}
                    <span className="italic">OrderTransaction</span> using the
                    suggestion option (is now enabled!).
                    <br />
                    <div className="ml-4 italic">
                      (Hint: You may need to delete unused fields from the
                      suggestion.)
                    </div>
                  </li>
                  <li>
                    Change the 4 remaining field names to{" "}
                    <span className="italic">
                      "Order ID", "Transaction ID", "Item ID",
                    </span>
                    {" and "}
                    <span className="italic">"Total Price".</span>
                  </li>
                  <li>
                    Check the position of each input information field is in
                    order as followed by the{" "}
                    <span
                      className="cursor-pointer underline text-indigo-700"
                      onClick={() => setCurrentTab(1)}
                    >
                      Format Required
                    </span>{" "}
                    tab.
                  </li>
                  <li>
                    Change the name of the{" "}
                    <span className="italic">OrderTransaction</span> to
                    "Purchased Items".
                  </li>
                  <li>
                    In the form adjustment section (last section), check each
                    field in the section if they all follow the{" "}
                    <span
                      className="cursor-pointer underline text-indigo-700"
                      onClick={() => setCurrentTab(1)}
                    >
                      Format Required
                    </span>{" "}
                    tab (names, types, dependencies, etc.).
                  </li>
                  <li>
                    Preview the result to check the template. It should look
                    like the figure given in{" "}
                    <a
                      href="/images/EvaluationPreview.png"
                      className="text-indigo-700 underline"
                      target="_blank"
                    >
                      Preview
                    </a>
                    .
                  </li>
                  <li>Click on the "Create" button to complete the task.</li>
                </div>
              </div>
            ) : (
              <div className="px-3 pt-1">
                <div className="text-lg font-bold">Format Required</div>
                <div className="ml-5">
                  <div>
                    <span className="font-bold">Form Name:</span> Card Details
                    Form
                  </div>
                  <br />
                  <div className="font-bold">Input Information</div>
                  <div className="ml-5 list-disc">
                    <li>Purchased Items (Former OrderTransaction)</li>
                    <div className="ml-5 list-disc">
                      <li>Order ID (Former id)</li>
                      <li>Transaction ID (transactions - id queried by id)</li>
                      <li>Item ID (item_list - item_id queried by id)</li>
                      <li>Total Price (Former total_price)</li>
                    </div>
                  </div>
                  <br />
                  <div className="font-bold">Form Adjustment</div>
                  <div className="ml-5 list-disc">
                    <li>Card Details (Field type Header)</li>
                    <div className="ml-5 list-disc">
                      <li>Card Number (Field type Input)</li>
                      <div className="ml-7 list-decimal">
                        <li>Required: Yes</li>
                        <li>Visibility: Not Hidden</li>
                        <li>Input dependency: Unlinked</li>
                        <li>
                          Output dependency: Linked to CardDetails - card_no
                        </li>
                      </div>
                      <li>Expire Date (Field type Date)</li>
                      <div className="ml-7 list-decimal">
                        <li>Required: Yes</li>
                        <li>Visibility: Not Hidden</li>
                        <li>Input dependency: Unlinked</li>
                        <li>
                          Output dependency: Linked to CardDetails - expire
                        </li>
                      </div>
                      <li>Security Code (Field type Input)</li>
                      <div className="ml-7 list-decimal">
                        <li>Required: Yes</li>
                        <li>Visibility: Not Hidden</li>
                        <li>Input dependency: Unlinked</li>
                        <li>Output dependency: Linked to CardDetails - code</li>
                      </div>
                    </div>
                  </div>
                </div>
                <Divider />
                <div className="text-sm border rounded-lg p-3">
                  Required is a requirement if a specific field needs to be set
                  as required.
                  <br />
                  <br />
                  Visibility is a requirement if a specific field needs to be
                  set as hidden.
                  <br />
                  <br />
                  Input dependency is the source of a field's value in the form.
                  For example, if the input dependency of Card Number is linked
                  to OrderTransaction - id, the value of this field will always
                  depend on OrderTransaction - id. Meanwhile, being unlinked
                  means the field will solely depend on the user input.
                  <br />
                  <br />
                  Output dependency is the destination of values for a component
                  in the form. For example, the output dependency of Card Number
                  is linked to CardDetails - card_no. That means the value of
                  Card Number will be directly saved to CardDetails - card_no.
                  Unlike input dependency, output dependency cannot be unlinked.
                  Being unlinked means that field does not have anywhere to
                  store.
                </div>
              </div>
            )}
          </div>
        }
      />
      <Head>
        <title>Canvas Task 2: Resource-based Checklist Generation</title>
      </Head>

      <FormTemplate isEval={true} onEvalSubmit={onSubmit} />
    </div>
  );
};

export default Task1FollowUpCanvas;
