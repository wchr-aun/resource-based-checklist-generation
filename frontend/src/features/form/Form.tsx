import { Component, COMPONENT_TYPES, Form, LeafComponent } from "@models";
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
import { selectOutputDependencies } from "./dependencySlice";
import { saveTemplate } from "api/template";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { setLoading } from "@app/loadingSlice";
import { selectEnv, selectEvalId, selectIsEval } from "@app/envSlice";
import DependenciesModal from "./components/DependenciesModal";

interface Props {
  isEval?: boolean;
  onEvalSubmit?: (f: Form) => void;
}

function FormTemplate(props: Props) {
  const { isEval = false, onEvalSubmit = (f: Form) => {} } = props;
  const dispatch = useAppDispatch();
  const processName = useAppSelector(selectProcessName);
  const components = useAppSelector(selectComponents);
  const information = useAppSelector(selectInformation);
  const originalProcessName = useAppSelector(selectOriginalProcessName);
  const triggerCollapseAll = useRef(() => {});
  const openModal = useRef((v: boolean) => {});
  const successModal = useRef((v: boolean) => {});
  const manageDependModal = useRef((v: boolean) => {});
  const outputDependencies = useAppSelector(selectOutputDependencies);
  const env = useAppSelector(selectEnv);
  const router = useRouter();

  const [savedTemplateId, setSavedTemplateId] = useState(-1);

  const [selectedNode, setSelectedNode] = useState<Component>({} as Component);
  const [selectedPrefix, setSelectedPrefix] = useState("root");
  const [focusedComponent, setFocusedComponent] = useState(0);

  const submitForm = async () => {
    if (isEval) {
      onEvalSubmit({
        name: processName,
        processName: originalProcessName,
        components,
        information,
      });
      return;
    }
    dispatch(setLoading(true));
    const res = await saveTemplate(
      {
        name: processName,
        processName: originalProcessName,
        components,
        information,
      },
      env
    );
    dispatch(setLoading(false));
    successModal.current(true);
    setSavedTemplateId(res.templateId);
  };

  const onCloseSuccessModal = () => {
    router.push("/");
    successModal.current(false);
  };

  // const resetForm = () => {
  //   triggerCollapseAll.current();
  //   dispatch(setForm(originalTemplate));
  // };

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

  const extractLeafComponents = (
    components: LeafComponent[],
    parent: string = "root",
    parentName: string = ""
  ): LeafComponent[] => {
    const leafComponents = components.flatMap((c) =>
      c.componentType !== COMPONENT_TYPES.HEADER &&
      c.componentType !== COMPONENT_TYPES.TAB
        ? {
            ...c,
            parent,
            parentName,
          }
        : extractLeafComponents(
            c.children,
            `${parent}/${c.originalName}`,
            `${parentName}/${c.name}`
          )
    );
    return leafComponents;
  };

  return (
    <div>
      <div
        className={
          focusedComponent === 1 ? "pl-2 bg-indigo-500 border rounded-lg" : ""
        }
        onFocus={() => setFocusedComponent(1)}
      >
        <Input
          autoFocus={true}
          error={!processName}
          value={processName}
          placeholder={originalProcessName}
          className="text-3xl font-bold w-full"
          onChange={(name) => dispatch(setProcessName(name))}
        />
      </div>
      {focusedComponent === 1 && (
        <div className="text-sm ml-4 italic text-right uppercase">
          Name of the form
        </div>
      )}
      <Divider />
      <div
        className={
          focusedComponent === 2 ? "pl-2 bg-indigo-500 border rounded-lg" : ""
        }
        onClick={() => setFocusedComponent(2)}
      >
        <InputComponent inputs={information} />
      </div>
      {focusedComponent === 2 && (
        <div className="text-sm ml-4 italic text-right uppercase">
          Information from the workflow
        </div>
      )}
      <Divider />
      <div
        className={
          focusedComponent === 3 ? "pl-2 bg-indigo-500 border rounded-lg" : ""
        }
        onClick={() => setFocusedComponent(3)}
      >
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
                field: "hide",
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
      {focusedComponent === 3 && (
        <div className="text-sm ml-4 italic text-right uppercase">
          Form Adjustment
        </div>
      )}
      <div className="flex justify-between bg-white border mt-2 px-5 pb-5">
        <div className="space-x-2">
          <Link href={`${router.asPath}/preview`}>
            <button className="border border-orange-400 hover:border-orange-500 hover:text-orange-500 hover:bg-red-50 text-orange-400 font-bold py-2 px-4 rounded mt-5">
              Preview
            </button>
          </Link>
          <button
            className="border border-emerald-600 hover:border-emerald-800 hover:text-emerald-800 hover:bg-emerald-50 text-emerald-600 font-bold py-2 px-4 rounded mt-5"
            onClick={() => manageDependModal.current(true)}
          >
            Manage Dependencies
          </button>
        </div>
        <div className="space-x-2">
          {/* <button
            className="border border-red-400 hover:border-red-500 hover:text-red-500 hover:bg-red-50 text-red-400 font-bold py-2 px-4 rounded mt-5"
            onClick={resetForm}
          >
            Reset
          </button> */}
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
            inputDependencies={information.map((input) => ({
              name: input.inputDependency,
              children: input.details.map((d) =>
                !d.isQuery
                  ? d.inputDependencyField
                  : `${d.inputDependencyField}.${d.queryField}`
              ),
            }))}
            outputDependencies={outputDependencies}
            onClose={() => openModal.current(false)}
            onConfirm={onUpdateDependencies}
          />
        }
        openModal={openModal}
      />

      <Modal
        size="w-1/4"
        body={
          <div>
            <div className="text-xl font-bold text-teal-600 uppercase">
              Save Completed!
              <FontAwesomeIcon icon={faCircleCheck} className="ml-2" />
            </div>
            <Divider />
            <div>Your Template#{savedTemplateId} has been saved.</div>
            <Divider />
            <div className="flex justify-center">
              <button
                className="border border-teal-600 rounded-lg px-3 py-2 text-teal-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-700"
                onClick={() => onCloseSuccessModal()}
              >
                OK
              </button>
            </div>
          </div>
        }
        onClickBackground={() => onCloseSuccessModal()}
        openModal={successModal}
      />

      <Modal
        openModal={manageDependModal}
        body={
          <DependenciesModal
            inputDependencies={information.map((input) => ({
              name: input.inputDependency,
              children: input.details.map((d) =>
                !d.isQuery
                  ? d.inputDependencyField
                  : `${d.inputDependencyField}.${d.queryField}`
              ),
            }))}
            outputDependencies={outputDependencies}
            leafComponents={extractLeafComponents(components)}
          />
        }
      />
    </div>
  );
}

export default FormTemplate;
