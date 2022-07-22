import Divider from "@components/Divider";
import Tooltip from "@components/Tooltip";
import {
  faCircleInfo,
  faCircleMinus,
  faCirclePlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface Props {
  suggestedForeigns: {
    parentIndex: number;
    index: number;
    foreigns: {
      foreignKey: string;
      queryTable: string;
      queryField: string;
    }[];
  };
  allForeigns: {
    foreignKey: string;
    queryTable: string;
    queryField: string;
  }[];
  onClickOK: () => void;
  onClickCancel: () => void;
  onClickDelete: (index: number) => void;
  onClickAdd: (indices: number[]) => void;
}

function suggestedForeignModal(props: Props) {
  const {
    suggestedForeigns,
    onClickOK,
    onClickCancel,
    onClickDelete,
    onClickAdd,
    allForeigns,
  } = props;
  const [addedFields, setAddedFields] = useState<number[]>([]);
  return (
    <div>
      <div className="text-xl font-bold">Suggested Fields</div>
      <Divider className="-mx-6" />
      {suggestedForeigns.foreigns.length > 0 ? (
        <div className="px-1">
          <div className="flex space-x-5 font-bold mb-3 underline">
            <div className="p-2"></div>
            <div className="w-5/12">Field</div>
            <div className="w-5/12">Table</div>
            <div className="w-1/6"></div>
          </div>
          {suggestedForeigns.foreigns.map((foreign, i) => (
            <div className="flex space-x-5" key={i}>
              <div className="px-0.5">
                <FontAwesomeIcon
                  className="text-gray-600"
                  icon={faCircleInfo}
                  size="xs"
                />
              </div>
              <div className="w-5/12">{foreign.queryField}</div>
              <div className="w-5/12">{foreign.queryTable}</div>
              <div className="w-1/6 flex justify-end pr-5 self-center">
                <Tooltip className="w-fit" tip="Delete">
                  <FontAwesomeIcon
                    className="cursor-pointer text-gray-600 hover:text-rose-400"
                    icon={faTrash}
                    onClick={() => onClickDelete(i)}
                  />
                </Tooltip>
              </div>
            </div>
          ))}
          <Divider className="-mx-6" />
          <div className="flex justify-end space-x-5">
            <button
              className="px-5 py-1 border border-rose-500 text-rose-500 rounded-lg hover:bg-rose-50"
              onClick={() => onClickCancel()}
            >
              Cancel
            </button>
            <button
              className="px-5 py-1 border border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-50"
              onClick={() => onClickOK()}
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center">
            <div>Unfortunately, there is no suggestion for this field!</div>
            <Divider className="-mx-6" />
            <div className="mb-5 italic">
              Alternatively, you can add the fields yourself below.
            </div>
            <div className="flex space-x-5 font-bold mb-3 underline">
              <div className="p-2"></div>
              <div className="w-5/12">Field</div>
              <div className="w-5/12">Table</div>
              <div className="w-1/6"></div>
            </div>
            {allForeigns.map((foreign, i) => (
              <div className="flex space-x-5" key={i}>
                <div className="px-0.5">
                  {addedFields.includes(i) ? (
                    <div>{addedFields.findIndex((v) => v === i) + 1}</div>
                  ) : (
                    <FontAwesomeIcon
                      className="text-gray-600"
                      icon={faCircleInfo}
                      size="xs"
                    />
                  )}
                </div>
                <div className="w-5/12">{foreign.queryField}</div>
                <div className="w-5/12">{foreign.queryTable}</div>
                <div className="w-1/6 flex justify-end pr-5 self-center">
                  {addedFields.includes(i) ? (
                    <Tooltip className="w-fit" tip="Remove">
                      <FontAwesomeIcon
                        className="cursor-pointer text-gray-600 hover:text-rose-500"
                        icon={faCircleMinus}
                        onClick={() =>
                          setAddedFields(addedFields.filter((x) => x !== i))
                        }
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip className="w-fit" tip="Add">
                      <FontAwesomeIcon
                        className="cursor-pointer text-gray-600 hover:text-teal-500"
                        icon={faCirclePlus}
                        onClick={() => setAddedFields([...addedFields, i])}
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Divider className="-mx-6" />
          <div className="flex justify-center">
            {addedFields.length > 0 ? (
              <button
                className="px-5 py-1 border border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-50"
                onClick={() => onClickAdd(addedFields)}
              >
                Add
              </button>
            ) : (
              <button
                className="px-5 py-1 border border-rose-500 text-rose-500 rounded-lg hover:bg-rose-50"
                onClick={() => onClickCancel()}
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default suggestedForeignModal;
