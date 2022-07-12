import { selectEnv } from "@app/envSlice";
import { healthcareExamples } from "@app/healthcareExamples";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { paymentExamples } from "@app/paymentExamples";
import Divider from "@components/Divider";
import Checkbox from "@components/inputs/Checkbox";
import Dropdown from "@components/inputs/Dropdown";
import Paragraph from "@components/inputs/Paragraph";
import { useEffect, useState } from "react";
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
}

function ProcessInput(props: Props) {
  const { onClickCreate } = props;
  const dispatch = useAppDispatch();
  const value = useAppSelector(selectProcessInput);
  const [autolink, setAutolink] = useState(true);
  const [examples, setExamples] = useState(healthcareExamples);
  const env = useAppSelector(selectEnv);
  useEffect(() => {
    setExamples(env === "healthcare" ? healthcareExamples : paymentExamples);
  }, [env]);
  const onSelectModel = () => {
    const models = window.localStorage.getItem("recentModels") || "";
    const val = examples.find(
      (example) => JSON.stringify(example, null, 2) === value
    )?.name;
    if (val) {
      window.localStorage.setItem(
        `recent${env}Models`,
        [val]
          .concat(models.split(","))
          .filter((value, index, self) => self.indexOf(value) === index)
          .slice(0, 5)
          .join(",")
      );
    }
    onClickCreate(autolink);
  };
  return (
    <div className="space-y-2">
      <div className="flex space-x-2 w-full">
        <div className="text-xl font-bold underline flex self-center min-w-max">
          Process Input:
        </div>
        <Dropdown
          options={examples.map((example) => example.name)}
          name="Select Example"
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
      <Paragraph
        disabled={true}
        value={value}
        onChange={(v: string) => dispatch(updateProcessInput(v))}
        rows={Math.max(Math.min(value.split(/\r\n|\r|\n/).length, 25), 5)}
        className={
          jsonValidation(value)
            ? "border-gray-200 focus:border-teal-500"
            : " border-red-500 focus:border-red-500"
        }
      />
      <Divider />
      <div className="flex justify-between">
        <div className="py-2">
          <Checkbox
            name="Autolink Dependencies"
            onChecked={() => setAutolink(!autolink)}
            checked={autolink}
          />
        </div>
        <button
          className={`${
            value
              ? "border-indigo-500 text-indigo-500 hover:border-indigo-700 hover:text-indigo-700 hover:bg-indigo-50"
              : "text-gray-400"
          } border px-4 py-2 rounded-lg`}
          onClick={() => onSelectModel()}
          disabled={!jsonValidation(value)}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default ProcessInput;
