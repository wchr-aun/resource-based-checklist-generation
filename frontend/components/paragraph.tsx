import type { NextPage } from "next";

interface Props {
  value?: string;
  className?: string;
  disabled?: boolean;
}

const Paragraph: NextPage<Props> = (props) => {
  const { value = "", className = "", disabled = false } = props;
  return (
    <textarea
      disabled={disabled}
      className={`${className} appearance-none border-2 resize-none border-gray-200 rounded w-full py-2 px-4 -mb-1 leading-tight focus:outline-none focus:bg-white focus:border-teal-500`}
      rows={10}
    ></textarea>
  );
};

export default Paragraph;
