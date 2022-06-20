import Reorder from "@features/form/components/Reorder";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NextPage } from "next";
import { useState } from "react";

interface Props {
  name: string;
  options: string[];
  value?: string;
  prefix?: string;
  onUpdateValue: (prefix: string, v: string) => void;
}

const Dropdown: NextPage<Props> = (props) => {
  const { name, value = "", options, prefix = "root", onUpdateValue } = props;
  const [show, setShow] = useState<boolean>(false);

  const updateValue = (v: string) => {
    setShow(!show);
    onUpdateValue(prefix, v);
  };

  return (
    <div className="relative inline-block w-full">
      <button
        type="button"
        className="py-2 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-teal-500 font-semibold"
        onClick={() => setShow(!show)}
      >
        {options.find((v) => v === value) || name}
        <FontAwesomeIcon className="pl-2 pt-1" icon={faAngleDown} size="sm" />
      </button>

      {show && (
        <div className="z-10 origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none w-full">
          <div className="py-1">
            {options.map((v, i) => {
              return (
                <div
                  className="text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                  key={`test ${i}`}
                  onClick={() => updateValue(v)}
                >
                  {v}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
