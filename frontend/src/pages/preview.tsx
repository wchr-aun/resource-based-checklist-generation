import store from "@app/store";
import Checklist from "@components/Checklist";
import Divider from "@components/Divider";
import InformationComponent from "@components/Information";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NextPage } from "next";
import Link from "next/link";

const Preview: NextPage = () => {
  const form = store.getState().form;
  if (form.processName === "" && form.components.length === 0) {
    return <div>Nothing to Preview</div>;
  }
  const information = form.information.filter((v) =>
    v.details.some((d) => !d.hide)
  );
  return (
    <div className="space-y-2 mb-8">
      <div className="text-sm underline mb-6">
        <Link href="/canvas">
          <span className="cursor-pointer">
            <FontAwesomeIcon className="mr-2" icon={faAngleLeft} />
            Back to Canvas
          </span>
        </Link>
      </div>
      <div className="flex space-x-2">
        <div className="text-4xl font-bold">{form.processName}</div>
        <div className="flex self-end mb-1 italic text-sm">(Preview)</div>
      </div>
      <Divider />
      {information.length !== 0 && (
        <span>
          <InformationComponent information={information} />
          <Divider />
        </span>
      )}
      <Checklist checklist={form.components} />
    </div>
  );
};

export default Preview;
