import { Form } from "@models";
import { jsonValidation } from "./util";

export async function getTemplate(
  processInput: string,
  autolink: boolean,
  env: string
) {
  const res = await fetch(
    `${
      env === "healthcare"
        ? process.env.HEALTH_BACKEND_URL
        : process.env.PAYMENT_BACKEND_URL
    }/template`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonValidation(processInput, autolink),
    }
  ).catch((error) => {
    console.log(error);
  });
  if (!res) return {};
  return await res.json();
}

export async function saveTemplate(template: Form, env: string) {
  const res = await fetch(
    `${
      env === "healthcare"
        ? process.env.HEALTH_BACKEND_URL
        : process.env.PAYMENT_BACKEND_URL
    }/template`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: template.name,
        processName: template.processName,
        components: template.components,
        information: template.information.map((info) => ({
          name: info.name,
          order: info.order,
          inputDependency: info.inputDependency,
          details: info.details.map((detail) => ({
            name: detail.name,
            order: detail.order,
            inputDependencyField: detail.inputDependencyField,
            hide: detail.hide,
            isQuery: detail.isQuery || false,
            foreignKey: detail.foreignKey || "",
            queryTable: detail.queryTable || "",
            queryField: detail.queryField || "",
          })),
        })),
      }),
    }
  ).catch((error) => {
    console.log(error);
  });
  if (!res) return {};
  return await res.json();
}

export async function getTemplates(env: string) {
  const res = await fetch(
    `${
      env === "healthcare"
        ? process.env.HEALTH_BACKEND_URL
        : process.env.PAYMENT_BACKEND_URL
    }/template`
  ).catch((error) => {
    console.log(error);
  });
  if (!res) return {};
  return await res.json();
}
