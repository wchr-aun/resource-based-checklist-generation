import Divider from "@components/Divider";
import ScrollToTop from "@features/ScrollToTop/ScrollToTop";
import { Form, Information } from "@models";
import { getChecklist } from "api/checklist";
import Head from "next/head";
import InformationComponent from "@components/Information";
import Checklist from "@components/Checklist";
import { useEffect, useState } from "react";
import { selectEnv } from "@app/envSlice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { useRouter } from "next/router";
import { setLoading } from "@app/loadingSlice";

const ChecklistPage = () => {
  const [form, setForm] = useState<Form>({} as Form);
  const [information, setInformation] = useState<Information[]>([]);
  const env = useAppSelector(selectEnv);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    dispatch(setLoading(true));
    getChecklist(Number(id), env).then((res: Form) => {
      setForm(res);
      setInformation(
        res.information.filter((v: Information) =>
          v.details.some((d) => !d.hide)
        )
      );
      dispatch(setLoading(false));
    });
  }, [id]);

  return (
    <div>
      {JSON.stringify(form) !== "{}" && (
        <div className="space-y-2 mb-8">
          <ScrollToTop />
          <Head>
            <title>
              Checklist: {form.processName} - Resource-based Checklist
              Generation
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
      )}
    </div>
  );
};

export default ChecklistPage;
