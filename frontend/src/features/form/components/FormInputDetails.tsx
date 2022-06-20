import Checkbox from "@components/inputs/Checkbox";
import Date from "@components/inputs/Date";
import Dropdown from "@components/inputs/Dropdown";
import Input from "@components/inputs/Input";
import Paragraph from "@components/inputs/Paragraph";
import Time from "@components/inputs/Time";
import {
  faCircleDot,
  faSquareCaretDown,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Component, COMPONENT_TYPES, COMPONENT_TYPE_LIST } from "@models";
import type { NextPage } from "next";
import AddingChoices from "./AddingChoices";
import Reorder from "./Reorder";

interface Props {
  node: Component;
  onAddOption: () => void;
}

const FormInputDetails: NextPage<Props> = (props) => {
  const { node, onAddOption } = props;
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
              onUpdateValue={() => {}}
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
              onUpdateValue={() => {}}
            />
          </div>
        </div>
      )}
      {(node.componentType === COMPONENT_TYPES.CHECKBOXES ||
        node.componentType === COMPONENT_TYPES.CHOICES ||
        node.componentType === COMPONENT_TYPES.DROPDOWN) && (
        <AddingChoices
          choices={node.validation.split("|")}
          icon={
            node.componentType === COMPONENT_TYPES.CHECKBOXES
              ? faSquareCheck
              : node.componentType === COMPONENT_TYPES.CHOICES
              ? faCircleDot
              : faSquareCaretDown
          }
          onAddOption={() => onAddOption()}
        />
      )}

      {/* {(node.componentType === "INPUT" ||
            node.componentType === "PARAGRAPH") && (
            <div className="text-xs flex space-x-3">
              <Input
                value={node.validation}
                placeholder="Validation"
                onChange={(value) =>
                  dispatch(
                    updateComponent({ prefix, field: "validation", value })
                  )
                }
              />
              <Checkbox
                name="Required"
                checked={node.required}
                onChecked={() =>
                  dispatch(
                    updateComponent({
                      prefix,
                      field: "required",
                      value: !node.required,
                    })
                  )
                }
              />
              <Checkbox
                name="Editable"
                checked={node.editable}
                onChecked={() =>
                  dispatch(
                    updateComponent({
                      prefix,
                      field: "editable",
                      value: !node.editable,
                    })
                  )
                }
              />
            </div>
          )} */}
    </div>
  );
};

export default FormInputDetails;
