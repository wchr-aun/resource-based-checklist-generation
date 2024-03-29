import { selectEnv, selectIsEval } from "@app/envSlice";
import { healthcareExamples } from "@app/healthcareExamples";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { paymentExamples } from "@app/paymentExamples";
import Divider from "@components/Divider";
import Dropdown from "@components/inputs/Dropdown";
import Paragraph from "@components/inputs/Paragraph";
import Modal from "@components/Modal";
import { useEffect, useRef, useState } from "react";
import { default as _Image } from "next/image";
import {
  selectProcess,
  selectProcessInput,
  updateProcessInput,
} from "./processSlice";

const jsonValidation = (s: string) => {
  try {
    JSON.parse(s);
    return true;
  } catch {
    return false;
  }
};

interface Props {
  onClickCreate: (v: boolean) => void;
  blockYesAutoGen?: boolean;
  blockNoAutoGen?: boolean;
}

function ProcessInput(props: Props) {
  const {
    onClickCreate,
    blockYesAutoGen = false,
    blockNoAutoGen = false,
  } = props;
  const dispatch = useAppDispatch();
  const openModal = useRef((v: boolean) => {});
  const value = useAppSelector(selectProcessInput);
  const isEval = useAppSelector(selectIsEval);
  const [examples, setExamples] = useState(healthcareExamples);
  const [showImage, setShowImage] = useState(false);
  const env = useAppSelector(selectEnv);

  useEffect(() => {
    setExamples(env === "healthcare" ? healthcareExamples : paymentExamples);
  }, [env]);

  const onSelectModel = (autogen: boolean) => {
    const models = window.localStorage.getItem(`recent${env}Models`) || "";
    const val = examples.find(
      (example) => JSON.stringify(example, null, 2) === value
    )?.name;
    if (val && !isEval) {
      window.localStorage.setItem(
        `recent${env}Models`,
        [val]
          .concat(models.split(","))
          .filter((value, index, self) => self.indexOf(value) === index)
          .slice(0, 5)
          .join(",")
      );
    }
    onClickCreate(autogen);
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2 w-full">
        <div className="text-xl font-bold underline flex self-center min-w-max">
          Process Input:
        </div>
        <Dropdown
          options={examples.map((example) => example.name)}
          name="Select Process"
          onUpdateValue={(_1, _, i) =>
            dispatch(selectProcess(JSON.stringify(examples[i - 1], null, 2)))
          }
          value={
            examples.find(
              (example) => JSON.stringify(example, null, 2) === value
            )?.name
          }
        />
      </div>
      <div className="text-sm text-right py-2">
        <span
          className="cursor-pointer"
          onClick={() => setShowImage(!showImage)}
        >
          {showImage ? "Hide" : "Show"} Workflow Process Image
        </span>
        {showImage && (
          <div className="bg-gray-300 py-1">
            <div className="flex justify-center">
              <img
                alt="Workflow Process Image"
                className="max-h-96"
                src={`/images/${
                  examples.find(
                    (example) => JSON.stringify(example, null, 2) === value
                  )?.name || "default"
                }.png`}
              />
            </div>
          </div>
        )}
      </div>
      <Paragraph
        disabled={true}
        value={value || "Please select an example from the dropdown above."}
        onChange={(v: string) => dispatch(updateProcessInput(v))}
        rows={Math.max(
          Math.min(value.split(/\r\n|\r|\n/).length, showImage ? 10 : 25),
          5
        )}
        className={
          jsonValidation(value)
            ? "border-gray-200 focus:border-teal-500"
            : " border-rose-500 focus:border-rose-500 text-rose-500 italic text-center"
        }
      />
      <Divider />
      <div className="flex justify-end">
        <button
          className={`${
            value
              ? "border-indigo-500 text-indigo-500 hover:border-indigo-700 hover:text-indigo-700 hover:bg-indigo-50"
              : "text-gray-400"
          } border px-4 py-2 rounded-lg`}
          onClick={() => openModal.current(true)}
          disabled={!jsonValidation(value)}
        >
          Create
        </button>
      </div>
      <Modal
        openModal={openModal}
        size="w-1/4"
        body={
          <div>
            <div className="text-xl">
              Do you want to auto-generate the template?
            </div>
            <Divider className="-mx-6" />
            <div className="flex justify-end space-x-2">
              <button
                className={`${
                  value && !blockNoAutoGen
                    ? "border-rose-500 text-rose-500 hover:border-rose-700 hover:text-rose-700 hover:bg-rose-50"
                    : "text-gray-400 cursor-not-allowed"
                } border px-4 py-2 rounded-lg`}
                onClick={() => !blockNoAutoGen && onSelectModel(false)}
                disabled={blockNoAutoGen}
              >
                No
              </button>
              <button
                className={`${
                  value && !blockYesAutoGen
                    ? "border-indigo-500 text-indigo-500 hover:border-indigo-700 hover:text-indigo-700 hover:bg-indigo-50"
                    : "text-gray-400 cursor-not-allowed"
                } border px-4 py-2 rounded-lg`}
                onClick={() => !blockYesAutoGen && onSelectModel(true)}
                disabled={blockYesAutoGen}
              >
                Yes
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default ProcessInput;
