import { jsonValidation } from "./util";

export async function getDependencies(processInput: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/dependency`, {
    method: "POST",
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
