import type { NextPage } from "next";

interface Props {
  value?: string;
  className?: string;
  disabled?: boolean;
  onSelectTime?: (time: string) => void;
}

const Time: NextPage<Props> = (props) => {
  const {
    value = "",
    className = "",
    disabled = false,
    onSelectTime = () => {},
  } = props;
  return (
    <input
      className={`${className} appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-sm leading-tight focus:outline-none focus:bg-white focus:border-teal-500`}
      disabled={disabled}
      type="time"
      value={value}
      onChange={(e) => onSelectTime(e.target.value)}
    />
  );
};

export default Time;
