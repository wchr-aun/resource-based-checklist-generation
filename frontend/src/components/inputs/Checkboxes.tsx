import Checkbox from "./Checkbox";

interface Props {
  options: string[];
  value?: string;
  onUpdateValue?: (v: string) => void;
  className?: string;
}

function Checkboxes(props: Props) {
  const { options, value = "", onUpdateValue = () => {}, className } = props;
  return (
    <div className={`${className} p-2 space-y-2`}>
      {options.map((option, i) => (
        <Checkbox key={i} name={option} />
      ))}
    </div>
  );
}

export default Checkboxes;
