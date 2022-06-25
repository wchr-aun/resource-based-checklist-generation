import type { NextPage } from "next";
import { COMPONENT_TYPES, Form } from "@models";
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
} from "@features/form/formSlice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { useRef } from "react";
import Input from "@components/inputs/Input";
import Divider from "@components/Divider";
import OutputComponent from "./components/OutputComponent";
import InputComponent from "./components/InputComponent";
import Link from "next/link";

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

  const submitForm = () => {
    alert("not implemented");
    console.log(components, information);
  };

  const resetForm = () => {
    triggerCollapseAll.current();
    dispatch(setForm(originalTemplate));
  };

  const onUpdateComponentType = (prefix: string, value: string) => {
    dispatch(updateComponent({ prefix, field: "componentType", value }));
    dispatch(updateComponent({ prefix, field: "validation", value: "" }));
    dispatch(updateComponent({ prefix, field: "function", value: "" }));
    if (value !== COMPONENT_TYPES.HEADER)
      dispatch(clearComponentChildren(prefix));
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
      <InputComponent inputs={information} />
      <Divider />
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
      />
      <div className="flex justify-between">
        <Link href="/preview">
          <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded mt-5">
            Preview
          </button>
        </Link>
        <div className="space-x-2">
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
    </div>
  );
}

export default FormTemplate;
