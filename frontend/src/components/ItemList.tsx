import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  icon: IconDefinition;
  name: string;
}

function ItemList(props: Props) {
  const { icon, name } = props;
  return (
    <div className="w-full px-5 py-3 border border-transparent hover:rounded-lg hover:bg-indigo-50 flex self-center">
      <FontAwesomeIcon
        size="lg"
        icon={icon}
        className="text-indigo-800 flex self-center"
      />
      <span className="ml-10">{name}</span>
    </div>
  );
}

export default ItemList;
