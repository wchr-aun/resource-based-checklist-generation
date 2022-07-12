export async function getChecklist(id: number, env: string) {
  const res = await fetch(
    `${
      env === "healthcare"
        ? process.env.HEALTH_BACKEND_URL
        : process.env.PAYMENT_BACKEND_URL
    }/checklist/${id}`
  ).catch((error) => {
    console.log(error);
  });
  if (!res) return {};
  return await res.json();
}

export async function deleteChecklist(id: number, env: string) {
  const res = await fetch(
    `${
      env === "healthcare"
        ? process.env.HEALTH_BACKEND_URL
        : process.env.PAYMENT_BACKEND_URL
    }/checklist/${id}`,
    {
      method: "DELETE",
    }
  ).catch((error) => {
    console.log(error);
  });
  if (!res) return {};
  return await res.json();
}
