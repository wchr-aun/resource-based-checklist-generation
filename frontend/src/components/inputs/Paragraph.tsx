import type { NextPage } from "next";

interface Props {
  value?: string;
  className?: string;
  disabled?: boolean;
  onChange?: (v: string) => void;
  validation?: RegExp;
  rows?: number;
}

const Paragraph: NextPage<Props> = (props) => {
  const {
    value = "",
    className = "",
    disabled = false,
    onChange = (v: string) => {},
    validation = new RegExp(""),
    rows = 10,
  } = props;
  return (
    <textarea
      disabled={disabled}
      className={`${className} ${
        validation.test(value)
          ? "border-gray-200 focus:border-teal-500"
          : " border-red-500 focus:border-red-500"
      } appearance-none border-2 rounded w-full py-2 px-4 -mb-1 leading-tight focus:outline-none focus:bg-white`}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    ></textarea>
  );
};

export default Paragraph;
