import { healthcareExamples } from "@app/healthcareExamples";
import { paymentExamples } from "@app/paymentExamples";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "../../app/store";

export interface ProcessInputState {
  process: string;
}

const initialState: ProcessInputState = {
  process: "",
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
    selectProcess: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        state.process = "";
        return;
      }
      state.process = action.payload;
    },
    chooseProcess: (
      state,
      action: PayloadAction<{ env: "healthcare" | "payment"; name: string }>
    ) => {
      const { env, name } = action.payload;
      const sampleProcesses =
        env === "healthcare" ? healthcareExamples : paymentExamples;
      const process = sampleProcesses.find((p) => p.name === name);
      state.process = process ? JSON.stringify(process, null, 2) : "";
    },
  },
});

export const {
  updateProcessInput,
  resetProcessInput,
  selectProcess,
  chooseProcess,
} = processInputSlice.actions;

export const selectProcessInput = (state: AppState) =>
  state.processInput.process;

export default processInputSlice.reducer;
