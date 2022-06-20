import {
  faAngleDown,
  faAngleUp,
  faCircleDot,
  faSquareCaretDown,
  faSquareCheck,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NextPage } from "next";
import { useState } from "react";
import {
  Component,
  COMPONENT_TYPES,
  COMPONENT_TYPE_LIST,
  Template,
} from "@models";
import Checkbox from "@components/inputs/Checkbox";
import Dropdown from "@components/inputs/Dropdown";
import Input from "@components/inputs/Input";
import Paragraph from "@components/inputs/Paragraph";
import Divider from "@components/Divider";
import {
  addNewField,
  addNewModel,
  clearComponentChildren,
  reorderComponents,
  selectComponents,
  selectOriginalProcessName,
  selectProcessName,
  setForm,
  setProcessName,
  updateComponent,
} from "./formSlice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import Date from "@components/inputs/Date";
import Time from "@components/inputs/Time";
import AddingChoices from "@features/form/components/AddingChoices";
import Reorder from "@features/form/components/Reorder";
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
            key.split(".").length % 2 == 0 ? "bg-white" : "bg-gray-100"
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
            />
            <div
              className={`w-1/12 flex justify-center items-center border rounded-md ${
                collapsible[prefix] ? "bg-gray-50" : "bg-white"
              }`}
              onClick={() => {
                setCollapsible({
                  ...collapsible,
                  [prefix]: !collapsible[prefix],
                });
              }}
            >
              {collapsible[prefix] ? "Collapse" : "Expand"}
              {/* <FontAwesomeIcon
                color="#374151"
                icon={collapsible[prefix] ? faMinus : faPlus}
                size="lg"
              /> */}
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
          />
          <FormInputDetails
            node={parent}
            onAddOption={() =>
              dispatch(
                updateComponent({ prefix, field: "validation", value: "|" })
              )
            }
          />

          {parent.componentType === "INPUT" && <Input disabled={true} />}
          {parent.componentType === "PARAGRAPH" && (
            <Paragraph disabled={true} className="resize-none" />
          )}
          {parent.componentType === "DATE" && (
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
          {parent.componentType === "TIME" && (
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
          {(parent.componentType === COMPONENT_TYPES.CHECKBOXES ||
            parent.componentType === COMPONENT_TYPES.CHOICES ||
            parent.componentType === COMPONENT_TYPES.DROPDOWN) && (
            <AddingChoices
              choices={parent.validation.split("|")}
              icon={
                parent.componentType === COMPONENT_TYPES.CHECKBOXES
                  ? faSquareCheck
                  : parent.componentType === COMPONENT_TYPES.CHOICES
                  ? faCircleDot
                  : faSquareCaretDown
              }
              onAddOption={() =>
                dispatch(
                  updateComponent({
                    prefix,
                    field: "validation",
                    value: parent.validation + "|",
                  })
                )
              }
            />
          )}

          {(parent.componentType === "INPUT" ||
            parent.componentType === "PARAGRAPH") && (
            <div className="text-xs flex space-x-3">
              <Input
                value={parent.validation}
                placeholder="Validation"
                onChange={(value) =>
                  dispatch(
                    updateComponent({ prefix, field: "validation", value })
                  )
                }
              />
              <Checkbox
                name="Required"
                checked={parent.required}
                onChecked={() =>
                  dispatch(
                    updateComponent({
                      prefix,
                      field: "required",
                      value: !parent.required,
                    })
                  )
                }
              />
              <Checkbox
                name="Editable"
                checked={parent.editable}
                onChecked={() =>
                  dispatch(
                    updateComponent({
                      prefix,
                      field: "editable",
                      value: !parent.editable,
                    })
                  )
                }
              />
            </div>
          )}
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
      <div className="border border-gray-300 rounded-md p-5">
        {[...components]
          .sort((a, b) => a.order - b.order)
          .map((component) => {
            return [
              dfsComponent(component, components.length),
              <Divider className="mb-5" />,
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
