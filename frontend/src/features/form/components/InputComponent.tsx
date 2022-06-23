import { Information } from "@models";
import Divider from "@components/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeLowVision,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Input from "@components/inputs/Input";
import { useAppDispatch } from "@app/hooks";
import {
  toggleHideAllInput,
  toggleHideInput,
  updateInputName,
} from "@features/form/formSlice";

interface Props {
  inputs: Information[];
}

function InputComponent(props: Props) {
  const { inputs } = props;
  const dispatch = useAppDispatch();

  return (
    <div className="p-5 border border-gray-300 rounded-lg bg-gray-100">
      {inputs.map((info, i) => (
        <div className="px-5 py-1" key={i}>
          <div className="font-bold text-lg mb-2 flex justify-between">
            <span>{info.name}</span>
            <div
              className="cursor-pointer text-gray-600 flex self-center space-x-2"
              onClick={() => dispatch(toggleHideAllInput(i))}
            >
              <span className="text-sm text-gray-500 flex self-center">
                {/* ({details.inputDependency} - {details.inputDependencyField}) */}
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
              <div className="font-semibold w-2/12">
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
              </div>
              <Input disabled={true} className="w-8/12" />
              <div className="flex space-x-2 w-2/12 justify-end self-center">
                <span className="text-sm text-gray-500 flex self-center">
                  {/* ({details.inputDependency} - {details.inputDependencyField}) */}
                  ({details.hide ? "Hidden" : "Visible"})
                </span>
                <div className="cursor-pointer text-gray-600">
                  <FontAwesomeIcon
                    icon={details.hide ? faEyeSlash : faEye}
                    size="sm"
                    onClick={() =>
                      dispatch(
                        toggleHideInput({ infoIndex: i, detailsIndex: j })
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          {i !== inputs.length - 1 && <Divider className="mt-2" />}
        </div>
      ))}
    </div>
  );
}

export default InputComponent;
