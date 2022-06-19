import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import counterReducer from "../features/counter/counterSlice";
import formReducer from "../features/form/formSlice";
import processInputReducer from "../features/processInput/processSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      counter: counterReducer,
      form: formReducer,
      processInput: processInputReducer,
    },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
