import { useAppDispatch, useAppSelector } from "@app/hooks";
import Paragraph from "@components/inputs/Paragraph";
import type { NextPage } from "next";
import { selectProcessInput, updateProcessInput } from "./processSlice";

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
      <div className="text-xl font-bold underline">Process Input:</div>
      <Paragraph
        value={value}
        onChange={(v: string) => dispatch(updateProcessInput(v))}
        rows={3}
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
