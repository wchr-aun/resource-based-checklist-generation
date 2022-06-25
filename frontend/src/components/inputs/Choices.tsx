interface Props {
  options: string[];
  value?: string;
  onUpdateValue?: (v: string) => void;
  className?: string;
}

function Choices(props: Props) {
  const { options, value = "", onUpdateValue = () => {}, className } = props;
  return (
    <div className={`${className} space-y-2 p-2`}>
      {options.map((option) => (
        <div className="flex items-center">
          <input
            type="radio"
            value=""
            name="default-radio"
            className="w-4 h-4 text-blue-600 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
            onChange={() => onUpdateValue(option)}
          />
          <label className="ml-2 text-sm font-medium text-gray-900">
            {option}
          </label>
        </div>
      ))}
    </div>
  );
}

export default Choices;
