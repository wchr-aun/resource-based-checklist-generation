import Checkbox from "@components/inputs/Checkbox";
import Date from "@components/inputs/Date";
import Dropdown from "@components/inputs/Dropdown";
import Input from "@components/inputs/Input";
import Paragraph from "@components/inputs/Paragraph";
import Time from "@components/inputs/Time";
import {
  faCircleDot,
  faGear,
  faSquareCaretDown,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component, COMPONENT_TYPES } from "@models";
import type { NextPage } from "next";
import AddingChoices from "./AddingChoices";

interface Props {
  node: Component;
  onAddOption: () => void;
  onValidationChange: (value: string) => void;
  onRequiredChange: () => void;
  onEditableChange: () => void;
  onSelectFunction: (value: string) => void;
  onUpdateChoice: (value: string) => void;
}

const FormInputDetails: NextPage<Props> = (props) => {
  const {
    node,
    onAddOption,
    onValidationChange,
    onRequiredChange,
    onEditableChange,
    onSelectFunction,
    onUpdateChoice,
  } = props;
  return (
    <div className="flex-col space-y-1 w-full">
      {node.componentType === "INPUT" && <Input disabled={true} />}
      {node.componentType === "PARAGRAPH" && (
        <Paragraph disabled={true} className="resize-none" />
      )}
      {node.componentType === "DATE" && (
        <div className="flex space-x-1">
          <div className="w-4/5">
            <Date disabled={true} />
          </div>
          <div className="w-1/5">
            <Dropdown
              name="Select an Option"
              options={["Normal", "getCurrentDate"]}
              onUpdateValue={(_, value) => onSelectFunction(value)}
              value={node.function}
            />
          </div>
        </div>
      )}
      {node.componentType === "TIME" && (
        <div className="flex space-x-1">
          <div className="w-4/5">
            <Time disabled={true} />
          </div>
          <div className="w-1/5">
            <Dropdown
              name="Select an Option"
              options={["Normal", "getCurrentTime"]}
              onUpdateValue={(_, value) => onSelectFunction(value)}
              value={node.function}
            />
          </div>
        </div>
      )}
      {(node.componentType === COMPONENT_TYPES.CHECKBOXES ||
        node.componentType === COMPONENT_TYPES.CHOICES ||
        node.componentType === COMPONENT_TYPES.DROPDOWN) && (
        <AddingChoices
          validation={node.validation}
          icon={
            node.componentType === COMPONENT_TYPES.CHECKBOXES
              ? faSquareCheck
              : node.componentType === COMPONENT_TYPES.CHOICES
              ? faCircleDot
              : faSquareCaretDown
          }
          onAddOption={onAddOption}
          onUpdateChoice={onUpdateChoice}
        />
      )}

      {node.componentType !== COMPONENT_TYPES.HEADER &&
        node.componentType !== COMPONENT_TYPES.CHECKBOXES &&
        node.componentType !== COMPONENT_TYPES.CHOICES &&
        node.componentType !== COMPONENT_TYPES.DROPDOWN && (
          <div className="text-xs flex space-x-3">
            <Input
              value={node.validation}
              placeholder="Validation"
              onChange={onValidationChange}
            />
            <Checkbox
              name="Required"
              checked={node.required}
              onChecked={onRequiredChange}
            />
            <Checkbox
              name="Editable"
              checked={node.editable}
              onChecked={onEditableChange}
            />
          </div>
        )}

      <div className="text-xs justify-end font-medium text-gray-500 flex space-x-1">
        <div>Dependency Setup</div>
        <FontAwesomeIcon icon={faGear} />
      </div>
    </div>
  );
};

export default FormInputDetails;
