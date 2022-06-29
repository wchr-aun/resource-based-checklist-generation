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
    body: JSON.stringify(template),
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
