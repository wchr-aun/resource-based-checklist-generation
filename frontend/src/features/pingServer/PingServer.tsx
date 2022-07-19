import { useAppDispatch } from "@app/hooks";
import { setLoading } from "@app/loadingSlice";
import Divider from "@components/Divider";
import Modal from "@components/Modal";
import { pingHealthcare, pingPayment } from "api/ping";
import { useEffect, useRef } from "react";

function PingServer() {
  const errModal = useRef((v: boolean) => {});
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setLoading(true));
    Promise.all([pingHealthcare(), pingPayment()])
      .then(([healthcare, payment]) => {
        console.log({ healthcare, payment });
        if (healthcare && payment) {
          dispatch(setLoading(false));
        } else throw new Error();
      })
      .catch(() => {
        console.log("ping failed");
        errModal.current(true);
        dispatch(setLoading(false));
      });
  }, []);

  return (
    <Modal
      size="w-1/3"
      openModal={errModal}
      lockBackground={true}
      body={
        <div>
          <div className="text-xl text-bold text-rose-500">
            Please try again later
          </div>
          <Divider />
          Servers are currently down. Please try again later.
          <br />
          Or contact us via{" "}
          <a
            className="underline text-indigo-500"
            href="mailto:s2223223@ed.ac.uk"
          >
            s2223223@ed.ac.uk
          </a>
          <Divider />
          <div className="flex justify-center">
            <button
              className="border border-transparent rounded-lg border-rose-500 text-rose-500 px-5 py-2 hover:bg-rose-50 hover:border-rose-600 hover:text-rose-600"
              onClick={() => errModal.current(false)}
            >
              OK
            </button>
          </div>
        </div>
      }
    />
  );
}

export default PingServer;
