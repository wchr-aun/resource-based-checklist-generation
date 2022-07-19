import { useAppDispatch } from "@app/hooks";
import Divider from "@components/Divider";
import Dropdown from "@components/inputs/Dropdown";
import Modal from "@components/Modal";
import { DependencyDetails, LeafComponent } from "@models";
import { useRef, useState } from "react";
import { updateDependencies } from "../formSlice";

interface Props {
  inputDependencies: DependencyDetails[];
  outputDependencies: DependencyDetails[];
  leafComponents: LeafComponent[];
  onClose: () => void;
  onSubmit: () => void;
}

function DependenciesModal(props: Props) {
  const {
    inputDependencies,
    outputDependencies,
    leafComponents,
    onClose,
    onSubmit,
  } = props;

  const [
    originalInputDependency,
    originalOutputDependency,
    originalInputDependencyField,
    originalOutputDependencyField,
  ] = [
    leafComponents.map((c) => c.inputDependency),
    leafComponents.map((c) => c.outputDependency),
    leafComponents.map((c) => c.inputDependencyField),
    leafComponents.map((c) => c.outputDependencyField),
  ];
  const [leafInputDependency, setLeafInputDependency] = useState(
    originalInputDependency
  );
  const [leafOutputDependency, setLeafOutputDependency] = useState(
    originalOutputDependency
  );
  const [leafInputDependencyField, setLeafInputDependencyField] = useState(
    originalInputDependencyField
  );
  const [leafOutputDependencyField, setLeafOutputDependencyField] = useState(
    originalOutputDependencyField
  );
  const dispatch = useAppDispatch();
  const confirmCancel = useRef((v: boolean) => {});

  const onClickConfirm = () => {
    leafComponents.forEach((c, i) => {
      if (
        originalInputDependency[i] !== leafInputDependency[i] ||
        originalOutputDependency[i] !== leafOutputDependency[i] ||
        originalInputDependencyField[i] !== leafInputDependencyField[i] ||
        originalOutputDependencyField[i] !== leafOutputDependencyField[i]
      ) {
        dispatch(
          updateDependencies({
            prefix: `${c.parent}.${c.originalName}` || "root",
            inputDependency: leafInputDependency[i],
            inputDependencyField: leafInputDependencyField[i],
            outputDependency: leafOutputDependency[i],
            outputDependencyField: leafOutputDependencyField[i],
          })
        );
      }
    });
    onSubmit();
  };

  const onClickClose = () => {
    if (
      JSON.stringify(originalInputDependency) !==
        JSON.stringify(leafInputDependency) ||
      JSON.stringify(originalOutputDependency) !==
        JSON.stringify(leafOutputDependency) ||
      JSON.stringify(originalInputDependencyField) !==
        JSON.stringify(leafInputDependencyField) ||
      JSON.stringify(originalOutputDependencyField) !==
        JSON.stringify(leafOutputDependencyField)
    ) {
      confirmCancel.current(true);
      return;
    }
    onClose();
  };

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
          onClick={() => onClickClose()}
        >
          Cancel
        </button>
        <button
          className={`border py-2 px-4 rounded-lg ${
            leafComponents.length === 0
              ? "border-gray-400 text-gray-400"
              : "border-indigo-500 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-700"
          }`}
          onClick={() => onClickConfirm()}
          disabled={leafComponents.length === 0}
        >
          Confirm
        </button>
      </div>
      <Modal
        openModal={confirmCancel}
        size="w-1/4"
        body={
          <div>
            <div className="text-xl font-bold">Are you sure?</div>
            <Divider className="-mx-6" />
            <div>
              All the changes will be lost.
              <br />
              Do you still want to proceed?
            </div>
            <Divider className="-mx-6" />
            <div className="flex justify-end space-x-3">
              <button
                className="border py-2 px-4 rounded-lg border-rose-500 text-rose-500 hover:text-rose-600 hover:border-rose-600 hover:bg-rose-50"
                onClick={() => {
                  confirmCancel.current(false);
                  onClose();
                }}
              >
                Yes
              </button>
              <button
                className="border py-2 px-4 rounded-lg border-indigo-500 text-indigo-500 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50"
                onClick={() => {
                  confirmCancel.current(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default DependenciesModal;
