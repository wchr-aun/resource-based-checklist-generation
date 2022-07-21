import store from "@app/store";
import Checklist from "@components/Checklist";
import Divider from "@components/Divider";
import InformationComponent from "@components/Information";
import ScrollToTop from "@features/ScrollToTop/ScrollToTop";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const Task1Preview: NextPage = () => {
  const router = useRouter();
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
      <div className="pt-6">
        <div className="bg-white p-5 border">
          <Link href={router.asPath.replace("/preview", "")}>
            <button className="border border-zinc-500 text-zinc-500 px-5 py-2 rounded-lg hover:bg-zinc-50 hover:text-zinc-600 hover:border-zinc-600">
              Back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Task1Preview;
