import { BaseComponent, Component, Details, Form, Information } from "@models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "@app/store";

export interface FormState {
  processName: string;
  originalProcessName: string;
  components: Component[];
  information: Information[];
}

const initialState: FormState = {
  processName: "",
  originalProcessName: "",
  components: [],
  information: [],
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
  name: "form",
  initialState,
  reducers: {
    setForm: (state, action: PayloadAction<Form>) => {
      const { processName, components, information } = action.payload;
      state.processName = processName;
      state.originalProcessName = processName;
      state.components = components.flatMap((component) =>
        insertOriginalNames({ ...component })
      );
      state.information = information;
    },
    updateComponent: (
      state,
      action: PayloadAction<{
        prefix: string;
        field:
          | "componentType"
          | "validation"
          | "name"
          | "hide"
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
        name: `New Field - (${node.children.length + 1})`,
        componentType: "INPUT",
        css: "",
        editable: true,
        function: "",
        required: false,
        hide: false,
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
          name: `New Model - (${state.components.length + 1})`,
          componentType: "HEADER",
          css: "",
          editable: false,
          function: "",
          required: false,
          hide: false,
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
    toggleHideInput: (
      state,
      action: PayloadAction<{ infoIndex: number; detailsIndex: number }>
    ) => {
      const { infoIndex, detailsIndex } = action.payload;
      const value = state.information[infoIndex].details[detailsIndex].hide;
      state.information[infoIndex].details[detailsIndex].hide = !value;
    },
    toggleHideAllInput: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const value = state.information[index].details
        .filter((v) => !v.isQuery)
        .every((v) => v.hide);
      state.information[index].details = state.information[index].details.map(
        (v) => ({ ...v, hide: !v.isQuery && !value })
      );
    },
    updateInputParentName: (
      state,
      action: PayloadAction<{ name: string; infoIndex: number }>
    ) => {
      const { name, infoIndex } = action.payload;
      state.information[infoIndex].name = name;
    },
    updateInputName: (
      state,
      action: PayloadAction<{
        name: string;
        infoIndex: number;
        detailsIndex: number;
      }>
    ) => {
      const { name, infoIndex, detailsIndex } = action.payload;
      state.information[infoIndex].details[detailsIndex].name = name;
    },
    updateDependencies: (
      state,
      action: PayloadAction<{
        prefix: string;
        inputDependency: string;
        inputDependencyField: string;
        outputDependency: string;
        outputDependencyField: string;
      }>
    ) => {
      const {
        prefix,
        inputDependency,
        inputDependencyField,
        outputDependency,
        outputDependencyField,
      } = action.payload;
      const node = getNode(prefix, state.components);
      if (!node) return;
      node.inputDependency = inputDependency;
      node.inputDependencyField = inputDependencyField;
      node.outputDependency = outputDependency;
      node.outputDependencyField = outputDependencyField;
    },
    addNewInputDetails: (
      state,
      action: PayloadAction<{
        parentIndex: number;
        index: number;
        queryTable: string;
        foreignKey: string;
      }>
    ) => {
      const { parentIndex, index, queryTable, foreignKey } = action.payload;
      state.information[parentIndex].details
        .filter((d) => d.order > index)
        .forEach((d) => (d.order += 1));
      state.information[parentIndex].details.splice(index, 0, {
        ...state.information[parentIndex].details[index],
        name: "",
        hide: false,
        order: index + 1,
        isQuery: true,
        foreignKey: foreignKey,
        queryTable: queryTable,
        queryField: "",
      });
      state.information[parentIndex].details.sort((a, b) => a.order - b.order);
    },
    setNewInputDetails: (
      state,
      action: PayloadAction<{
        parentIndex: number;
        index: number;
        foreigns: {
          foreignKey: string;
          queryTable: string;
          queryField: string;
        }[];
      }>
    ) => {
      const { parentIndex, index, foreigns } = action.payload;
      const inputDep = state.information[parentIndex].inputDependency;
      const inputDepField =
        state.information[parentIndex].details[index].inputDependencyField;
      const n = state.information[parentIndex].details.filter(
        (d) => d.inputDependencyField === inputDepField && d.isQuery
      ).length;
      state.information[parentIndex].details
        .filter((d) => d.order > index)
        .forEach((d) => (d.order += foreigns.length - n));
      state.information[parentIndex].details.splice(
        index + 1,
        n,
        ...foreigns.map((v, i) => ({
          ...state.information[parentIndex].details[index],
          name: "",
          hide: false,
          order: index + i + 1,
          isQuery: true,
          foreignKey: v.foreignKey,
          queryTable: v.queryTable,
          queryField: v.queryField,
          queryHide: true,
        }))
      );
      state.information[parentIndex].details.sort((a, b) => a.order - b.order);
    },
    toggleHideQuery: (
      state,
      action: PayloadAction<{
        parentIndex: number;
        index: number;
      }>
    ) => {
      const { parentIndex, index } = action.payload;
      const value = state.information[parentIndex].details[index].queryHide;
      state.information[parentIndex].details[index].queryHide = !value;
    },
    deletedInputDetails: (
      state,
      action: PayloadAction<{ parentIndex: number; index: number }>
    ) => {
      const { parentIndex, index } = action.payload;
      if (!state.information[parentIndex].details[index].isQuery) return;
      state.information[parentIndex].details.splice(index, 1);
      state.information[parentIndex].details
        .filter((d) => d.order > index)
        .forEach((d) => (d.order += 1));
    },
    updateQueryField: (
      state,
      action: PayloadAction<{
        parentIndex: number;
        index: number;
        queryTable: string;
        queryField: string;
        foreignKey: string;
      }>
    ) => {
      const { parentIndex, index, queryTable, queryField, foreignKey } =
        action.payload;
      state.information[parentIndex].details[index].queryField = queryField;
      state.information[parentIndex].details[index].queryTable = queryTable;
      state.information[parentIndex].details[index].foreignKey = foreignKey;
    },
    clearComponentChildren: (state, action: PayloadAction<string>) => {
      const prefix = action.payload;
      const node = getNode(prefix, state.components);
      if (!node) return;
      node.children = [];
    },
    resetForm: (state) => {
      state.components = [];
      state.information = [];
      state.processName = "";
      state.originalProcessName = "";
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
  toggleHideInput,
  toggleHideAllInput,
  updateInputParentName,
  updateInputName,
  updateDependencies,
  addNewInputDetails,
  setNewInputDetails,
  toggleHideQuery,
  deletedInputDetails,
  updateQueryField,
  clearComponentChildren,
  resetForm,
  reorderComponents,
} = formSlice.actions;

export const selectProcessName = (state: AppState) => state.form.processName;
export const selectOriginalProcessName = (state: AppState) =>
  state.form.originalProcessName;
export const selectComponents = (state: AppState) => state.form.components;
export const selectInformation = (state: AppState) => state.form.information;

export default formSlice.reducer;
