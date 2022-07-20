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
  const [isBottom, setIsBottom] = useState<boolean>(false);
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
          className={`${className} relative py-2 pl-4 pr-8 text-sm overflow-hidden whitespace-nowrap text-ellipsis rounded-md border-2 border-gray-200 shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-indigo-500 font-semibold`}
          onClick={() => {
            setIsBottom(
              (2 * screen.availHeight) / 3 <
                (catMenu.current?.getBoundingClientRect().bottom || 0)
            );
            setShow(!show);
          }}
        >
          {options.find((v) => v === value) || name}
          <FontAwesomeIcon
            className="right-4 top-3 absolute"
            icon={faAngleDown}
            size="sm"
          />
        </button>
        {show &&
          (isBottom ? (
            <div className="lg:w-full lg:max-h-72 max-h-32 max-w-32 overflow-auto break-words z-10 origin-top-left bottom-0 absolute mb-12 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {[name].concat(options).map((v, i) => {
                  return (
                    <div
                      className={`text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 ${
                        i === 0 && "text-center -ml-1 italic"
                      } ${v === value && "bg-gray-300"}`}
                      key={`test ${i}`}
                      onClick={() => updateValue(v !== name ? v : "", i)}
                    >
                      {v}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="lg:w-full lg:max-h-72 max-h-32 max-w-32 overflow-auto break-words z-10 origin-top-left absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {[name].concat(options).map((v, i) => {
                  return (
                    <div
                      className={`text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 ${
                        i === 0 && "text-center -ml-1 italic"
                      } ${v === value && "bg-gray-300"}`}
                      key={`test ${i}`}
                      onClick={() => updateValue(v !== name ? v : "", i)}
                    >
                      {v}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Dropdown;
