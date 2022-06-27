import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "../../app/store";

export interface ProcessInputState {
  process: string;
}

const sampleProcesses = [
  {
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
  },
  {
    name: "DelegateHealthcareService",
    inputs: [
      {
        argType: "VARR",
        name: "Patient",
        args: [],
      },
      {
        argType: "VARR",
        name: "HealthcareActor",
        args: [],
      },
      {
        argType: "VARR",
        name: "HealthcareService",
        args: [],
      },
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
                {
                  argType: "VARR",
                  name: "CheckedHealthcareService",
                  args: [],
                },
                {
                  argType: "VARR",
                  name: "ClosedContract",
                  args: [],
                },
              ],
            },
            {
              argType: "TIMES",
              name: "",
              args: [
                {
                  argType: "VARR",
                  name: "Delegation",
                  args: [],
                },
                {
                  argType: "VARR",
                  name: "ServiceRequester",
                  args: [],
                },
                {
                  argType: "VARR",
                  name: "OpenContract",
                  args: [],
                },
                {
                  argType: "VARR",
                  name: "Obstacle",
                  args: [],
                },
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
            {
              argType: "VARR",
              name: "PendingHealthcareService",
              args: [],
            },
            {
              argType: "VARR",
              name: "Delegation",
              args: [],
            },
            {
              argType: "VARR",
              name: "ServiceRequester",
              args: [],
            },
            {
              argType: "VARR",
              name: "RejectedContract",
              args: [],
            },
          ],
        },
      ],
    },
  },
];

const initialState: ProcessInputState = {
  process: JSON.stringify(sampleProcesses[0], null, 2),
};

export const processInputSlice = createSlice({
  name: "processInput",
  initialState,
  reducers: {
    updateProcessInput: (state, action: PayloadAction<string>) => {
      state.process = action.payload;
    },
    resetProcessInput: (state) => {
      state = initialState;
    },
    selectFirstProcess: (state) => {
      state.process = JSON.stringify(sampleProcesses[0], null, 2);
    },
    selectSecondProcess: (state) => {
      state.process = JSON.stringify(sampleProcesses[1], null, 2);
    },
  },
});

export const {
  updateProcessInput,
  resetProcessInput,
  selectFirstProcess,
  selectSecondProcess,
} = processInputSlice.actions;

export const selectProcessInput = (state: AppState) =>
  state.processInput.process;

export default processInputSlice.reducer;
