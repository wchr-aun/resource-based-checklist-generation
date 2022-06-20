import Dropdown from "@components/inputs/Dropdown";
import Input from "@components/inputs/Input";
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
}

const FormInputName: NextPage<Props> = (props) => {
  const {
    node,
    prefix,
    childrenNo,
    onInputChange,
    onDropdownChange,
    onReorderChange,
  } = props;
  return (
    <div className="flex space-x-1 w-full">
      <Input
        placeholder={node.originalName}
        className="w-9/12"
        value={node.name}
        onChange={onInputChange}
      />
      <div className="w-2/12">
        <Dropdown
          name="Select Type"
          options={COMPONENT_TYPE_LIST}
          prefix={prefix}
          value={node.componentType}
          onUpdateValue={onDropdownChange}
        />
      </div>
      <div className="w-1/12">
        <Reorder
          order={node.order}
          childrenNo={childrenNo}
          onClick={onReorderChange}
        />
      </div>
    </div>
  );
};

export default FormInputName;
