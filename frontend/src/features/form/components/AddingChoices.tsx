import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type { NextPage } from "next";
import Input from "@components/inputs/Input";

interface Props {
  icon: IconDefinition;
  onAddOption: () => void;
  choices?: string[];
}

const AddingChoices: NextPage<Props> = (props) => {
  const { icon, onAddOption, choices = [] } = props;
  return (
    <div className="space-y-1">
      {choices.map((c, i) => (
        <div className="flex" key={i}>
          <div className="w-1/12 flex self-center justify-center">
            <FontAwesomeIcon icon={icon} size="lg" color="#9ca3af" />
          </div>
          <Input value={c || `Option ${i + 1}`} />
        </div>
      ))}
      <div
        className="text-sm text-gray-400 p-2 border border-dashed rounded-md cursor-pointer text-center bg-gray-100 hover:bg-gray-50"
        onClick={onAddOption}
      >
        + Add an Option
      </div>
    </div>
  );
};

export default AddingChoices;
