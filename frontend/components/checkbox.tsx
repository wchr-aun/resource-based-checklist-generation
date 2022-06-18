import type { NextPage } from "next";
import { useState } from "react";

interface Props {
  name: string;
}

const Checkbox: NextPage<Props> = (props) => {
  const { name } = props;
  return (
    <div className="felx self-center">
      <div className="flex items-center">
        <input
          id="default-checkbox"
          type="checkbox"
          value=""
          className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label className="ml-2 font-medium text-gray-500">{name}</label>
      </div>
    </div>
  );
};

export default Checkbox;
