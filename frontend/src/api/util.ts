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
  autolink: true,
};

export const jsonValidation = (s: string, autolink?: boolean) => {
  try {
    const val = JSON.parse(s);
    val["autolink"] = autolink;
    return JSON.stringify(val);
  } catch {
    return JSON.stringify(defaultTemplate);
  }
};
