import { healthcareExamples } from "@app/healthcareExamples";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import Divider from "@components/Divider";
import Dropdown from "@components/inputs/Dropdown";
import Paragraph from "@components/inputs/Paragraph";
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
  onClickCreate: () => void;
}

function ProcessInput(props: Props) {
  const { onClickCreate } = props;
  const dispatch = useAppDispatch();
  const value = useAppSelector(selectProcessInput);
  const onSelectModel = () => {
    const models = window.localStorage.getItem("recentModels") || "";
    const val = healthcareExamples.find(
      (example) => JSON.stringify(example, null, 2) === value
    )?.name;
    if (val) {
      window.localStorage.setItem(
        "recentModels",
        [val]
          .concat(models.split(","))
          .filter((value, index, self) => self.indexOf(value) === index)
          .slice(0, 5)
          .join(",")
      );
    }
    onClickCreate();
  };
  return (
    <div className="space-y-2">
      <div className="flex space-x-2 w-full">
        <div className="text-xl font-bold underline flex self-center min-w-max">
          Process Input:
        </div>
        <Dropdown
          options={healthcareExamples.map((example) => example.name)}
          name="Select Example"
          onUpdateValue={(_1, value, i) => dispatch(selectProcess(i - 1))}
          value={
            healthcareExamples.find(
              (example) => JSON.stringify(example, null, 2) === value
            )?.name
          }
        />
      </div>
      <Paragraph
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
      <div className="flex justify-end">
        <button
          className="border px-4 py-2 rounded-lg border-orange-400 text-orange-400 hover:border-orange-600 hover:text-orange-600"
          onClick={() => onSelectModel()}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default ProcessInput;
