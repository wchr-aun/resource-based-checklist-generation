import Divider from "@components/Divider";
import ScrollToTop from "@features/ScrollToTop/ScrollToTop";
import { Form } from "@models";
import { getChecklist } from "api/checklist";
import { NextPageContext } from "next";
import Head from "next/head";
import InformationComponent from "@components/Information";
import Checklist from "@components/Checklist";

interface Props {
  form: Form;
}

const ChecklistPage = (props: Props) => {
  const { form } = props;

  if (!form.processName && form.components.length === 0) {
    return <div>Nothing to Display</div>;
  }
  const information = form.information.filter((v) =>
    v.details.some((d) => !d.hide)
  );

  return (
    <div className="space-y-2 mb-8">
      <ScrollToTop />
      <Head>
        <title>
          Checklist: {form.processName} - Resource-based Checklist Generation
        </title>
      </Head>
      <div className="flex space-x-2 py-5 bg-white justify-center rounded-lg border border-indigo-200">
        <div className="lg:text-4xl font-bold">{form.processName}</div>
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

ChecklistPage.getInitialProps = async (ctx: NextPageContext) => {
  const { id } = ctx.query;
  const form = await getChecklist(Number(id));
  return { form };
};

export default ChecklistPage;
