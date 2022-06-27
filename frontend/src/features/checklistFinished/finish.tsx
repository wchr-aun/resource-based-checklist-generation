import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import ItemList from "@components/ItemList";

function ChecklistFinished() {
  return (
    <div>
      <div className="font-bold underline mb-5 text-indigo-900">Finished</div>
      <ItemList icon={faSquareCheck} name="test" />
    </div>
  );
}

export default ChecklistFinished;
