export async function pingHealthcare() {
  const res = await fetch(`${process.env.HEALTH_BACKEND_URL}/ping`, {
    method: "GET",
  }).catch((error) => {
    console.log(error);
  });
  if (!res) return false;
  return (await res.text()) === "pong!";
}

export async function pingPayment() {
  const res = await fetch(`${process.env.PAYMENT_BACKEND_URL}/ping`, {
    method: "GET",
  }).catch((error) => {
    console.log(error);
  });
  if (!res) return false;
  return (await res.text()) === "pong!";
}
