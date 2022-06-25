import type { NextPage } from "next";
import FormTemplate from "@features/form/Form";
import { Form } from "@models";
import Head from "next/head";
import store from "@app/store";

const CreateATemplate: NextPage = () => {
  const form = store.getState().form;
  return (
    <div>
      <Head>
        <title>Canvas: Resource-based Checklist Generation</title>
      </Head>
      <FormTemplate originalTemplate={form} />
    </div>
  );
};

export default CreateATemplate;
