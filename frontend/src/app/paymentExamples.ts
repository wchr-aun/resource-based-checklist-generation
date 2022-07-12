export const paymentExamples = [
  {
    name: "ConfirmPayment",
    inputs: [{ argType: "VARR", name: "Order", args: [] }],
    output: {
      argType: "PLUS",
      name: "",
      args: [
        { argType: "VARR", name: "PaidOrder", args: [] },
        { argType: "VARR", name: "CanceledOrder", args: [] },
      ],
    },
  },
  {
    name: "Shipment",
    inputs: [{ argType: "VARR", name: "PaidOrder", args: [] }],
    output: {
      argType: "PLUS",
      name: "",
      args: [
        { argType: "VARR", name: "ShippingOrder", args: [] },
        { argType: "VARR", name: "CanceledOrder", args: [] },
      ],
    },
  },
  {
    name: "CompleteOrder",
    inputs: [{ argType: "VARR", name: "ShippingOrder", args: [] }],
    output: {
      argType: "PLUS",
      name: "",
      args: [
        { argType: "VARR", name: "FullfilledOrder", args: [] },
        { argType: "VARR", name: "CanceledOrder", args: [] },
      ],
    },
  },
  {
    name: "test",
    inputs: [{ argType: "VARR", name: "Order", args: [] }],
    output: { argType: "VARR", name: "Order", args: [] },
  },
];
