import Divider from "@components/Divider";
import Dropdown from "@components/inputs/Dropdown";
import { DependencyDetails, LeafComponent } from "@models";
import { useState } from "react";

interface Props {
  inputDependencies: DependencyDetails[];
  outputDependencies: DependencyDetails[];
  leafComponents: LeafComponent[];
}

function DependenciesModal(props: Props) {
  const { inputDependencies, outputDependencies, leafComponents } = props;
  const [leafInputDependency, setLeafInputDependency] = useState(
    leafComponents.map((c) => c.inputDependency)
  );
  const [leafOutputDependency, setLeafOutputDependency] = useState(
    leafComponents.map((c) => c.outputDependency)
  );
  const [leafInputDependencyField, setLeafInputDependencyField] = useState(
    leafComponents.map((c) => c.inputDependencyField)
  );
  const [leafOutputDependencyField, setLeafOutputDependencyField] = useState(
    leafComponents.map((c) => c.outputDependencyField)
  );

  return (
    <div>
      <div className="text-xl font-bold">Manage Dependencies</div>
      <Divider />
      <div
        className="overflow-y-auto space-y-2 py-3 px-5"
        style={{ maxHeight: "70vh" }}
      >
        {leafComponents.length > 0 ? (
          leafComponents.map((c, i) => [
            <div className="space-y-2" key={i}>
              <div className="text-bold text-sm">
                <span className="text-gray-400">{c.parentName || ""}</span>
                <span className="text-indigo-500">/{c.name}</span>
              </div>
              <div className="flex justify-between space-x-5">
                <div className="flex-col w-full space-y-1">
                  <div className="flex items-center w-full">
                    <div className="w-2/3">Input Dependency:</div>
                    <Dropdown
                      name="Select Input Dependency"
                      options={inputDependencies.map((v) => v.name)}
                      value={leafInputDependency[i]}
                      className="w-full"
                      onUpdateValue={(_, v) => {
                        setLeafInputDependency(
                          leafInputDependency
                            .slice(0, i)
                            .concat(v)
                            .concat(leafInputDependency.slice(i + 1))
                        );
                        setLeafInputDependencyField(
                          leafInputDependencyField
                            .slice(0, i)
                            .concat(v)
                            .concat(leafInputDependencyField.slice(i + 1))
                        );
                      }}
                    />
                  </div>
                  {leafInputDependency[i] && (
                    <div className="flex items-center w-full">
                      <div className="w-2/3">Field:</div>
                      <Dropdown
                        name="Select Input Dependency Field"
                        options={inputDependencies
                          .filter((d) => d.name === leafInputDependency[i])
                          .flatMap((v) => v.children)}
                        value={leafInputDependencyField[i]}
                        className="w-full"
                        onUpdateValue={(_, v) =>
                          setLeafInputDependencyField(
                            leafInputDependencyField
                              .slice(0, i)
                              .concat(v)
                              .concat(leafInputDependencyField.slice(i + 1))
                          )
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="flex-col w-full space-y-1">
                  <div className="flex items-center w-full">
                    <div className="w-2/3">Output Dependency:</div>
                    <Dropdown
                      name="Select Output Dependency"
                      options={outputDependencies.map((v) => v.name)}
                      value={leafOutputDependency[i]}
                      className="w-full"
                      onUpdateValue={(_, v) => {
                        setLeafOutputDependency(
                          leafOutputDependency
                            .slice(0, i)
                            .concat(v)
                            .concat(leafOutputDependency.slice(i + 1))
                        );
                        setLeafOutputDependencyField(
                          leafOutputDependencyField
                            .slice(0, i)
                            .concat("")
                            .concat(leafOutputDependencyField.slice(i + 1))
                        );
                      }}
                    />
                  </div>
                  {leafOutputDependency[i] && (
                    <div className="flex items-center w-full">
                      <div className="w-2/3">Field:</div>
                      <Dropdown
                        name="Select Output Dependency Field"
                        options={outputDependencies
                          .filter((d) => d.name === leafOutputDependency[i])
                          .flatMap((v) => v.children)}
                        value={leafOutputDependencyField[i]}
                        className="w-full"
                        onUpdateValue={(_, v) =>
                          setLeafOutputDependencyField(
                            leafOutputDependencyField
                              .slice(0, i)
                              .concat(v)
                              .concat(leafOutputDependencyField.slice(i + 1))
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>,
            leafComponents.length - 1 !== i && <Divider key={`${i}-divider`} />,
          ])
        ) : (
          <div className="text-center">No components found.</div>
        )}
      </div>
      <Divider />
      <div className="flex justify-end space-x-2">
        <button
          className="border py-2 px-4 rounded-lg border-rose-500 text-rose-500 hover:text-rose-600 hover:border-rose-600 hover:bg-rose-50"
          onClick={() => {}}
        >
          Cancel
        </button>
        <button
          className={`border py-2 px-4 rounded-lg ${
            leafComponents.length === 0
              ? "border-gray-400 text-gray-400"
              : "border-indigo-500 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-700"
          }`}
          onClick={() => {}}
          disabled={leafComponents.length === 0}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default DependenciesModal;
