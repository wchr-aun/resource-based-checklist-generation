import { useAppSelector } from "@app/hooks";
import { selectLoading } from "@app/loadingSlice";
import { useRef, useEffect } from "react";
import Modal from "./Modal";
import Spinner from "./Spinner";

function Loading() {
  const loadingModal = useRef((v: boolean) => {});
  const isLoading = useAppSelector(selectLoading);

  useEffect(() => {
    loadingModal.current(isLoading > 0);
  }, [isLoading]);

  return (
    <Modal
      openModal={loadingModal}
      body={
        <div className="flex justify-center">
          <Spinner />
        </div>
      }
      lockBackground={true}
      size="w-1/12"
    />
  );
}

export default Loading;
