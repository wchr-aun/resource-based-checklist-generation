import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

interface Props {
  name: string;
  options: string[];
  value?: string;
  prefix?: string;
  onUpdateValue?: (prefix: string, v: string, i: number) => void;
  className?: string;
}

function Dropdown(props: Props) {
  const {
    name,
    value = "",
    options,
    prefix = "root",
    onUpdateValue = () => {},
    className = "",
  } = props;
  const [show, setShow] = useState<boolean>(false);
  const catMenu = useRef<HTMLDivElement>(null);
  const closeOpenMenus = (e: MouseEvent) => {
    if (
      catMenu.current &&
      show &&
      !catMenu.current.contains(e.target as Node | null)
    ) {
      setShow(false);
    }
  };

  const updateValue = (v: string, i: number) => {
    setShow(!show);
    onUpdateValue(prefix, v, i);
  };
  useEffect(() => {
    document.addEventListener("mousedown", closeOpenMenus);
    return () => {
      document.removeEventListener("mousedown", closeOpenMenus);
    };
  }, [show]);

  return (
    <div className="w-full">
      <div className={`relative inline-block ${className}`} ref={catMenu}>
        <button
          type="button"
          className={`${className} py-2 px-4 inline-flex text-sm justify-center rounded-md border-2 border-gray-200 shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-indigo-500 font-semibold`}
          onClick={() => setShow(!show)}
        >
          {options.find((v) => v === value) || name}
          <FontAwesomeIcon className="pl-2 pt-1" icon={faAngleDown} size="sm" />
        </button>
        {show && (
          <div className="w-full min-w-max z-10 origin-top-left absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {[name].concat(options).map((v, i) => {
                return (
                  <div
                    className={`text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 ${
                      i === 0 && "text-center -ml-1 italic"
                    }`}
                    key={`test ${i}`}
                    onClick={() => updateValue(v !== name ? v : "", i)}
                  >
                    {v}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dropdown;
