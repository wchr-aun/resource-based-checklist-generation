import { Component, COMPONENT_TYPES } from "@models";
import Divider from "./Divider";
import Checkboxes from "./inputs/Checkboxes";
import Choices from "./inputs/Choices";
import Date from "./inputs/Date";
import Dropdown from "./inputs/Dropdown";
import Input from "./inputs/Input";
import Paragraph from "./inputs/Paragraph";
import Time from "./inputs/Time";

interface Props {
  checklist: Component[];
}

function dfsChecklist(component: Component) {
  return (
    <div>
      {component.componentType === COMPONENT_TYPES.HEADER && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="text-lg font-bold">
              {component.name || component.originalName}
            </div>
            Expand
          </div>
          <div className="ml-5">
            {[...component.children]
              .sort((a, b) => a.order - b.order)
              .map((child) => dfsChecklist(child))}
          </div>
        </div>
      )}
      {component.componentType !== COMPONENT_TYPES.HEADER && (
        <div className="flex space-y-1 space-x-2">
          <div className="font-semibold w-2/12 flex justify-end self-center">
            {component.name || component.originalName}:
          </div>
          {component.componentType === COMPONENT_TYPES.INPUT && (
            <Input className="w-10/12" disabled={!component.editable} />
          )}
          {component.componentType === COMPONENT_TYPES.PARAGRAPH && (
            <Paragraph className="w-10/12" disabled={!component.editable} />
          )}
          {component.componentType === COMPONENT_TYPES.DROPDOWN && (
            <Dropdown
              name={`Select ${component.name}`}
              options={component.validation
                .replaceAll("^", "")
                .replaceAll("$", "")
                .split("|")}
            />
          )}
          {component.componentType === COMPONENT_TYPES.CHOICES && (
            <Choices
              className="w-full"
              options={component.validation
                .replaceAll("^", "")
                .replaceAll("$", "")
                .split("|")}
            />
          )}
          {component.componentType === COMPONENT_TYPES.CHECKBOXES && (
            <Checkboxes
              options={component.validation
                .replaceAll("^", "")
                .replaceAll("$", "")
                .split("|")}
              className="w-full"
            />
          )}
          {component.componentType === COMPONENT_TYPES.TIME && (
            <Time className="w-10/12" disabled={!component.editable} />
          )}
          {component.componentType === COMPONENT_TYPES.DATE && (
            <Date className="w-10/12" disabled={!component.editable} />
          )}
        </div>
      )}
    </div>
  );
}

function Checklist(props: Props) {
  const { checklist } = props;
  return (
    <div className="border rounded-lg border-gray-300 bg-gray-100 p-5">
      {checklist.map((c, i) => (
        <div className="px-5 py-1" key={i}>
          {dfsChecklist(c)}
          {i !== checklist.length - 1 && <Divider className="mt-2" />}
        </div>
      ))}
    </div>
  );
}

export default Checklist;
