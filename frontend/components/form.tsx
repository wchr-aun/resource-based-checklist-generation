import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NextPage } from "next";
import { Dispatch, SetStateAction, useState } from "react";
import { Component } from "../models/response";
import Checkbox from "./checkbox";
import Dropdown from "./dropdown";
import Input from "./input";
import Paragraph from "./paragraph";

interface Props {
  data: Component[];
  setData: Dispatch<SetStateAction<Component[]>>;
}

const FormTemplate: NextPage<Props> = (props) => {
  const { data, setData } = props;
  const types = [
    "HEADER",
    "INPUT",
    "PARAGRAPH",
    "DROPDOWN",
    "CHOICES",
    "CHECKBOXES",
    "DATE",
    "TIME",
  ];

  const [collapsible, setCollapsible] = useState<Record<string, boolean>>({});

  const onAddNewModel = () => {
    setData([
      ...data,
      {
        name: `New Model - (${data.length + 1})`,
        componentType: "HEADER",
        css: "",
        editable: false,
        function: "",
        required: false,
        inputDependency: "",
        inputDependencyField: "",
        outputDependency: "",
        outputDependencyField: "",
        validation: "",
        value: "",
        order: data.reduce((p, c) => Math.max(p, c.order), 0) + 1,
      },
    ]);
  };

  const onUpdateValue = (prefix: string, v: string) => {
    const splitedPrefix = prefix.split(".").slice(1);
    setCollapsible({ ...collapsible, [prefix + parent.name]: false });

    let curr = data;
    let node: Component = {} as Component;
    splitedPrefix.forEach((p) => {
      const temp = curr.find((v) => v.name === p);
      if (temp) node = temp;
      if (temp?.children) curr = temp.children;
    });

    if (!node) return;
    node.componentType = v;
    node.children = v !== "HEADER" ? undefined : node.children;
    setData(data);
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
                options={types}
                prefix={`${prefix}.${parent.name}`}
                value={parent.componentType}
                onUpdateValue={onUpdateValue}
              />
            </div>
            <div
              className="w-1/12 flex justify-center items-center border rounded-full bg-white"
              onClick={() => {
                setCollapsible({
                  ...collapsible,
                  [parent.name]: !collapsible[parent.name],
                });
              }}
            >
              <FontAwesomeIcon
                icon={collapsible[parent.name] ? faAngleUp : faAngleDown}
                size="lg"
              />
            </div>
          </div>
          {collapsible[parent.name] && (
            <div className="pl-5 pt-5">
              {parent.children &&
                parent.children
                  .sort((a, b) => a.order - b.order)
                  .map((component) =>
                    dfsComponent(component, `${prefix}.${parent.name}`)
                  )}
              <div className="text-sm text-gray-400 p-2 border border-dashed rounded-md cursor-pointer text-center bg-gray-100 hover:bg-gray-50">
                + Add New Field
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
                options={types}
                prefix={`${prefix}.${parent.name}`}
                value={parent.componentType}
                onUpdateValue={onUpdateValue}
              />
            </div>
          </div>

          {parent.componentType === "INPUT" && (
            <Input value={parent.value} disabled={true} />
          )}
          {parent.componentType === "PARAGRAPH" && (
            <Paragraph disabled={true} />
          )}
          {parent.componentType === "DROPDOWN" && (
            <Dropdown
              name="Add Options"
              options={[]}
              onUpdateValue={() => {}}
            />
          )}
          {parent.componentType === "DATE" && (
            <div className="flex space-x-1">
              <div className="w-4/5">
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-sm leading-tight focus:outline-none focus:bg-white focus:border-teal-500"
                  type="date"
                />
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
                <input
                  className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-sm leading-tight focus:outline-none focus:bg-white focus:border-teal-500"
                  type="time"
                />
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
      {data
        .sort((a, b) => a.order - b.order)
        .map((component) => dfsComponent(component))}

      <div
        className="text-sm text-gray-400 p-2 border border-dashed rounded-md cursor-pointer text-center bg-gray-100 hover:bg-gray-50"
        onClick={() => onAddNewModel()}
      >
        + Add New Model
      </div>
    </div>
  );
};

export default FormTemplate;
