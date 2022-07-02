export async function getChecklist(id: number) {
  const res = await fetch(`${process.env.BACKEND_URL}/checklist/${id}`).catch(
    (error) => {
      console.log(error);
    }
  );
  if (!res) return {};
  return await res.json();
}
