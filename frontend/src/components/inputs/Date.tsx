import type { NextPage } from "next";

interface Props {
  value?: string;
  className?: string;
  disabled?: boolean;
  onSelectDate?: (date: string) => void;
}

const Date: NextPage<Props> = (props) => {
  const {
    value = "",
    className = "",
    disabled = false,
    onSelectDate = () => {},
  } = props;
  return (
    <input
      className={`${className} appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-sm leading-tight focus:outline-none focus:bg-white focus:border-indigo-500`}
      disabled={disabled}
      type="date"
      value={value}
      onChange={(e) => onSelectDate(e.target.value)}
    />
  );
};

export default Date;
