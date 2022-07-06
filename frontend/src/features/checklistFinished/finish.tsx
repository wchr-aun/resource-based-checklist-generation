import { faTableList } from "@fortawesome/free-solid-svg-icons";
import ItemList from "@components/ItemList";
import { Template } from "@models";
import Divider from "@components/Divider";

interface Props {
  templates: Template[];
  onClickStart: (id: number) => void;
  onClickDelete: (id: number) => void;
}

function ChecklistFinished(props: Props) {
  const { templates, onClickStart, onClickDelete } = props;
  return (
    <div>
      <div className="px-5 mb-5 text-indigo-500 flex">
        <div className="w-1/12"></div>
        <div className="lg:w-5/12 w-11/12 text-center lg:text-left">Name</div>
        <div className="w-3/12 hidden lg:inline-block">Created</div>
        <div className="w-3/12 hidden lg:inline-block">Last Updated</div>
        <div className="px-1.5"></div>
      </div>
      <Divider className="-mt-8 -mb-4" />
      {templates.map((template, i) => (
        <ItemList
          key={i}
          icon={faTableList}
          id={template.id}
          name={template.name}
          created={new Date(template.created).toLocaleString()}
          updated={new Date(template.updated).toLocaleString()}
          onSelectOption={(index) =>
            index === 0 ? onClickStart(template.id) : onClickDelete(template.id)
          }
        />
      ))}
      {templates.length === 0 && (
        <div className="w-full px-5 py-3 my-2 border border-transparent hover:rounded-full hover:bg-indigo-50 flex justify-center">
          <div className="w-1/12"></div>
          <div className="w-5/12">No Items</div>
          <div className="w-3/12">N/A</div>
          <div className="w-3/12">N/A</div>
        </div>
      )}
    </div>
  );
}

export default ChecklistFinished;
