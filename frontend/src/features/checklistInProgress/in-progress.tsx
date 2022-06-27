import { faTableList } from "@fortawesome/free-solid-svg-icons";
import ItemList from "@components/ItemList";

function ChecklistInProgess() {
  return (
    <div>
      <div className="font-bold underline mb-5 text-indigo-900">
        In Progress
      </div>
      <ItemList icon={faTableList} name="test" />
    </div>
  );
}

export default ChecklistInProgess;
