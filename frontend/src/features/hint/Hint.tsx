import Modal from "@components/Modal";
import { useRef } from "react";

interface Props {
  children: JSX.Element;
}

function Hint(props: Props) {
  const { children } = props;
  const openModal = useRef((v: boolean) => {});
  return (
    <div>
      <div
        className="fixed text-sm rounded-full p-3 bg-indigo-300 text-white origin-bottom-left left-5 bottom-5 shadow-lg cursor-pointer opacity-60 hover:opacity-100"
        onClick={() => openModal.current(true)}
      >
        Instructions
      </div>
      <Modal openModal={openModal} body={children} />
    </div>
  );
}

export default Hint;
