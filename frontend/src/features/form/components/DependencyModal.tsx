import Divider from "@components/Divider";
import Dropdown from "@components/inputs/Dropdown";
import { Component, DependencyDetails } from "@models";
import { useState } from "react";

interface Props {
  inputDependencies: DependencyDetails[];
  outputDependencies: DependencyDetails[];
  node: Component;
  onClose: () => void;
  onConfirm: (
    inputDependency: string,
    inputDependencyField: string,
    outputDependency: string,
    outputDependencyField: string
  ) => void;
}

function DependencyModal(props: Props) {
  const { inputDependencies, outputDependencies, node, onClose, onConfirm } =
    props;

  let [inputDependency, setInputDependency] = useState(node.inputDependency);
  let [outputDependency, setOutputDependency] = useState(node.outputDependency);
  let [inputDependencyField, setInputDependencyField] = useState(
    node.inputDependencyField
  );
  let [outputDependencyField, setOutputDependencyField] = useState(
    node.outputDependencyField
  );
  const [inputDependencyFields, setInputDependencyFields] = useState<string[]>(
    inputDependencies
      .filter((d) => d.name === inputDependency)
      .flatMap((d) => d.children)
  );
  const [outputDependencyFields, setOutputDependencyFields] = useState<
    string[]
  >(
    outputDependencies
      .filter((d) => d.name === outputDependency)
      .flatMap((d) => d.children)
  );
  const updateInputDependency = (value: string) => {
    if (value === inputDependency) return;
    setInputDependencyField("");
    setInputDependency(value);
    setInputDependencyFields(
      inputDependencies
        .filter((d) => d.name === value)
        .flatMap((d) => d.children)
    );
  };
  const updateOutputDependency = (value: string) => {
    if (value === outputDependency) return;
    setOutputDependency(value);
    setOutputDependencyFields(
      outputDependencies
        .filter((d) => d.name === value)
        .flatMap((d) => d.children)
    );
  };

  return (
    <div>
      <div className="text-xl font-bold">"{node.name}" - Dependency Setup</div>
      <Divider className="-mx-6" />
      <div className="flex space-x-4 px-5">
        <div className="w-1/2 flex-col justify-center space-y-2">
          <div className="flex items-center">
            <div className="w-2/3">Input Dependency:</div>
            <Dropdown
              options={inputDependencies.map((d) => d.name)}
              value={inputDependency}
              name="Select Input Dependency"
              onUpdateValue={(_, value) => updateInputDependency(value)}
              className="w-full"
            />
          </div>
          {inputDependencyFields.length > 0 && (
            <div className="flex items-center">
              <div className="w-2/3">Field:</div>
              <Dropdown
                options={inputDependencyFields}
                value={inputDependencyField}
                name="Select Input Dependency Field"
                onUpdateValue={(_, value) => setInputDependencyField(value)}
                className="w-full"
              />
            </div>
          )}
        </div>
        <div className="w-1/2 flex-col space-y-2">
          <div className="items-center flex">
            <div className="w-2/3">Output Dependency:</div>
            <Dropdown
              options={outputDependencies.map((d) => d.name)}
              value={outputDependency}
              name="Select Output Dependency"
              onUpdateValue={(_, value) => updateOutputDependency(value)}
              className="w-full"
            />
          </div>
          {outputDependencyFields.length > 0 && (
            <div className="flex items-center">
              <div className="w-2/3">Field:</div>
              <Dropdown
                options={outputDependencyFields}
                value={outputDependencyField}
                name="Select Output Dependency Field"
                onUpdateValue={(_, value) => setOutputDependencyField(value)}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
      <Divider className="-mx-6" />
      <div className="flex justify-end space-x-2">
        <button
          className="border py-2 px-4 rounded-lg border-red-400 text-red-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50"
          onClick={() => onClose()}
        >
          Cancel
        </button>
        <button
          className="border py-2 px-4 rounded-lg border-indigo-500 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-700"
          onClick={() =>
            onConfirm(
              inputDependency,
              inputDependencyField,
              outputDependency,
              outputDependencyField
            )
          }
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default DependencyModal;
