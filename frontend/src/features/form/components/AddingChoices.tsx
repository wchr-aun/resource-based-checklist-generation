import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type { NextPage } from "next";
import Input from "@components/inputs/Input";

interface Props {
  icon: IconDefinition;
  validation?: string;
  onAddOption: () => void;
  onUpdateChoice: (value: string) => void;
}

function updateChoices(choices: string[], i: number, value: string) {
  const temp = [...choices];
  temp.splice(i, 1, value);
  return `^${temp.join("$|^")}$`;
}

function deleteChoice(choices: string[], i: number) {
  const temp = [...choices];
  temp.splice(i, 1);
  return `^${temp.join("$|^")}$`;
}

const AddingChoices: NextPage<Props> = (props) => {
  const { icon, onAddOption, validation = "", onUpdateChoice } = props;
  const choices = validation.replaceAll("^", "").replaceAll("$", "").split("|");
  return (
    <div className="space-y-1">
      {choices.map((c, i) => (
        <div className="flex" key={i}>
          <div className="w-1/12 flex self-center justify-center">
            <FontAwesomeIcon icon={icon} size="lg" color="#9ca3af" />
          </div>
          <Input
            placeholder={`Option ${i + 1}`}
            value={c}
            onChange={(value) =>
              onUpdateChoice(updateChoices(choices, i, value))
            }
          />
          <div className="w-1/12 flex self-center justify-center ">
            {i !== 0 && (
              <FontAwesomeIcon
                icon={faTimes}
                size="lg"
                className="cursor-pointer text-gray-500 hover:text-red-400"
                onClick={() => onUpdateChoice(deleteChoice(choices, i))}
              />
            )}
          </div>
        </div>
      ))}
      <div
        className="text-sm text-gray-400 p-2 border border-dashed rounded-md cursor-pointer text-center bg-gray-100 hover:bg-white"
        onClick={onAddOption}
      >
        + Add an Option
      </div>
    </div>
  );
};

export default AddingChoices;
