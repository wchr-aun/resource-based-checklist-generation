import type { NextPage } from "next";
import FormTemplate from "@features/form/Form";
import Head from "next/head";
import store from "@app/store";
import ScrollToTop from "@features/ScrollToTop/ScrollToTop";

const CreateATemplate: NextPage = () => {
  const form = store.getState().form;
  return (
    <div>
      <ScrollToTop />
      <Head>
        <title>Canvas: Resource-based Checklist Generation</title>
      </Head>
      <FormTemplate originalTemplate={form} />
    </div>
  );
};

export default CreateATemplate;
