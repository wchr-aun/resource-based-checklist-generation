import { MutableRefObject, useEffect, useState } from "react";

interface Props {
  size?: string;
  body: JSX.Element;
  openModal: MutableRefObject<(v: boolean) => void>;
  lockBackground?: boolean;
  onClickBackground?: () => void;
}

function Modal(props: Props) {
  const {
    size = "w-2/3",
    body,
    openModal,
    lockBackground = false,
    onClickBackground = () => {},
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    openModal.current = (v: boolean) => setIsOpen(v);
    return () => {
      document.body.style.overflow = "auto";
    };
  });
  return (
    <div>
      {isOpen && (
        <div className="w-full top-0 right-0 fixed flex justify-center items-center h-screen z-50">
          <div
            className="fixed bg-opacity-60 bg-slate-400 w-full h-full"
            onClick={() => {
              onClickBackground();
              if (!lockBackground) setIsOpen(false);
            }}
          ></div>
          <div
            className={`z-50 relative bg-slate-50 rounded-lg shadow-md p-6 ${size}`}
          >
            {body}
          </div>
        </div>
      )}
    </div>
  );
}

export default Modal;
