import { faClipboardList, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  onClickCreateTemplate: () => void;
}

function ChecklistCreate(props: Props) {
  const { onClickCreateTemplate } = props;
  return (
    <div>
      {/* <div className="font-bold underline mb-5 text-teal-700">
        Start A Checklist
      </div> */}
      <div className="flex space-x-5">
        <div
          className="flex-col cursor-pointer"
          onClick={onClickCreateTemplate}
        >
          <div className="h-max border-dashed flex justify-center py-9 px-16 rounded-md bg-white text-gray-500 hover:border-solid border-2 hover:border-sky-900 border-gray-400">
            <FontAwesomeIcon icon={faPlus} size="3x" />
          </div>
          <div className="text-center text-sm">Create a New Template</div>
        </div>
        <div className="flex-col space-y-0 w-min cursor-pointer text-gray-500 hover:underline">
          <FontAwesomeIcon
            icon={faClipboardList}
            size="7x"
            className="hover:border-2 hover:border-solid hover:border-sky-900 border-2 border-transparent py-1 px-4 rounded-lg"
          />
          <div className="flex justify-center text-sm text-gray-900">
            Create
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChecklistCreate;
