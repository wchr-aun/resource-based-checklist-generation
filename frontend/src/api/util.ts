export const defaultTemplate = {
  name: "AwardContract",
  inputs: [
    {
      argType: "VARR",
      name: "AcceptedContract",
      args: [],
    },
    {
      argType: "VARR",
      name: "ServiceProvider",
      args: [],
    },
  ],
  output: {
    argType: "VARR",
    name: "OpenContract",
    args: [],
  },
};

export const jsonValidation = (s: string) => {
  try {
    JSON.parse(s);
    return s;
  } catch {
    return JSON.stringify(defaultTemplate);
  }
};
