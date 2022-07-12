import { jsonValidation } from "./util";

export async function getDependencies(processInput: string, env: string) {
  const res = await fetch(
    `${
      env === "healthcare"
        ? process.env.HEALTH_BACKEND_URL
        : process.env.PAYMENT_BACKEND_URL
    }/dependency`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonValidation(processInput),
    }
  ).catch((error) => {
    console.log(error);
  });
  if (!res) return {};
  return await res.json();
}

export async function getForeignTable(
  tableName: string,
  fieldName: string,
  env: string
) {
  const res = await fetch(
    `${
      env === "healthcare"
        ? process.env.HEALTH_BACKEND_URL
        : process.env.PAYMENT_BACKEND_URL
    }/dependency?tableName=${tableName}&fieldName=${fieldName}`,
    {
      method: "GET",
    }
  ).catch((error) => {
    console.log(error);
  });
  if (!res) return {};
  return await res.json();
}

export async function getRecommenedForeign(
  tableName: string,
  fieldName: string,
  env: string
) {
  const res = await fetch(
    `${
      env === "healthcare"
        ? process.env.HEALTH_BACKEND_URL
        : process.env.PAYMENT_BACKEND_URL
    }/dependency/recommendedQueries?tableName=${tableName}&fieldName=${fieldName}`,
    {
      method: "GET",
    }
  ).catch((error) => {
    console.log(error);
  });
  if (!res) return {};
  return await res.json();
}
