import store from "@app/store";
import Checklist from "@components/Checklist";
import Divider from "@components/Divider";
import InformationComponent from "@components/Information";
import ScrollToTop from "@features/ScrollToTop/ScrollToTop";
import type { NextPage } from "next";
import Head from "next/head";

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
      <ScrollToTop />
      <Head>
        <title>
          Preview: {form.processName} - Resource-based Checklist Generation
        </title>
      </Head>
      <div className="flex space-x-2 py-5 bg-white justify-center rounded-lg border border-indigo-200">
        <div className="lg:text-4xl font-bold">{form.processName}</div>
        <div className="flex self-end italic text-sm">(Preview)</div>
      </div>
      <Divider />
      {information.length !== 0 && <div>Information</div>}
      {information.length !== 0 && (
        <div>
          <InformationComponent information={information} />
          <Divider />
        </div>
      )}
      <div>Form</div>
      <Checklist checklist={form.components} />
    </div>
  );
};

export default Preview;
