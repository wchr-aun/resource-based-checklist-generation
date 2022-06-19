import {
  faAngleDown,
  faAngleUp,
  faCircleDot,
  faSquareCaretDown,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
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
  selectComponents,
  selectProcessName,
  setForm,
  updateComponent,
} from "./formSlice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import Date from "@components/inputs/Date";
import Time from "@components/inputs/Time";
import AddingChoices from "@features/form/components/AddingChoices";

interface Props {
  originalTemplate: Template;
}

const FormTemplate: NextPage<Props> = (props) => {
  const { originalTemplate } = props;
  const dispatch = useAppDispatch();
  const processName = useAppSelector(selectProcessName);
  const components = useAppSelector(selectComponents);

  const [collapsible, setCollapsible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    console.log("hi");
  });

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
  };

  const dfsComponent = (parent: Component, prefix: string = "root"): any => {
    if (parent.componentType === "HEADER") {
      if (collapsible[prefix + parent.name] === undefined)
        setCollapsible({ ...collapsible, [prefix + parent.name]: false });

      return (
        <div className="pb-5" key={`${prefix}.${parent.name}`}>
          <div className="cursor-pointer flex space-x-1">
            <Input value={parent.name} className="font-semibold w-9/12" />
            <div className="w-2/12">
              <Dropdown
                name="Select Type"
                options={COMPONENT_TYPE_LIST}
                prefix={`${prefix}.${parent.name}`}
                value={parent.componentType}
                onUpdateValue={onUpdateComponentType}
              />
            </div>
            <div
              className={`w-1/12 flex justify-center items-center border rounded-full ${
                collapsible[prefix + parent.name] ? "bg-gray-100" : "bg-white"
              }`}
              onClick={() => {
                setCollapsible({
                  ...collapsible,
                  [prefix + parent.name]: !collapsible[prefix + parent.name],
                });
              }}
            >
              <FontAwesomeIcon
                color="#374151"
                icon={
                  collapsible[prefix + parent.name] ? faAngleUp : faAngleDown
                }
                size="lg"
              />
            </div>
          </div>
          {collapsible[prefix + parent.name] && (
            <div className="pl-5 pt-5">
              {[...parent.children]
                .sort((a, b) => a.order - b.order)
                .map((component) =>
                  dfsComponent(component, `${prefix}.${parent.name}`)
                )}
              <div
                className="text-sm text-gray-400 p-2 border border-dashed rounded-md cursor-pointer text-center bg-gray-100 hover:bg-gray-50"
                onClick={() =>
                  dispatch(addNewField(`${prefix}.${parent.name}`))
                }
              >
                + Add a Field
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex-col mb-6 space-y-1" key={prefix + parent.name}>
          <div className="md:flex space-x-1">
            <Input className="w-10/12" value={parent.name} />

            <div className="w-2/12">
              <Dropdown
                name="Select Type"
                options={COMPONENT_TYPE_LIST}
                prefix={`${prefix}.${parent.name}`}
                value={parent.componentType}
                onUpdateValue={onUpdateComponentType}
              />
            </div>
          </div>

          {parent.componentType === "INPUT" && (
            <Input value={parent.value} disabled={true} />
          )}
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
                    prefix: `${prefix}.${parent.name}`,
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
              <Input value="Validation" />
              <Checkbox name="Required" />
              <Checkbox name="Editable" />
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div>
      <Input value={processName} className="text-3xl font-bold" />
      <Divider />
      <div className="border p-5">
        {[...components]
          .sort((a, b) => a.order - b.order)
          .map((component) => dfsComponent(component))}

        <div
          className="text-sm text-gray-400 p-2 border border-dashed rounded-md cursor-pointer text-center bg-gray-100 hover:bg-gray-50"
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
