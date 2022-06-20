import type { NextPage } from "next";

interface Props {
  className?: string;
}

const Divider: NextPage<Props> = (props) => {
  const { className = "" } = props;
  return (
    <div className={`${className} py-4`}>
      <div className="w-full border-t border-gray-300"></div>
    </div>
  );
};

export default Divider;
