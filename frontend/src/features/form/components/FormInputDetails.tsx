import Checkbox from "@components/inputs/Checkbox";
import Date from "@components/inputs/Date";
import Dropdown from "@components/inputs/Dropdown";
import Input from "@components/inputs/Input";
import Paragraph from "@components/inputs/Paragraph";
import Time from "@components/inputs/Time";
import {
  faCircleDot,
  faGear,
  faLink,
  faSquareCaretDown,
  faSquareCheck,
  faUnlink,
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
  onClickSetupDependency: (node: Component) => void;
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
    onClickSetupDependency,
  } = props;
  return (
    <div className="flex-col space-y-1 w-full">
      {node.componentType === COMPONENT_TYPES.CONSTANT && (
        <Input
          placeholder="Constant value"
          value={node.validation}
          onChange={onValidationChange}
        />
      )}
      {node.componentType === COMPONENT_TYPES.INPUT && (
        <Input disabled={true} placeholder="Short answer text" />
      )}
      {node.componentType === COMPONENT_TYPES.PARAGRAPH && (
        <Paragraph
          disabled={true}
          className="resize-none"
          placeholder="Long answer text"
        />
      )}
      {node.componentType === COMPONENT_TYPES.DATE && (
        <div className="flex space-x-1">
          <div className="w-full">
            <Date disabled={true} />
          </div>
          {/* <div className="w-1/5">
            <Dropdown
              className="w-full"
              name="Select an Option"
              options={["Normal", "getCurrentDate"]}
              onUpdateValue={(_, value) => onSelectFunction(value)}
              value={node.function}
            />
          </div> */}
        </div>
      )}
      {node.componentType === COMPONENT_TYPES.TIME && (
        <div className="flex space-x-1">
          <div className="w-4/5">
            <Time disabled={true} />
          </div>
          <div className="w-1/5">
            <Dropdown
              className="w-full"
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
        node.componentType !== COMPONENT_TYPES.DROPDOWN &&
        node.componentType !== COMPONENT_TYPES.CONSTANT && (
          <div className="text-xs flex justify-between px-2">
            {/* <Input
              value={node.validation}
              placeholder="Validation"
              onChange={onValidationChange}
            /> */}
            <div className="text-sm justify-end font-bold text-gray-700 flex">
              <div
                className="cursor-pointer flex space-x-1"
                onClick={() => onClickSetupDependency(node)}
              >
                <FontAwesomeIcon
                  icon={node.inputDependencyField ? faLink : faUnlink}
                  className="mt-1"
                />
                <div>Dependency Setup</div>
                <FontAwesomeIcon
                  icon={node.outputDependencyField ? faLink : faUnlink}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Checkbox
                name="Required"
                checked={node.required}
                onChecked={onRequiredChange}
              />
              <Checkbox
                name="Hide"
                checked={node.hide}
                onChecked={onEditableChange}
              />
            </div>
          </div>
        )}
    </div>
  );
};

export default FormInputDetails;
