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
  const [firstOpen, setFirstOpen] = useState(true);
  const [validateResult, setValidateResult] = useState(false);
  const [validateMessage, setValidateMessage] = useState("");
  const [parentFilter, setParentFilter] = useState("");
  const parentNames = leafComponents
    .map((l) => l.parentName || "/")
    .filter((v, i, a) => a.indexOf(v) === i);

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

  const onClickValidate = () => {
    setFirstOpen(false);
    const required = outputDependencies.flatMap((d) =>
      d.children.map((c) => `${d.name} - ${c}`)
    );
    const values = leafOutputDependency.map(
      (p, i) => `${p} - ${leafOutputDependencyField[i]}`
    );
    const missing = required.filter((r) => !values.includes(r));

    setValidateMessage(
      missing.length > 0 ? "Missing:\n- " + missing.join("\n- ") : ""
    );
    setValidateResult(missing.length === 0);
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
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">Manage Dependencies</div>
        <div className="flex space-x-2 w-1/2 justify-end">
          <div className="flex items-center text-bold">Parent Filter:</div>
          <div className="w-2/3">
            <Dropdown
              className="w-full"
              name="All"
              options={parentNames}
              value={parentFilter}
              onUpdateValue={(_, v) => setParentFilter(v)}
            />
          </div>
        </div>
      </div>
      <Divider className="-mx-6" />
      {validateMessage && (
        <div>
          <div className="whitespace-pre text-rose-500 border border-rose-500 rounded-md p-5 max-h-64 overflow-y-auto">
            {validateMessage}
          </div>
          <Divider className="-mx-6" />
        </div>
      )}
      <div
        className="overflow-y-auto space-y-2 py-3 px-5"
        style={{
          maxHeight: validateMessage ? "35vh" : "65vh",
        }}
      >
        {leafComponents.length > 0 ? (
          leafComponents.map(
            (c, i, a) =>
              (parentFilter === "" ||
                c.parentName === parentFilter ||
                (parentFilter === "/" && c.parentName === "")) && [
                <div className="space-y-2" key={i}>
                  <div className="text-bold text-sm">
                    <span className="text-gray-400">{c.parentName || ""}</span>
                    <span className="text-indigo-500">/{c.name}</span>
                  </div>
                  <div className="flex justify-between space-x-5">
                    <div className="flex-col w-full space-y-1">
                      <div className="flex items-center w-full">
                        <div className="w-2/3">
                          Input Dependency:{" "}
                          {leafInputDependencyField[i] && (
                            <span
                              className="ml-2 text-sm underline cursor-pointer text-indigo-500"
                              onClick={() => {
                                setLeafInputDependency(
                                  leafInputDependency
                                    .slice(0, i)
                                    .concat("")
                                    .concat(leafInputDependency.slice(i + 1))
                                );

                                setLeafInputDependencyField(
                                  leafInputDependencyField
                                    .slice(0, i)
                                    .concat("")
                                    .concat(
                                      leafInputDependencyField.slice(i + 1)
                                    )
                                );
                              }}
                            >
                              Unlinked
                            </span>
                          )}
                        </div>
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
                                  .concat(
                                    leafOutputDependencyField.slice(i + 1)
                                  )
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>,
                a
                  .map((b, ii) => (b.parentName === parentFilter ? ii : -1))
                  .sort()
                  .slice(-1)[0] !== i &&
                  a.length !== i + 1 && <Divider key={`${i}-divider`} />,
              ]
          )
        ) : (
          <div className="text-center">No components found.</div>
        )}
      </div>
      <Divider className="-mx-6" />
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <button
            className={`border py-2 px-4 rounded-lg ${
              leafComponents.length === 0
                ? "border-gray-400 text-gray-400"
                : "border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-700"
            }`}
            disabled={leafComponents.length === 0}
            onClick={() => onClickValidate()}
          >
            Validate
          </button>
          <div className="flex items-center">
            {!firstOpen && (
              <div>
                {validateResult ? (
                  <div className="text-teal-600">Passed!</div>
                ) : (
                  <div className="text-rose-500">
                    Output dependencies unlinked found!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
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
