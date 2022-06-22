import type { NextPage } from "next";
import { useState } from "react";
import { Component, COMPONENT_TYPES, Template } from "@models";
import Input from "@components/inputs/Input";
import Divider from "@components/Divider";
import {
  addNewField,
  addNewModel,
  clearComponentChildren,
  deleteComponent,
  duplicateComponent,
  reorderComponents,
  selectComponents,
  selectOriginalProcessName,
  selectProcessName,
  setForm,
  setProcessName,
  updateComponent,
} from "./formSlice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import FormInputName from "./components/FormInputName";
import FormInputDetails from "./components/FormInputDetails";

interface Props {
  originalTemplate: Template;
}

const FormTemplate: NextPage<Props> = (props) => {
  const { originalTemplate } = props;
  const dispatch = useAppDispatch();
  const processName = useAppSelector(selectProcessName);
  const components = useAppSelector(selectComponents);
  const originalProcessName = useAppSelector(selectOriginalProcessName);

  const [collapsible, setCollapsible] = useState<Record<string, boolean>>({});

  const submitForm = () => {
    alert("not implemented");
    console.log(components);
  };

  const resetForm = () => {
    setCollapsible({});
    dispatch(setForm(originalTemplate));
  };

  const onUpdateComponentType = (prefix: string, value: string) => {
    dispatch(updateComponent({ prefix, field: "componentType", value }));
    dispatch(updateComponent({ prefix, field: "validation", value: "" }));
    dispatch(updateComponent({ prefix, field: "function", value: "" }));
    if (value !== COMPONENT_TYPES.HEADER)
      dispatch(clearComponentChildren(prefix));
  };

  const dfsComponent = (
    parent: Component,
    childrenNo: number,
    key: string = "root"
  ): any => {
    const prefix = `${key}.${parent.originalName}`;
    if (parent.componentType === "HEADER") {
      if (collapsible[prefix] === undefined) {
        setCollapsible({ ...collapsible, [prefix]: false });
      }

      return (
        <div
          key={prefix}
          className={`p-5 mb-5 border border-gray-300 rounded-md ${
            key.split(".").length % 2 ? "bg-white" : "bg-gray-100"
          }`}
        >
          <div className="cursor-pointer flex space-x-1">
            <FormInputName
              node={parent}
              prefix={prefix}
              childrenNo={childrenNo - 1}
              onInputChange={(value) =>
                dispatch(updateComponent({ prefix, field: "name", value }))
              }
              onDropdownChange={onUpdateComponentType}
              onReorderChange={(direction) =>
                dispatch(
                  reorderComponents({
                    prefix: key,
                    focusedOrder: parent.order,
                    direction,
                  })
                )
              }
              onDuplicate={() =>
                dispatch(
                  duplicateComponent({ prefix: key, index: parent.order })
                )
              }
              onDelete={() =>
                dispatch(deleteComponent({ prefix: key, index: parent.order }))
              }
            />
            <div
              className={`w-1/12 flex justify-center items-center border rounded-md text-xs ${
                collapsible[prefix]
                  ? "bg-gray-200 border-gray-200 text-gray-500"
                  : "bg-white text-gray-800 border-gray-300 shadow-sm"
              }`}
              onClick={() => {
                setCollapsible({
                  ...collapsible,
                  [prefix]: !collapsible[prefix],
                });
              }}
            >
              {collapsible[prefix] ? "Collapse" : "Expand"}
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
                className="text-sm text-gray-600 p-2 border border-dashed rounded-md cursor-pointer text-center bg-gray-50 hover:bg-white"
                onClick={() => dispatch(addNewField(prefix))}
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
            onInputChange={(value) =>
              dispatch(updateComponent({ prefix, field: "name", value }))
            }
            onDropdownChange={onUpdateComponentType}
            onReorderChange={(direction) =>
              dispatch(
                reorderComponents({
                  prefix: key,
                  focusedOrder: parent.order,
                  direction,
                })
              )
            }
            onDuplicate={() =>
              dispatch(duplicateComponent({ prefix: key, index: parent.order }))
            }
            onDelete={() =>
              dispatch(deleteComponent({ prefix: key, index: parent.order }))
            }
          />
          <FormInputDetails
            node={parent}
            onAddOption={() =>
              dispatch(
                updateComponent({
                  prefix,
                  field: "validation",
                  value: parent.validation + "|",
                })
              )
            }
            onValidationChange={(value) =>
              dispatch(updateComponent({ prefix, field: "validation", value }))
            }
            onRequiredChange={() =>
              dispatch(
                updateComponent({
                  prefix,
                  field: "required",
                  value: !parent.required,
                })
              )
            }
            onEditableChange={() =>
              dispatch(
                updateComponent({
                  prefix,
                  field: "editable",
                  value: !parent.editable,
                })
              )
            }
            onSelectFunction={(value) =>
              dispatch(
                updateComponent({
                  prefix,
                  field: "function",
                  value,
                })
              )
            }
            onUpdateChoice={(value) =>
              dispatch(updateComponent({ prefix, field: "validation", value }))
            }
          />
        </div>
      );
    }
  };

  return (
    <div>
      <Input
        value={processName}
        placeholder={originalProcessName}
        className="text-3xl font-bold"
        onChange={(name) => dispatch(setProcessName(name))}
      />
      <Divider />
      <div className="border border-gray-300 rounded-md p-5 bg-gray-100">
        {[...components]
          .sort((a, b) => a.order - b.order)
          .map((component, i) => {
            return [
              dfsComponent(component, components.length),
              <Divider className="mb-5" key={i} />,
            ];
          })}

        <div
          className="text-sm text-gray-600 p-2 border border-dashed rounded-md cursor-pointer text-center bg-gray-50 hover:bg-white"
          onClick={() => dispatch(addNewModel())}
        >
          + Add a Model
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mt-5"
          onClick={resetForm}
        >
          Reset
        </button>
        <button
          className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mt-5"
          onClick={submitForm}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default FormTemplate;
