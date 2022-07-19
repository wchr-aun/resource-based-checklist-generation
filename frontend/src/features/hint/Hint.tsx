import Modal from "@components/Modal";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
        className="fixed rounded-full p-4 bg-indigo-300 text-white origin-bottom-left left-5 bottom-5 shadow-lg cursor-pointer opacity-60 hover:opacity-100"
        onClick={() => openModal.current(true)}
      >
        <FontAwesomeIcon className="px-1" icon={faQuestion} size="lg" />
      </div>
      <Modal openModal={openModal} body={children} />
    </div>
  );
}

export default Hint;
