import type { NextPage } from "next";
import FormTemplate from "@features/form/Form";
import Head from "next/head";
import ScrollToTop from "@features/ScrollToTop/ScrollToTop";

const CreateATemplate: NextPage = () => {
  return (
    <div>
      <ScrollToTop />
      <Head>
        <title>Canvas: Resource-based Checklist Generation</title>
      </Head>
      <FormTemplate />
    </div>
  );
};

export default CreateATemplate;
