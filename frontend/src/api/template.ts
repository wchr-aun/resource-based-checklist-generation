import { Form } from "@models";
import { jsonValidation } from "./util";

export async function getTemplate(processInput: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/template`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonValidation(processInput),
  }).catch((error) => {
    console.log(error);
  });
  if (!res) return {};
  return await res.json();
}

export async function saveTemplate(template: Form) {
  const res = await fetch(`${process.env.BACKEND_URL}/template`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      processName: template.processName,
      components: template.components,
      information: template.information.map((info) => ({
        name: info.name,
        order: info.order,
        details: info.details.map((detail) => ({
          name: detail.name,
          order: detail.order,
          inputDependency: detail.inputDependency,
          inputDependencyField: detail.inputDependencyField,
          hide: detail.hide,
          isQuery: detail.isQuery || false,
          foreignKey: detail.foreignKey || "",
          queryTable: detail.queryTable || "",
          queryField: detail.queryField || "",
        })),
      })),
    }),
  }).catch((error) => {
    console.log(error);
  });
  if (!res) return {};
  return await res.json();
}

export async function getTemplates() {
  const res = await fetch(`${process.env.BACKEND_URL}/template`).catch(
    (error) => {
      console.log(error);
    }
  );
  if (!res) return {};
  return await res.json();
}
