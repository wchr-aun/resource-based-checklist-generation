import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

interface Props {
  onSelectOption: (index: number) => void;
  options: string[];
}

function More(props: Props) {
  const { onSelectOption, options } = props;
  const [show, setShow] = useState(false);
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
  useEffect(() => {
    document.addEventListener("mousedown", closeOpenMenus);
    return () => {
      document.removeEventListener("mousedown", closeOpenMenus);
    };
  }, [show]);

  return (
    <div className="text-gray-500" ref={catMenu}>
      <FontAwesomeIcon
        className="cursor-pointer px-1"
        icon={faEllipsisVertical}
        onClick={() => setShow(!show)}
      />
      {show && (
        <div className="border rounded-lg px-3 bg-white absolute border-gray-300">
          {options.map((v, i) => (
            <div
              className="hover:bg-gray-200 -mx-3 px-3 py-2 text-sm cursor-pointer"
              key={i}
              onClick={() => {
                setShow(false);
                onSelectOption(i);
              }}
            >
              {v}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default More;
