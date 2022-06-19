import type { NextPage } from "next";
import FormTemplate from "@features/form/Form";
import { Template } from "@models";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { setForm } from "@features/form/formSlice";
import Head from "next/head";
import store from "@app/store";

interface Props {
  templateResponse: Template;
}

const jsonValidation = (s: string) => {
  try {
    JSON.parse(s);
    return s;
  } catch {
    return JSON.stringify({
      name: "AwardContract",
      inputs: [
        {
          argType: "VARR",
          name: "AcceptedContract",
          args: [],
        },
        {
          argType: "VARR",
          name: "ServiceProvider",
          args: [],
        },
      ],
      output: {
        argType: "VARR",
        name: "OpenContract",
        args: [],
      },
    });
  }
};

const CreateATemplate: NextPage<Props> = (props) => {
  const { templateResponse } = props;

  const dispatch = useAppDispatch();
  dispatch(setForm(templateResponse));

  return (
    <div>
      <Head>
        <title>Canvas: Resource-based Checklist Generation</title>
      </Head>
      <FormTemplate originalTemplate={templateResponse} />
    </div>
  );
};

CreateATemplate.getInitialProps = async (ctx) => {
  const res = await fetch("http://localhost:8080/template", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonValidation(store.getState().processInput.process),
  });
  const templateResponse = await res.json();
  return { templateResponse };
};

export default CreateATemplate;
