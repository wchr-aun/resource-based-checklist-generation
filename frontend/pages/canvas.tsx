import type { NextPage } from "next";
import { useState } from "react";
import Divider from "../components/divider";
import FormTemplate from "../components/form";
import Input from "../components/input";
import { Component, Template } from "../models/response";

const response: Template = {
  components: [
    {
      componentType: "HEADER",
      css: "",
      editable: false,
      function: "",
      inputDependency: "",
      inputDependencyField: "",
      name: "AcceptedContract",
      order: 5,
      outputDependency: "",
      outputDependencyField: "",
      required: false,
      validation: "",
      value: "",
      children: [
        {
          componentType: "HEADER",
          css: "",
          editable: false,
          function: "",
          inputDependency: "",
          inputDependencyField: "",
          name: "idcontract",
          order: 15,
          outputDependency: "",
          outputDependencyField: "",
          required: false,
          validation: "",
          value: "",
          children: [
            {
              componentType: "",
              css: "",
              editable: false,
              function: "",
              inputDependency: "",
              inputDependencyField: "",
              name: "idcontract2",
              order: 15,
              outputDependency: "",
              outputDependencyField: "",
              required: false,
              validation: "",
              value: "",
            },
            {
              componentType: "",
              css: "",
              editable: false,
              function: "",
              inputDependency: "",
              inputDependencyField: "",
              name: "idcontract",
              order: 1,
              outputDependency: "",
              outputDependencyField: "",
              required: false,
              validation: "",
              value: "",
            },
          ],
        },
        {
          componentType: "HEADER",
          css: "",
          editable: false,
          function: "",
          inputDependency: "",
          inputDependencyField: "",
          name: "reqservid",
          order: 2,
          outputDependency: "",
          outputDependencyField: "",
          required: false,
          validation: "",
          value: "",
        },
        {
          componentType: "INPUT",
          css: "",
          editable: false,
          function: "",
          inputDependency: "",
          inputDependencyField: "",
          name: "providerid",
          order: 3,
          outputDependency: "",
          outputDependencyField: "",
          required: false,
          validation: "",
          value: "",
        },
        {
          componentType: "INPUT",
          css: "",
          editable: false,
          function: "",
          inputDependency: "",
          inputDependencyField: "",
          name: "time_requested",
          order: 4,
          outputDependency: "",
          outputDependencyField: "",
          required: false,
          validation: "",
          value: "",
        },
        {
          componentType: "INPUT",
          css: "",
          editable: false,
          function: "",
          inputDependency: "",
          inputDependencyField: "",
          name: "time_opened",
          order: 5,
          outputDependency: "",
          outputDependencyField: "",
          required: false,
          validation: "",
          value: "",
        },
        {
          componentType: "INPUT",
          css: "",
          editable: false,
          function: "",
          inputDependency: "",
          inputDependencyField: "",
          name: "stateid",
          order: 6,
          outputDependency: "",
          outputDependencyField: "",
          required: false,
          validation: "",
          value: "",
        },
      ],
    },
    {
      componentType: "HEADER",
      css: "",
      editable: false,
      function: "",
      inputDependency: "",
      inputDependencyField: "",
      name: "ServiceProvider",
      order: 2,
      outputDependency: "",
      outputDependencyField: "",
      required: false,
      validation: "",
      value: "",
      children: [
        {
          componentType: "INPUT",
          css: "",
          editable: false,
          function: "",
          inputDependency: "",
          inputDependencyField: "",
          name: "idprovider",
          order: 1,
          outputDependency: "",
          outputDependencyField: "",
          required: false,
          validation: "",
          value: "",
        },
        {
          componentType: "INPUT",
          css: "",
          editable: false,
          function: "",
          inputDependency: "",
          inputDependencyField: "",
          name: "actorid",
          order: 2,
          outputDependency: "",
          outputDependencyField: "",
          required: false,
          validation: "",
          value: "",
        },
        {
          componentType: "INPUT",
          css: "",
          editable: false,
          function: "",
          inputDependency: "",
          inputDependencyField: "",
          name: "serviceid",
          order: 9,
          outputDependency: "",
          outputDependencyField: "",
          required: false,
          validation: "",
          value: "",
        },
        {
          componentType: "INPUT",
          css: "",
          editable: false,
          function: "",
          inputDependency: "",
          inputDependencyField: "",
          name: "level",
          order: 3,
          outputDependency: "",
          outputDependencyField: "",
          required: false,
          validation: "",
          value: "",
        },
      ],
    },
  ],
  processName: "AwardContract",
};

const CreateATemplate: NextPage = () => {
  const { processName, components } = response;

  // const dfsRegistry = (
  //   node: Component,
  //   prefix: string = "root"
  // ): Component[] => {
  //   if (node.children)
  //     return node.children.flatMap((component) =>
  //       dfsRegistry(component, `${prefix}.${node.name}`)
  //     );
  //   else {
  //     return [
  //       {
  //         ...node,
  //         prefix,
  //       },
  //     ];
  //   }
  // };

  let [data, setData] = useState<Component[]>(
    JSON.parse(JSON.stringify(components))
  );

  const submitForm = () => {
    console.log(data);
  };
  const resetForm = () => {
    setData([]);
    setData(JSON.parse(JSON.stringify(components)));
  };
  return (
    <div>
      <Input value={processName} className="text-3xl font-bold" />
      <Divider />
      <div className="border p-5">
        <FormTemplate data={data} setData={setData} />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mt-5"
          onClick={() => resetForm()}
        >
          Reset
        </button>
        <button
          className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mt-5"
          onClick={() => submitForm()}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateATemplate;
