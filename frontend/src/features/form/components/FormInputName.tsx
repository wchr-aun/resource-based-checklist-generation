import Dropdown from "@components/inputs/Dropdown";
import Input from "@components/inputs/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faClone } from "@fortawesome/free-solid-svg-icons";
import { Component, COMPONENT_TYPE_LIST } from "@models";
import type { NextPage } from "next";
import Reorder from "./Reorder";

interface Props {
  node: Component;
  prefix: string;
  childrenNo: number;
  onInputChange: (value: string) => void;
  onDropdownChange: (prefix: string, value: string) => void;
  onReorderChange: (direction: "UP" | "DOWN") => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const FormInputName: NextPage<Props> = (props) => {
  const {
    node,
    prefix,
    childrenNo,
    onInputChange,
    onDropdownChange,
    onReorderChange,
    onDuplicate,
    onDelete,
  } = props;
  return (
    <div className="flex space-x-1 w-full">
      <div className="w-1/12">
        <Reorder
          order={node.order}
          childrenNo={childrenNo}
          onClick={onReorderChange}
        />
      </div>
      <Input
        placeholder={node.originalName}
        className="w-8/12"
        value={node.name}
        error={!node.name}
        onChange={onInputChange}
      />
      <div className="w-2/12">
        <Dropdown
          name="Select Type"
          options={COMPONENT_TYPE_LIST}
          prefix={prefix}
          value={node.componentType}
          onUpdateValue={onDropdownChange}
          className="w-full"
        />
      </div>
      <div className="w-1/12 flex space-x-5 justify-center">
        <div className="flex self-center text-gray-600 hover:text-gray-400">
          <FontAwesomeIcon
            className="cursor-pointer"
            icon={faClone}
            onClick={onDuplicate}
          />
        </div>
        <div className="flex self-center text-gray-600 hover:text-red-400">
          <FontAwesomeIcon
            className="cursor-pointer"
            icon={faTrash}
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default FormInputName;
