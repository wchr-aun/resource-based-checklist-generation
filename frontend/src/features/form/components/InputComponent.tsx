import { Information } from "@models";
import Divider from "@components/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faCircleCheck,
  faCircleXmark,
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
  reorderInformationDetails,
  setNewInputDetails,
  toggleHideAllInput,
  toggleHideInput,
  toggleHideQuery,
  updateInputName,
  updateInputParentName,
  updateQueryField,
} from "@features/form/formSlice";
import More from "@components/More";
import Dropdown from "@components/inputs/Dropdown";
import { getForeignTable, getRecommenedForeign } from "api/dependency";
import { useRef, useState } from "react";
import Modal from "@components/Modal";
import { selectForeign, setForeignTable } from "../foreignTableSlice";
import SuggestedForeignModal from "./SuggestedForeignModal";
import { setLoading } from "@app/loadingSlice";
import Reorder from "./Reorder";
import { selectEnv } from "@app/envSlice";
import Tooltip from "@components/Tooltip";

interface Props {
  inputs: Information[];
  hideSuggestion?: boolean;
}

function InputComponent(props: Props) {
  const { inputs, hideSuggestion = false } = props;
  const dispatch = useAppDispatch();
  const noForeignTableModal = useRef((v: boolean) => {});
  const suggestedForeignModal = useRef((v: boolean) => {});
  const queryOptions = useAppSelector(selectForeign);
  const env = useAppSelector(selectEnv);
  const [allForeigns, setAllForeigns] = useState<
    {
      foreignKey: string;
      queryTable: string;
      queryField: string;
      array: boolean;
    }[]
  >([]);

  const [suggestedForeigns, setSuggestedForeigns] = useState<{
    parentIndex: number;
    index: number;
    foreigns: {
      foreignKey: string;
      queryTable: string;
      queryField: string;
      array: boolean;
    }[];
  }>({
    parentIndex: -1,
    index: -1,
    foreigns: [],
  });

  const queryForignTable = async (modelName: string, fieldName: string) => {
    let foreign = queryOptions[`${modelName}_${fieldName}`] || [];
    if (!queryOptions[`${modelName}_${fieldName}`]) {
      const res = await getForeignTable(modelName, fieldName, env);
      foreign = res.foreignQueries;
      dispatch(
        setForeignTable({
          key: `${modelName}_${fieldName}`,
          foreign: res.foreignQueries,
        })
      );
    }
    if (foreign.length === 0) {
      noForeignTableModal.current(true);
      return false;
    }
    return foreign;
  };

  const onClickAddNewQuery = async (
    modelName: string,
    fieldName: string,
    parentIndex: number,
    index: number
  ) => {
    const res = await queryForignTable(modelName, fieldName);
    if (!res) return;
    dispatch(
      addNewInputDetails({
        parentIndex,
        index,
        queryTable: res.length === 1 ? res[0].queryTable : "",
        foreignKey: res.length === 1 ? res[0].foreignKey : "",
      })
    );
  };

  const onClickGetSuggestion = async (
    modelName: string,
    fieldName: string,
    parentIndex: number,
    index: number
  ) => {
    dispatch(setLoading(true));
    const _res = await queryForignTable(modelName, fieldName);
    if (!_res) {
      dispatch(setLoading(false));
      return;
    }
    setAllForeigns(
      _res.flatMap((q) =>
        q.fields.map((f) => ({
          foreignKey: q.foreignKey,
          queryTable: q.queryTable,
          queryField: f,
          array: _res.length > 1,
        }))
      )
    );
    const res = await getRecommenedForeign(modelName, fieldName, env);
    dispatch(setLoading(false));
    setSuggestedForeigns({
      parentIndex,
      index,
      foreigns: res.foreign.map(
        (foreign: {
          foreignKey: string;
          queryTable: string;
          field: string;
          array: boolean;
        }) => ({
          foreignKey: foreign.foreignKey,
          queryTable: foreign.queryTable,
          queryField: foreign.field,
          array: _res.length > 1,
        })
      ),
    });
    suggestedForeignModal.current(true);
  };

  const onConfirmSetNewInputDetails = () => {
    dispatch(setNewInputDetails({ ...suggestedForeigns }));
    suggestedForeignModal.current(false);
  };

  return (
    <div className="p-5 border border-gray-300 rounded-lg bg-gray-50">
      {inputs.map((info, i) => (
        <div className="px-5 py-1" key={i}>
          <div className="font-bold text-lg mb-2 flex justify-between">
            <Input
              value={info.name}
              placeholder={info.inputDependency}
              error={!info.name}
              onChange={(name) =>
                dispatch(updateInputParentName({ infoIndex: i, name }))
              }
              className="w-1/4"
            />
            <Tooltip
              className="flex self-center"
              tip={
                info.details.every((v) => v.hide) ? "Visible All" : "Hide All"
              }
            >
              <div
                className="cursor-pointer text-gray-600 flex self-center space-x-2"
                onClick={() => dispatch(toggleHideAllInput(i))}
              >
                <span className="text-sm text-gray-500 flex self-center select-none">
                  {info.details.every((v) => v.hide)
                    ? "Visible All"
                    : "Hide All"}
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
            </Tooltip>
          </div>
          {info.details.map((details, j) => (
            <div className="ml-3 flex space-x-2" key={j}>
              <div className="font-semibold w-3/12 flex-col">
                <div className="flex relative">
                  <div className="w-1/3">
                    <Reorder
                      array={details.array}
                      order={details.order}
                      childrenNo={info.details.length - 1}
                      onClick={(direction) =>
                        dispatch(
                          reorderInformationDetails({
                            parentIndex: i,
                            index: j,
                            direction,
                          })
                        )
                      }
                    />
                  </div>
                  <Input
                    value={details.name}
                    className={`${details.hide && "line-through"} ${
                      details.isQuery && "pr-7"
                    }`}
                    error={!details.name}
                    disabled={details.hide}
                    placeholder={details.inputDependencyField}
                    onChange={(name) =>
                      dispatch(
                        updateInputName({ name, infoIndex: i, detailsIndex: j })
                      )
                    }
                  />
                  {details.isQuery && (
                    <div
                      className="absolute right-2 top-1 p-1 cursor-pointer"
                      onClick={() =>
                        dispatch(toggleHideQuery({ parentIndex: i, index: j }))
                      }
                    >
                      <Tooltip
                        className="mt-1.5"
                        tip={
                          details.queryHide
                            ? details.foreignKey &&
                              details.queryField &&
                              details.queryTable
                              ? "Linked"
                              : "Query Unlinked"
                            : ""
                        }
                      >
                        <FontAwesomeIcon
                          icon={
                            details.queryHide
                              ? details.foreignKey &&
                                details.queryField &&
                                details.queryTable
                                ? faCircleCheck
                                : faCircleXmark
                              : faAngleUp
                          }
                          className={
                            !details.queryHide
                              ? "text-gray-500"
                              : details.foreignKey &&
                                details.queryField &&
                                details.queryTable
                              ? "text-teal-500"
                              : "text-rose-400"
                          }
                          size="xs"
                        />
                      </Tooltip>
                    </div>
                  )}
                </div>
                {details.isQuery && !details.queryHide && (
                  <div className="flex py-1">
                    <div className="w-1/3"></div>
                    <div className="w-2/3">
                      <div className="border-l-8 border-gray-300 space-y-1">
                        <Dropdown
                          options={
                            queryOptions[
                              `${info.inputDependency}_${details.inputDependencyField}`
                            ]?.map((v) => v.queryTable) || [details.queryTable]
                          }
                          value={details.queryTable}
                          onUpdateValue={(_, queryTable) =>
                            dispatch(
                              updateQueryField({
                                parentIndex: i,
                                index: j,
                                queryTable,
                                queryField: "",
                                foreignKey:
                                  queryOptions[
                                    `${info.inputDependency}_${details.inputDependencyField}`
                                  ]?.find((v) => v.queryTable)?.foreignKey ||
                                  "",
                                array:
                                  queryOptions[
                                    `${info.inputDependency}_${details.inputDependencyField}`
                                  ]?.find((v) => v.queryTable)?.array || false,
                              })
                            )
                          }
                          name="Select Queried Table"
                          className="w-full"
                        />
                        <Dropdown
                          options={
                            queryOptions[
                              `${info.inputDependency}_${details.inputDependencyField}`
                            ]
                              ?.find((v) => v.queryTable === details.queryTable)
                              ?.fields.filter(
                                (f) =>
                                  !info.details
                                    .filter(
                                      (vv) =>
                                        vv.queryTable === details.queryTable
                                    )
                                    .map((i) => i.queryField)
                                    .includes(f) || details.queryField === f
                              ) || []
                          }
                          value={details.queryField}
                          onUpdateValue={(_, queryField) =>
                            dispatch(
                              updateQueryField({
                                parentIndex: i,
                                index: j,
                                queryField,
                                queryTable: details.queryTable || "",
                                foreignKey: details.foreignKey || "",
                                array: details.array || false,
                              })
                            )
                          }
                          name="Select Queried Field"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Input
                disabled={true}
                className={`${details.hide ? "line-through" : ""} w-8/12`}
                placeholder={
                  !details.isQuery
                    ? `Linked to { ${info.inputDependency} } - { ${details.inputDependencyField} } from the workflow`
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
                      options={[
                        "Query more information using this field",
                        "Get suggested query input information",
                      ]}
                      disabledOptions={
                        hideSuggestion
                          ? ["Get suggested query input information"]
                          : []
                      }
                      onSelectOption={(index) =>
                        index == 0
                          ? onClickAddNewQuery(
                              info.inputDependency,
                              details.inputDependencyField,
                              i,
                              j
                            )
                          : onClickGetSuggestion(
                              info.inputDependency,
                              details.inputDependencyField,
                              i,
                              j
                            )
                      }
                    />
                  )}
                </div>
                <div className="cursor-pointer text-gray-600 select-none">
                  {!details.isQuery ? (
                    <Tooltip tip={details.hide ? "Unhide" : "Hide"}>
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
                    </Tooltip>
                  ) : (
                    <Tooltip tip="Delete">
                      <div
                        className="flex space-x-2 hover:text-red-400 text-gray-600"
                        onClick={() =>
                          dispatch(
                            deletedInputDetails({ parentIndex: i, index: j })
                          )
                        }
                      >
                        <span className="text-sm flex self-center">
                          (Delete)
                        </span>
                        <FontAwesomeIcon
                          className="flex self-center"
                          icon={faTrash}
                          size="sm"
                        />
                      </div>
                    </Tooltip>
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

      <Modal
        body={
          <SuggestedForeignModal
            suggestedForeigns={suggestedForeigns}
            allForeigns={allForeigns}
            onClickCancel={() => suggestedForeignModal.current(false)}
            onClickOK={() => onConfirmSetNewInputDetails()}
            onClickDelete={(index) =>
              setSuggestedForeigns({
                ...suggestedForeigns,
                foreigns: suggestedForeigns.foreigns.filter(
                  (_, i) => i !== index
                ),
              })
            }
            onClickAdd={(indices) =>
              setSuggestedForeigns({
                ...suggestedForeigns,
                foreigns: indices.map((i) => allForeigns[i]),
              })
            }
          />
        }
        size="w-1/3"
        openModal={suggestedForeignModal}
      />
    </div>
  );
}

export default InputComponent;
