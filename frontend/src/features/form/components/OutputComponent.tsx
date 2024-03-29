import type { NextPage } from "next";
import { MutableRefObject, SetStateAction, useEffect, useState } from "react";
import { Component, COMPONENT_TYPES } from "@models";
import Divider from "@components/Divider";
import FormInputName from "./FormInputName";
import FormInputDetails from "./FormInputDetails";
import Tooltip from "@components/Tooltip";

interface Props {
  components: Component[];
  onAddModel: () => void;
  onInputChange: (prefix: string, value: string) => void;
  onDropdownChange: (prefix: string, value: string) => void;
  onReorderChange: (
    prefix: string,
    focusedOrder: number,
    direction: "UP" | "DOWN"
  ) => void;
  onDuplicate: (prefix: string, index: number) => void;
  onDelete: (prefix: string, index: number) => void;
  onAddNewField: (prefix: string) => void;
  onAddOption: (prefix: string, value: string) => void;
  onValidationChange: (prefix: string, value: string) => void;
  onRequiredChange: (prefix: string, value: boolean) => void;
  onEditableChange: (prefix: string, value: boolean) => void;
  onSelectFunction: (prefix: string, value: string) => void;
  onUpdateChoice: (prefix: string, value: string) => void;
  triggerCollapseAll: MutableRefObject<() => void>;
  onClickSetupDependency: (prefix: string, node: Component) => void;
}

function OutputComponent(props: Props) {
  const {
    components,
    onAddModel,
    onInputChange,
    onDropdownChange,
    onReorderChange,
    onDuplicate,
    onDelete,
    onAddNewField,
    onAddOption,
    onValidationChange,
    onRequiredChange,
    onEditableChange,
    onSelectFunction,
    onUpdateChoice,
    triggerCollapseAll,
    onClickSetupDependency,
  } = props;

  const [collapsible, setCollapsible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    triggerCollapseAll.current = collapseAll;
  });

  const collapseAll = () => setCollapsible({});

  const dfsComponent = (
    parent: Component,
    childrenNo: number,
    key: string = "root"
  ): JSX.Element => {
    const prefix = `${key}.${parent.originalName}`;
    if (
      parent.componentType === COMPONENT_TYPES.HEADER ||
      parent.componentType === COMPONENT_TYPES.TAB
    ) {
      if (collapsible[prefix] === undefined) {
        setCollapsible({ ...collapsible, [prefix]: false });
      }

      return (
        <div
          key={prefix}
          className={`p-5 mb-5 border border-gray-300 rounded-md ${
            key.split(".").length % 2 ? "bg-white" : "bg-gray-50"
          }`}
        >
          <div className="flex space-x-1">
            <FormInputName
              node={parent}
              prefix={prefix}
              childrenNo={childrenNo - 1}
              onInputChange={(value) => onInputChange(prefix, value)}
              onDropdownChange={onDropdownChange}
              onReorderChange={(direction) =>
                onReorderChange(key, parent.order, direction)
              }
              onDuplicate={() => onDuplicate(key, parent.order)}
              onDelete={() => onDelete(key, parent.order)}
            />
            <div
              className={`w-1/12`}
              onClick={() => {
                setCollapsible({
                  ...collapsible,
                  [prefix]: !collapsible[prefix],
                });
              }}
            >
              <Tooltip
                className={`w-full h-full flex justify-center items-center border rounded-md text-xs cursor-pointer ${
                  collapsible[prefix]
                    ? "bg-gray-200 border-gray-200 text-gray-500"
                    : "bg-white text-gray-800 border-gray-300 shadow-sm"
                }`}
                position="mb-10"
                tip={
                  collapsible[prefix] ? `Collapse Children` : `Expand Children`
                }
              >
                <div>
                  {collapsible[prefix]
                    ? `Collapse (${parent.children.length})`
                    : `Expand (${parent.children.length})`}
                </div>
              </Tooltip>
            </div>
          </div>
          {collapsible[prefix] && (
            <div className="pl-5 pt-5">
              {[...parent.children]
                .sort((a, b) => a.order - b.order)
                .map((component) =>
                  dfsComponent(component, parent.children.length, prefix)
                )}
              <div
                className="text-sm text-gray-600 p-2 border border-dashed rounded-md cursor-pointer text-center bg-gray-100 hover:bg-white"
                onClick={() => onAddNewField(prefix)}
              >
                + Add a Field
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex-col mb-6 space-y-1" key={prefix}>
          <FormInputName
            node={parent}
            prefix={prefix}
            childrenNo={childrenNo - 1}
            onInputChange={(value) => onInputChange(prefix, value)}
            onDropdownChange={onDropdownChange}
            onReorderChange={(direction) =>
              onReorderChange(key, parent.order, direction)
            }
            onDuplicate={() => onDuplicate(key, parent.order)}
            onDelete={() => onDelete(key, parent.order)}
          />
          <FormInputDetails
            node={parent}
            onAddOption={() => onAddOption(prefix, parent.validation + "|")}
            onValidationChange={(value) => onValidationChange(prefix, value)}
            onRequiredChange={() => onRequiredChange(prefix, !parent.required)}
            onEditableChange={() => onEditableChange(prefix, !parent.hide)}
            onSelectFunction={(value) => onSelectFunction(prefix, value)}
            onUpdateChoice={(value) => onUpdateChoice(prefix, value)}
            onClickSetupDependency={(node) =>
              onClickSetupDependency(prefix, node)
            }
          />
        </div>
      );
    }
  };

  return (
    <div className="border border-gray-300 rounded-md p-5 bg-gray-50">
      {[...components]
        .sort((a, b) => a.order - b.order)
        .map((component, i) => {
          return [
            dfsComponent(component, components.length),
            <Divider className="mb-5" key={i} />,
          ];
        })}

      <div
        className="text-sm text-gray-600 p-2 border border-dashed rounded-md cursor-pointer text-center bg-gray-100 hover:bg-white"
        onClick={() => onAddModel()}
      >
        + Add a Field
      </div>
    </div>
  );
}

export default OutputComponent;
