import { Form } from "@models";

export async function saveTask(id: string, task: string, result: Form) {
  const res = await fetch(`${process.env.HEALTH_BACKEND_URL}/evaluation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      result: {
        name: result.name,
        processName: result.processName,
        components: result.components,
        information: result.information.map((info) => ({
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
            array: detail.array || false,
          })),
        })),
      },
      task,
    }),
  }).catch((error) => {
    console.log(error);
  });
  if (!res) return false;
  return (await res.json()).success;
}

export async function bookEvalId(id: string) {
  const res = await fetch(
    `${process.env.HEALTH_BACKEND_URL}/evaluation/${id}`,
    {
      method: "POST",
    }
  ).catch((error) => {
    console.log(error);
  });
  if (!res) return false;
  return (await res.json()).success;
}
