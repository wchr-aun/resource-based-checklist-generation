import { Component, COMPONENT_TYPES, Form } from "@models";
import {
  addNewField,
  addNewModel,
  clearComponentChildren,
  deleteComponent,
  duplicateComponent,
  reorderComponents,
  selectComponents,
  selectInformation,
  selectOriginalProcessName,
  selectProcessName,
  setForm,
  setProcessName,
  updateComponent,
  updateDependencies,
} from "@features/form/formSlice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { useRef, useState } from "react";
import Input from "@components/inputs/Input";
import Divider from "@components/Divider";
import OutputComponent from "./components/OutputComponent";
import InputComponent from "./components/InputComponent";
import Link from "next/link";
import Modal from "@components/Modal";
import DependencyModal from "./components/DependencyModal";
import {
  selectInputDependencies,
  selectOutputDependencies,
} from "./dependencySlice";

interface Props {
  originalTemplate: Form;
}

function FormTemplate(props: Props) {
  const { originalTemplate } = props;
  const dispatch = useAppDispatch();
  const processName = useAppSelector(selectProcessName);
  const components = useAppSelector(selectComponents);
  const information = useAppSelector(selectInformation);
  const originalProcessName = useAppSelector(selectOriginalProcessName);
  const triggerCollapseAll = useRef(() => {});
  const openModal = useRef((v: boolean) => {});
  const inputDependencies = useAppSelector(selectInputDependencies);
  const outputDependencies = useAppSelector(selectOutputDependencies);

  const [selectedNode, setSelectedNode] = useState<Component>({} as Component);
  const [selectedPrefix, setSelectedPrefix] = useState("root");

  const submitForm = () => {
    alert("not implemented");
    console.log(components, information);
  };

  const resetForm = () => {
    triggerCollapseAll.current();
    dispatch(setForm(originalTemplate));
  };

  const setupDependency = (prefix: string, node: Component) => {
    setSelectedNode(node);
    setSelectedPrefix(prefix);
    openModal.current(true);
  };

  const onUpdateComponentType = (prefix: string, value: string) => {
    dispatch(updateComponent({ prefix, field: "componentType", value }));
    dispatch(updateComponent({ prefix, field: "validation", value: "" }));
    dispatch(updateComponent({ prefix, field: "function", value: "" }));
    if (value !== COMPONENT_TYPES.HEADER)
      dispatch(clearComponentChildren(prefix));
  };

  const onUpdateDependencies = (
    inputDependency: string,
    inputDependencyField: string,
    outputDependency: string,
    outputDependencyField: string
  ) => {
    openModal.current(false);
    dispatch(
      updateDependencies({
        inputDependency,
        inputDependencyField,
        outputDependency,
        outputDependencyField,
        prefix: selectedPrefix,
      })
    );
  };

  return (
    <div>
      <div className="focus-within:pl-2 focus-within:bg-indigo-500 focus-within:border focus-within:rounded-lg">
        <Input
          autoFocus={true}
          value={processName}
          placeholder={originalProcessName}
          className="text-3xl font-bold"
          onChange={(name) => dispatch(setProcessName(name))}
        />
      </div>
      <Divider />
      <div className="focus-within:pl-2 focus-within:bg-indigo-500 focus-within:border focus-within:rounded-lg">
        <InputComponent inputs={information} />
      </div>
      <Divider />
      <div className="focus-within:pl-2 focus-within:bg-indigo-500 focus-within:border focus-within:rounded-lg">
        <OutputComponent
          triggerCollapseAll={triggerCollapseAll}
          components={components}
          onAddModel={() => dispatch(addNewModel())}
          onInputChange={(prefix, value) =>
            dispatch(updateComponent({ prefix, field: "name", value }))
          }
          onDropdownChange={onUpdateComponentType}
          onReorderChange={(prefix, focusedOrder, direction) =>
            dispatch(
              reorderComponents({
                prefix,
                focusedOrder,
                direction,
              })
            )
          }
          onDuplicate={(prefix, index) =>
            dispatch(duplicateComponent({ prefix, index }))
          }
          onDelete={(prefix, index) =>
            dispatch(deleteComponent({ prefix, index }))
          }
          onAddNewField={(prefix) => dispatch(addNewField(prefix))}
          onAddOption={(prefix, value) =>
            dispatch(
              updateComponent({
                prefix,
                field: "validation",
                value,
              })
            )
          }
          onValidationChange={(prefix, value) =>
            dispatch(updateComponent({ prefix, field: "validation", value }))
          }
          onRequiredChange={(prefix, value) =>
            dispatch(
              updateComponent({
                prefix,
                field: "required",
                value,
              })
            )
          }
          onEditableChange={(prefix, value) =>
            dispatch(
              updateComponent({
                prefix,
                field: "editable",
                value,
              })
            )
          }
          onSelectFunction={(prefix, value) =>
            dispatch(
              updateComponent({
                prefix,
                field: "function",
                value,
              })
            )
          }
          onUpdateChoice={(prefix, value) =>
            dispatch(updateComponent({ prefix, field: "validation", value }))
          }
          onClickSetupDependency={setupDependency}
        />
      </div>
      <div className="flex justify-between bg-white border mt-2 px-5 pb-5">
        <div className="space-x-2">
          <Link href="/preview">
            <button className="border border-orange-400 hover:border-orange-500 hover:text-orange-500 hover:bg-red-50 text-orange-400 font-bold py-2 px-4 rounded mt-5">
              Preview
            </button>
          </Link>
          <button className="border border-rose-400 hover:border-rose-500 hover:text-rose-500 hover:bg-rose-50 text-rose-400 font-bold py-2 px-4 rounded mt-5">
            Check Dependencies
          </button>
        </div>
        <div className="space-x-2">
          <button
            className="border border-red-400 hover:border-red-500 hover:text-red-500 hover:bg-red-50 text-red-400 font-bold py-2 px-4 rounded mt-5"
            onClick={resetForm}
          >
            Reset
          </button>
          <button
            className="border border-indigo-500 hover:border-indigo-700 hover:text-indigo-700 hover:bg-indigo-50 text-indigo-500 font-bold py-2 px-4 rounded mt-5"
            onClick={submitForm}
          >
            Create
          </button>
        </div>
      </div>

      <Modal
        body={
          <DependencyModal
            node={selectedNode}
            inputDependencies={inputDependencies}
            outputDependencies={outputDependencies}
            onClose={() => openModal.current(false)}
            onConfirm={onUpdateDependencies}
          />
        }
        openModal={openModal}
      />
    </div>
  );
}

export default FormTemplate;
