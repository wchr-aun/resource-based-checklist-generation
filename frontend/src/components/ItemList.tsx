import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import More from "./More";

interface Props {
  icon: IconDefinition;
  name: string;
  created: string;
  updated: string;
  id: number;
  onSelectOption?: (index: number) => void;
}

function ItemList(props: Props) {
  const {
    icon,
    name,
    created,
    updated,
    id,
    onSelectOption = (index: number) => {},
  } = props;
  return (
    <div className="w-full px-5 py-3 my-2 border border-transparent hover:rounded-full hover:bg-indigo-50 flex space-x-1">
      <FontAwesomeIcon
        size="lg"
        icon={icon}
        className="text-indigo-800 flex self-center w-1/12"
      />
      <div className="lg:w-5/12 w-11/12 text-center lg:text-left">
        {name} <span className="text-sm">(#{id})</span>
      </div>
      <div className="lg:w-3/12 hidden lg:inline-block">{created}</div>
      <div className="lg:w-3/12 hidden lg:inline-block">{updated}</div>
      <div className="text-right hidden lg:inline-block cursor-pointer">
        <More
          options={["View"]}
          onSelectOption={(index) => onSelectOption(index)}
        />
      </div>
    </div>
  );
}

export default ItemList;
