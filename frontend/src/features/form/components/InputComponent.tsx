import { Information } from "@models";
import Divider from "@components/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeLowVision,
  faEyeSlash,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Input from "@components/inputs/Input";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import {
  addNewInputDetails,
  deletedInputDetails,
  toggleHideAllInput,
  toggleHideInput,
  updateInputName,
  updateQueryField,
} from "@features/form/formSlice";
import More from "@components/More";
import Dropdown from "@components/inputs/Dropdown";
import { getForeignTable } from "api/dependency";
import { useRef, useState } from "react";
import Modal from "@components/Modal";
import { selectForeign, setForeignTable } from "../foreignTableSlice";

interface Props {
  inputs: Information[];
}

function InputComponent(props: Props) {
  const { inputs } = props;
  const dispatch = useAppDispatch();
  const noForeignTableModal = useRef((v: boolean) => {});
  const queryOptions = useAppSelector(selectForeign);

  const onClickAddNewQuery = async (
    modelName: string,
    fieldName: string,
    parentIndex: number,
    index: number
  ) => {
    let { foreignKey, queryTable, fields } = queryOptions[
      `${modelName}_${fieldName}`
    ] || { foreignKey: "", queryTable: "", fields: [] };
    if (!queryOptions[`${modelName}_${fieldName}`]) {
      const res = await getForeignTable(modelName, fieldName);
      foreignKey = res.foreignKey;
      queryTable = res.foreignTable;
      fields = res.fields;
      dispatch(
        setForeignTable({
          key: `${modelName}_${fieldName}`,
          foreignKey,
          queryTable,
          fields,
        })
      );
    }
    if (fields.length === 0) {
      noForeignTableModal.current(true);
      return;
    }
    dispatch(
      addNewInputDetails({
        parentIndex,
        index,
        foreignKey,
        queryTable,
      })
    );
  };

  return (
    <div className="p-5 border border-gray-300 rounded-lg bg-gray-50">
      {inputs.map((info, i) => (
        <div className="px-5 py-1" key={i}>
          <div className="font-bold text-lg mb-2 flex justify-between">
            <span>{info.name}</span>
            <div
              className="cursor-pointer text-gray-600 flex self-center space-x-2"
              onClick={() => dispatch(toggleHideAllInput(i))}
            >
              <span className="text-sm text-gray-500 flex self-center">
                {info.details.every((v) => v.hide) ? "Visible All" : "Hide All"}
              </span>
              <FontAwesomeIcon
                icon={
                  info.details.every((v) => v.hide)
                    ? faEyeSlash
                    : info.details.some((v) => v.hide)
                    ? faEyeLowVision
                    : faEye
                }
              />
            </div>
          </div>
          {info.details.map((details, j) => (
            <div className="ml-5 flex space-x-2" key={j}>
              <div className="font-semibold w-2/12 flex">
                <Input
                  value={details.name}
                  className={details.hide ? "line-through" : ""}
                  disabled={details.hide}
                  placeholder={details.inputDependencyField}
                  onChange={(name) =>
                    dispatch(
                      updateInputName({ name, infoIndex: i, detailsIndex: j })
                    )
                  }
                />
                {details.isQuery && (
                  <Dropdown
                    options={
                      queryOptions[
                        `${info.name}_${details.inputDependencyField}`
                      ]?.fields || [details.queryField]
                    }
                    value={details.queryField}
                    onUpdateValue={(_, queryField) =>
                      dispatch(
                        updateQueryField({
                          parentIndex: i,
                          index: j,
                          queryField,
                        })
                      )
                    }
                    name="Select"
                    className="w-full"
                  />
                )}
              </div>
              <Input
                disabled={true}
                className={`${details.hide ? "line-through" : ""} w-8/12`}
                placeholder={
                  !details.isQuery
                    ? `Linked to { ${details.inputDependency} } - { ${details.inputDependencyField} } from the workflow`
                    : `Queried from ${`{ ${
                        details.queryTable || "SELECTED_TABLE"
                      } }`} - ${`{ ${
                        details.queryField || "SELECTED_FIELD"
                      } }`} using { ${details.inputDependencyField} }`
                }
              />
              <div className="flex w-2/12 justify-between self-center">
                <div>
                  {!details.isQuery && (
                    <More
                      options={["Link to parent table using this field"]}
                      onSelectOption={() =>
                        onClickAddNewQuery(
                          info.name,
                          details.inputDependencyField,
                          i,
                          j
                        )
                      }
                    />
                  )}
                </div>
                <div className="cursor-pointer text-gray-600">
                  {!details.isQuery ? (
                    <div
                      className="flex space-x-2"
                      onClick={() =>
                        dispatch(
                          toggleHideInput({ infoIndex: i, detailsIndex: j })
                        )
                      }
                    >
                      <span className="text-sm flex self-center">
                        ({details.hide ? "Hidden" : "Visible"})
                      </span>
                      <FontAwesomeIcon
                        className="flex self-center"
                        icon={details.hide ? faEyeSlash : faEye}
                        size="sm"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex space-x-2 hover:text-red-400 text-gray-600"
                      onClick={() =>
                        dispatch(
                          deletedInputDetails({ parentIndex: i, index: j })
                        )
                      }
                    >
                      <span className="text-sm flex self-center">(Delete)</span>
                      <FontAwesomeIcon
                        className="flex self-center"
                        icon={faTrash}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {i !== inputs.length - 1 && <Divider className="mt-2" />}
        </div>
      ))}
      <Modal
        body={
          <div>
            <div className="text-center mb-5">
              There is no reference for this field to other tables.
              <br /> Please try other fields.
            </div>
            <div className="flex justify-center">
              <button
                className="px-5 py-1 border border-rose-500 text-rose-500 rounded-lg hover:bg-rose-50"
                onClick={() => noForeignTableModal.current(false)}
              >
                OK
              </button>
            </div>
          </div>
        }
        openModal={noForeignTableModal}
        size="w-1/3"
      />
    </div>
  );
}

export default InputComponent;
