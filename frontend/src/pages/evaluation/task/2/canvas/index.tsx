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
                <div className="ml-5 list-decimal">
                  <li>Click on "Start Task 2" to start the task.</li>
                  <li>
                    Create an AwardContract process template WITH
                    auto-generation.
                  </li>
                  <li>
                    Change the name of the form to "Award Contract Checklist".
                  </li>
                  <li>
                    Hide all details in the input information section (second
                    section).
                  </li>
                  <li>
                    Then, query 2 new fields using actorid of the
                    ServiceProvider using the suggestion option.
                  </li>
                  <li>
                    Change the field names to "Provider's Name" and "Provider's
                    Surname".
                  </li>
                  <li>
                    Check the position of Provider's Name to be before
                    Provider's Surname.
                  </li>
                  <li>Change the name of the ServiceProvider to "Provider".</li>
                  <li>
                    In the form adjustment section (last section), check each
                    field in the section if they all follow the Format Required
                    below (names, types, dependencies, etc.).
                  </li>
                  <li>
                    Preview the result to check the template. It should look
                    like the figure given in{" "}
                    <a
                      href="/images/EvaluationPreview.png"
                      className="text-indigo-500 underline"
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
                    <span className="font-bold">Form Name:</span> Award Contract
                    Checklist
                  </div>
                  <div className="font-bold">Input Information</div>
                  <div className="ml-5 list-disc">
                    <li>Provider (Former ServiceProvider)</li>
                    <div className="ml-5 list-disc">
                      <li>Provider's Name (staff - name queried by actorid)</li>
                      <li>
                        Provider's Surname (staff - surname queried by actorid)
                      </li>
                    </div>
                  </div>
                  <div className="font-bold">Form Adjustment</div>
                  <div className="ml-5 list-disc">
                    <li>Open Contract (Field type Header)</li>
                    <div className="ml-5 list-disc">
                      <li>idcontract (Field type Input)</li>
                      <div className="ml-7 list-decimal">
                        <li>Required: Any</li>
                        <li>Visibility: Hidden</li>
                        <li>
                          Input dependency: Linked to AcceptedContract -
                          idcontract
                        </li>
                        <li>
                          Output dependency: Linked to OpenedContract -
                          idcontract
                        </li>
                      </div>
                      <li>reqservid (Field type Input)</li>
                      <div className="ml-7 list-decimal">
                        <li>Required: Any</li>
                        <li>Visibility: Hidden</li>
                        <li>
                          Input dependency: Linked to AcceptedContract -
                          reqservid
                        </li>
                        <li>
                          Output dependency: Linked to OpenedContract -
                          reqservid
                        </li>
                      </div>
                      <li>providerid (Field type Input)</li>
                      <div className="ml-7 list-decimal">
                        <li>Required: Any</li>
                        <li>Visibility: Hidden</li>
                        <li>
                          Input dependency: Linked to AcceptedContract -
                          providerid
                        </li>
                        <li>
                          Output dependency: Linked to OpenedContract -
                          providerid
                        </li>
                      </div>
                      <li>Date Opened (Field type Date)</li>
                      <div className="ml-7 list-decimal">
                        <li>Required: Yes</li>
                        <li>Visibility: Not Hidden</li>
                        <li>Input dependency: Unlinked</li>
                        <li>
                          Output dependency: Linked to OpenedContract -
                          time_opened
                        </li>
                      </div>
                      <li>Opened State (Field type Constant)</li>
                      <div className="ml-7 list-decimal">
                        <li>Value: 3</li>
                        <li>Input dependency: Unlinked</li>
                        <li>
                          Output dependency: Linked to OpenedContract - stateid
                        </li>
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
                  Value is the specific value of a constant field.
                  <br />
                  <br />
                  Input dependency is the source of a field's value in the form.
                  For example, if the input dependency of time_requested is
                  linked to AcceptedContract - idcontract, the value of this
                  field will always depend on AcceptedContract - idcontract.
                  Meanwhile, being unlinked means the field will solely depend
                  on the user input.
                  <br />
                  <br />
                  Output dependency is the destination of values for a component
                  in the form. For example, the output dependency of
                  time_requested is linked to OpenedContract - idcontract. That
                  means the value of time_requested will be directly saved to
                  OpenedContract - idcontract. Unlike input dependency, output
                  dependency cannot be unlinked. Being unlinked means that field
                  does not have anywhere to store.
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
