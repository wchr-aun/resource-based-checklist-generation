import { useAppDispatch, useAppSelector } from "@app/hooks";
import Paragraph from "@components/inputs/Paragraph";
import type { NextPage } from "next";
import {
  selectFirstProcess,
  selectProcessInput,
  selectSecondProcess,
  updateProcessInput,
} from "./processSlice";

const jsonValidation = (s: string) => {
  try {
    JSON.parse(s);
    return true;
  } catch {
    return false;
  }
};

const ProcessInput: NextPage = () => {
  const dispatch = useAppDispatch();
  const value = useAppSelector(selectProcessInput);
  return (
    <div className="py-4 space-y-2">
      <div className="flex space-x-2">
        <div className="text-xl font-bold underline flex self-center">
          Process Input:
        </div>
        <button
          className="p-2 border rounded-lg bg-white border-gray-300"
          onClick={() => dispatch(selectFirstProcess())}
        >
          Sample 1
        </button>
        <button
          className="p-2 border rounded-lg bg-white border-gray-300"
          onClick={() => dispatch(selectSecondProcess())}
        >
          Sample 2
        </button>
      </div>
      <Paragraph
        value={value}
        onChange={(v: string) => dispatch(updateProcessInput(v))}
        rows={Math.max(Math.min(value.split(/\r\n|\r|\n/).length, 50), 5)}
        className={
          jsonValidation(value)
            ? "border-gray-200 focus:border-teal-500"
            : " border-red-500 focus:border-red-500"
        }
      />
    </div>
  );
};

export default ProcessInput;
