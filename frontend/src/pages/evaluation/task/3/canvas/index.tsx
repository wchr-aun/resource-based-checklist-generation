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
import Divider from "@components/Divider";
import Tabs from "@components/Tabs";

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
      <Hint
        name="Format Required"
        children={
          <div className="overflow-auto" style={{ maxHeight: "70vh" }}>
            <div className="px-3 pt-1">
              <div className="text-lg font-bold">Format Required</div>
              <div className="ml-5">
                <div>
                  <span className="font-bold">Form Name:</span> Card Details
                  Form
                </div>
                <div className="font-bold">Input Information</div>
                <div className="ml-5 list-disc">
                  <li>Purchased Items (Former OrderTransaction)</li>
                  <div className="ml-5 list-disc">
                    <li>Order ID (Former id)</li>
                    <li>Transaction ID (transactions - id queried by id)</li>
                    <li>Item ID (item_list - item_id queried by id)</li>
                    <li>Item Price (item_list - price queried by id)</li>
                    <li>Item Quantity (item_list - quanlity queried by id)</li>
                    <li>Total Price (Former total_price)</li>
                  </div>
                </div>
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
                      <li>Output dependency: Linked to CardDetails - expire</li>
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
            </div>
          </div>
        }
      />
      <Head>
        <title>Canvas Task 3: Resource-based Checklist Generation</title>
      </Head>

      <FormTemplate isEval={true} onEvalSubmit={onSubmit} />
    </div>
  );
};

export default Task2Canvas;
