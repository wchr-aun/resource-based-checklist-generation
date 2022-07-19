import type { NextPage } from "next";

interface Props {
  value?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (v: string) => void;
  autoFocus?: boolean;
  error?: boolean;
}

function Input(props: Props) {
  const {
    value = "",
    className = "",
    disabled = false,
    placeholder = "",
    onChange = (v: string) => {},
    autoFocus = false,
    error = false,
  } = props;
  return (
    <input
      autoFocus={autoFocus}
      disabled={disabled}
      className={`${className} ${
        error && "border-red-400"
      } appearance-none border-2 border-gray-200 w-full rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500`}
      type="text"
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      value={value}
      onFocus={(e) => value === placeholder && e.target.select()}
    />
  );
}

export default Input;
