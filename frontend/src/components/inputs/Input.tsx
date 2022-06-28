import type { NextPage } from "next";

interface Props {
  value?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (v: string) => void;
  autoFocus?: boolean;
}

function Input(props: Props) {
  const {
    value = "",
    className = "",
    disabled = false,
    placeholder = "",
    onChange = (v: string) => {},
    autoFocus = false,
  } = props;
  return (
    <input
      autoFocus={autoFocus}
      disabled={disabled}
      className={`${className} appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500`}
      type="text"
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      value={value}
    />
  );
}

export default Input;
