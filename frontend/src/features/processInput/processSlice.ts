import { healthcareExamples } from "@app/healthcareExamples";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "../../app/store";

export interface ProcessInputState {
  process: string;
}

const sampleProcesses = healthcareExamples;

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
    selectProcess: (state, action: PayloadAction<number>) => {
      if (action.payload < 0) {
        state.process = "";
        return;
      }
      state.process = JSON.stringify(sampleProcesses[action.payload], null, 2);
    },
  },
});

export const { updateProcessInput, resetProcessInput, selectProcess } =
  processInputSlice.actions;

export const selectProcessInput = (state: AppState) =>
  state.processInput.process;

export default processInputSlice.reducer;
