import { BaseComponent, Component, Template } from "@models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "../../app/store";

export interface FormState {
  processName: string;
  originalProcessName: string;
  components: Component[];
}

const initialState: FormState = {
  processName: "",
  originalProcessName: "",
  components: [],
};

const getNode = (prefix: string, components: Component[]): Component => {
  const splitedPrefix = prefix.split(".");
  if (splitedPrefix.length === 1) return { children: components } as Component;

  let curr = components;
  let node: Component = {} as Component;
  splitedPrefix.slice(1).forEach((p) => {
    const temp = curr.find((v) => v.originalName === p);
    if (temp) node = temp;
    if (temp?.children) curr = temp.children;
  });

  return node;
};

const insertOriginalNames = (component: BaseComponent): Component => {
  return {
    ...component,
    children: component.children.flatMap((c) => insertOriginalNames(c)),
    originalName: component.name,
  };
};

export const formSlice = createSlice({
  name: "process",
  initialState,
  reducers: {
    setForm: (state, action: PayloadAction<Template>) => {
      const { processName, components } = action.payload;
      state.processName = processName;
      state.originalProcessName = processName;
      state.components = components.flatMap((component) =>
        insertOriginalNames({ ...component })
      );
    },
    updateComponent: (
      state,
      action: PayloadAction<{
        prefix: string;
        field:
          | "componentType"
          | "validation"
          | "name"
          | "editable"
          | "required"
          | "function";
        value: string | boolean;
      }>
    ) => {
      const { prefix, field, value } = action.payload;
      const node = getNode(prefix, state.components);
      if (!node) return;
      node[field] = value as never;
    },
    addNewField: (state, action: PayloadAction<string>) => {
      const prefix = action.payload;
      const node = getNode(prefix, state.components);
      if (!node) return;
      node.children.push({
        name: "",
        componentType: "INPUT",
        css: "",
        editable: false,
        function: "",
        required: false,
        inputDependency: "",
        inputDependencyField: "",
        outputDependency: "",
        outputDependencyField: "",
        validation: "",
        value: "",
        order:
          node.children.length !== 0
            ? node.children.reduce((p, c) => Math.max(p, c.order), 0) + 1
            : 0,
        children: [],
        originalName: `New Field - (${node.children.length + 1})`,
      });
    },
    addNewModel: (state) => {
      state.components = [
        ...state.components,
        {
          name: "",
          componentType: "HEADER",
          css: "",
          editable: false,
          function: "",
          required: false,
          inputDependency: "",
          inputDependencyField: "",
          outputDependency: "",
          outputDependencyField: "",
          validation: "",
          value: "",
          order:
            state.components.length !== 0
              ? state.components.reduce((p, c) => Math.max(p, c.order), 0) + 1
              : 0,
          children: [],
          originalName: `New Model - (${state.components.length + 1})`,
        },
      ];
    },
    reorderComponents: (
      state,
      action: PayloadAction<{
        prefix: string;
        focusedOrder: number;
        direction: "UP" | "DOWN";
      }>
    ) => {
      const { prefix, focusedOrder, direction } = action.payload;
      const node = getNode(prefix, state.components);
      if (!node) return;
      const component = node.children.find((c) => c.order === focusedOrder);
      if (!component) return;
      const becomingOrder =
        direction === "UP" ? component.order - 1 : component.order + 1;
      const otherNode = node.children.find((c) => c.order === becomingOrder);
      if (!otherNode) return;
      otherNode.order =
        direction === "UP" ? otherNode.order + 1 : otherNode.order - 1;
      component.order = becomingOrder;
    },
    setProcessName: (state, action: PayloadAction<string>) => {
      state.processName = action.payload;
    },
    duplicateComponent: (
      state,
      action: PayloadAction<{ prefix: string; index: number }>
    ) => {
      const { prefix, index } = action.payload;
      const node = getNode(prefix, state.components);
      if (!node) return;
      node.children.splice(index, 0, {
        ...node.children[index],
        order: node.children[index].order + 0.1,
        originalName:
          (node.children[index].name || node.children[index].originalName) +
          " - duplicate",
        name:
          (node.children[index].name || node.children[index].originalName) +
          " - duplicate",
      });

      node.children.sort((a, b) => a.order - b.order);
      node.children.forEach((c, i) => {
        c.order = i;
      });
    },
    deleteComponent: (
      state,
      action: PayloadAction<{ prefix: string; index: number }>
    ) => {
      const { prefix, index } = action.payload;
      const node = getNode(prefix, state.components);
      if (!node) return;
      node.children.splice(index, 1);
      node.children.sort((a, b) => a.order - b.order);

      node.children.sort((a, b) => a.order - b.order);
      node.children.forEach((c, i) => {
        c.order = i;
      });
    },
    clearComponentChildren: (state, action: PayloadAction<string>) => {
      const prefix = action.payload;
      const node = getNode(prefix, state.components);
      if (!node) return;
      node.children = [];
    },
    resetForm: (state) => {
      state = initialState;
    },
  },
});

export const {
  setForm,
  updateComponent,
  addNewField,
  addNewModel,
  setProcessName,
  deleteComponent,
  duplicateComponent,
  clearComponentChildren,
  resetForm,
  reorderComponents,
} = formSlice.actions;

export const selectProcessName = (state: AppState) => state.form.processName;
export const selectOriginalProcessName = (state: AppState) =>
  state.form.originalProcessName;
export const selectComponents = (state: AppState) => state.form.components;

export default formSlice.reducer;
