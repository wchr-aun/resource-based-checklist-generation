import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import formReducer from "@features/form/formSlice";
import processInputReducer from "@features/processInput/processSlice";
import dependenciesReducer from "@features/form/dependencySlice";
import foreignTableReducer from "@features/form/foreignTableSlice";
import loadingReducer from "@app/loadingSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      form: formReducer,
      processInput: processInputReducer,
      dependencies: dependenciesReducer,
      foreignTable: foreignTableReducer,
      loading: loadingReducer,
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
