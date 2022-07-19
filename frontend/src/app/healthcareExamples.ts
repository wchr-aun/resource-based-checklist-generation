export const healthcareExamples = [
  {
    name: "AwardContract",
    inputs: [
      { argType: "VARR", name: "AcceptedContract", args: [] },
      { argType: "VARR", name: "ServiceProvider", args: [] },
    ],
    output: { argType: "VARR", name: "OpenContract", args: [] },
  },
  {
    name: "DelegateHealthcareService",
    inputs: [
      { argType: "VARR", name: "Patient", args: [] },
      { argType: "VARR", name: "HealthcareActor", args: [] },
      { argType: "VARR", name: "HealthcareService", args: [] },
    ],
    output: {
      argType: "PLUS",
      name: "",
      args: [
        {
          argType: "PLUS",
          name: "",
          args: [
            {
              argType: "TIMES",
              name: "",
              args: [
                { argType: "VARR", name: "CheckedHealthcareService", args: [] },
                { argType: "VARR", name: "ClosedContract", args: [] },
              ],
            },
            {
              argType: "TIMES",
              name: "",
              args: [
                { argType: "VARR", name: "Delegation", args: [] },
                { argType: "VARR", name: "ServiceRequester", args: [] },
                { argType: "VARR", name: "OpenContract", args: [] },
                { argType: "VARR", name: "Obstacle", args: [] },
                { argType: "VARR", name: "PendingHealthcareService", args: [] },
              ],
            },
          ],
        },
        {
          argType: "TIMES",
          name: "",
          args: [
            { argType: "VARR", name: "PendingHealthcareService", args: [] },
            { argType: "VARR", name: "Delegation", args: [] },
            { argType: "VARR", name: "ServiceRequester", args: [] },
            { argType: "VARR", name: "RejectedContract", args: [] },
          ],
        },
      ],
    },
  },
  {
    name: "ProvideService",
    inputs: [
      { argType: "VARR", name: "OpenContract", args: [] },
      { argType: "VARR", name: "PendingHealthcareService", args: [] },
    ],
    output: {
      argType: "PLUS",
      name: "",
      args: [
        { argType: "VARR", name: "CompletedHealthcareService", args: [] },
        {
          argType: "TIMES",
          name: "",
          args: [
            { argType: "VARR", name: "Obstacle", args: [] },
            { argType: "VARR", name: "PendingHealthcareService", args: [] },
          ],
        },
      ],
    },
  },
  {
    name: "DecideCollaboration",
    inputs: [{ argType: "VARR", name: "RequestedContract", args: [] }],
    output: {
      argType: "PLUS",
      name: "",
      args: [
        {
          argType: "TIMES",
          name: "",
          args: [
            { argType: "VARR", name: "AcceptedContract", args: [] },
            { argType: "VARR", name: "ServiceProvider", args: [] },
          ],
        },
        { argType: "VARR", name: "RejectedContract", args: [] },
      ],
    },
  },
  {
    name: "CheckOutcome",
    inputs: [
      { argType: "VARR", name: "OpenContract", args: [] },
      { argType: "VARR", name: "CompletedHealthcareService", args: [] },
      { argType: "VARR", name: "HealthcareActor", args: [] },
    ],
    output: {
      argType: "TIMES",
      name: "",
      args: [
        { argType: "VARR", name: "CheckedHealthcareService", args: [] },
        { argType: "VARR", name: "ClosedContract", args: [] },
      ],
    },
  },
  {
    name: "RequestDelegation",
    inputs: [
      { argType: "VARR", name: "Patient", args: [] },
      { argType: "VARR", name: "HealthcareActor", args: [] },
      { argType: "VARR", name: "HealthcareService", args: [] },
    ],
    output: {
      argType: "TIMES",
      name: "",
      args: [
        { argType: "VARR", name: "Delegation", args: [] },
        { argType: "VARR", name: "RequestedContract", args: [] },
        { argType: "VARR", name: "ServiceRequester", args: [] },
        { argType: "VARR", name: "PendingHealthcareService", args: [] },
      ],
    },
  },
  {
    name: "RequestAssignment",
    inputs: [
      { argType: "VARR", name: "Patient", args: [] },
      { argType: "VARR", name: "HealthcareActor", args: [] },
      { argType: "VARR", name: "HealthcareService", args: [] },
    ],
    output: {
      argType: "TIMES",
      name: "",
      args: [
        { argType: "VARR", name: "Assignment", args: [] },
        { argType: "VARR", name: "RequestedContract", args: [] },
        { argType: "VARR", name: "ServiceRequester", args: [] },
        { argType: "VARR", name: "PendingHealthcareService", args: [] },
      ],
    },
  },
  {
    name: "AssignHealthcareService",
    inputs: [
      { argType: "VARR", name: "Patient", args: [] },
      { argType: "VARR", name: "HealthcareActor", args: [] },
      { argType: "VARR", name: "HealthcareService", args: [] },
    ],
    output: {
      argType: "TIMES",
      name: "",
      args: [
        {
          argType: "PLUS",
          name: "",
          args: [
            {
              argType: "PLUS",
              name: "",
              args: [
                {
                  argType: "TIMES",
                  name: "",
                  args: [
                    {
                      argType: "VARR",
                      name: "CheckedHealthcareService",
                      args: [],
                    },
                    { argType: "VARR", name: "ClosedContract", args: [] },
                  ],
                },
                {
                  argType: "TIMES",
                  name: "",
                  args: [
                    { argType: "VARR", name: "Assignment", args: [] },
                    { argType: "VARR", name: "ServiceProvider", args: [] },
                    { argType: "VARR", name: "OpenContract", args: [] },
                    { argType: "VARR", name: "Obstacle", args: [] },
                    {
                      argType: "VARR",
                      name: "PendingHealthcareService",
                      args: [],
                    },
                  ],
                },
              ],
            },
            {
              argType: "TIMES",
              name: "",
              args: [
                { argType: "VARR", name: "PendingHealthcareService", args: [] },
                { argType: "VARR", name: "Assignment", args: [] },
                { argType: "VARR", name: "RejectedContract", args: [] },
              ],
            },
          ],
        },
        { argType: "VARR", name: "ServiceRequester", args: [] },
      ],
    },
  },
  {
    name: "SetAssignmentResponsible",
    inputs: [
      { argType: "VARR", name: "Assignment", args: [] },
      { argType: "VARR", name: "ServiceProvider", args: [] },
    ],
    output: { argType: "VARR", name: "HealthcareActor", args: [] },
  },
  {
    name: "SetDelegationResponsible",
    inputs: [
      { argType: "VARR", name: "Delegation", args: [] },
      { argType: "VARR", name: "ServiceRequester", args: [] },
    ],
    output: { argType: "VARR", name: "HealthcareActor", args: [] },
  },
];
