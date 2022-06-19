import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "../../app/store";

export interface ProcessInputState {
  process: string;
}

const initialState: ProcessInputState = {
  process: JSON.stringify({
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
  }),
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
  },
});

export const { updateProcessInput, resetProcessInput } =
  processInputSlice.actions;

export const selectProcessInput = (state: AppState) =>
  state.processInput.process;

export default processInputSlice.reducer;
