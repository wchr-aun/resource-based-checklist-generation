import type { NextPage } from "next";

interface Props {
  value?: string;
  className?: string;
  disabled?: boolean;
}

const Input: NextPage<Props> = (props) => {
  const { value = "", className = "", disabled = false } = props;
  return (
    <input
      disabled={disabled}
      className={`${className} appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-teal-500`}
      type="text"
      placeholder={value}
    />
  );
};

export default Input;
