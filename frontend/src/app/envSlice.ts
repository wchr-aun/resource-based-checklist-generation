import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "@app/store";
import { appVersion } from "./version";

export interface ProcessInputState {
  env: "healthcare" | "payment";
  isEvaluating: boolean;
  evalId: string;
  appVersion: string;
}

const initialState: ProcessInputState = {
  env: "healthcare",
  isEvaluating: false,
  evalId: "-",
  appVersion: appVersion,
};

export const envSlice = createSlice({
  name: "processInput",
  initialState,
  reducers: {
    setEnv: (state, action: PayloadAction<"healthcare" | "payment">) => {
      state.env = action.payload;
    },
    setEvalId: (state, action: PayloadAction<string>) => {
      state.evalId = action.payload;
      state.isEvaluating = true;
    },
    resetEval: (state) => {
      state.isEvaluating = false;
      state.evalId = "-";
    },
  },
});

export const { setEnv, setEvalId, resetEval } = envSlice.actions;

export const selectEnv = (state: AppState) => state.env.env;
export const selectIsEval = (state: AppState) => state.env.isEvaluating;
export const selectEvalId = (state: AppState) => state.env.evalId;
export const selectAppVersion = (state: AppState) => state.env.appVersion;

export default envSlice.reducer;
