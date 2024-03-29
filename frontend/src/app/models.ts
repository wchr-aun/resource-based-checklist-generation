export interface BaseComponent {
  componentType: string;
  css: string;
  editable: boolean;
  function: string;
  inputDependency: string;
  inputDependencyField: string;
  name: string;
  order: number;
  outputDependency: string;
  outputDependencyField: string;
  required: boolean;
  hide: boolean;
  validation: string;
  value: string;
  children: BaseComponent[];
}

export interface Component extends BaseComponent {
  children: Component[];
  originalName: string;
}

export interface Details {
  name: string;
  order: number;
  inputDependencyField: string;
  hide: boolean;
  isQuery?: boolean;
  foreignKey?: string;
  queryTable?: string;
  queryField?: string;
  queryHide: boolean;
  array: boolean;
}

export interface Information {
  name: string;
  order: number;
  details: Details[];
  inputDependency: string;
}

export interface Form {
  name: string;
  processName: string;
  components: BaseComponent[];
  information: Information[];
}

export const COMPONENT_TYPE_LIST = [
  "HEADER",
  "TAB",
  "INPUT",
  "PARAGRAPH",
  "DROPDOWN",
  "CHOICES",
  "CHECKBOXES",
  "DATE",
  "TIME",
  "CONSTANT",
];

export enum COMPONENT_TYPES {
  HEADER = "HEADER",
  INPUT = "INPUT",
  PARAGRAPH = "PARAGRAPH",
  DROPDOWN = "DROPDOWN",
  CHOICES = "CHOICES",
  CHECKBOXES = "CHECKBOXES",
  DATE = "DATE",
  TIME = "TIME",
  TAB = "TAB",
  CONSTANT = "CONSTANT",
}

export interface DependencyDetails {
  name: string;
  children: string[];
}

export interface Dependencies {
  inputDependencies: DependencyDetails[];
  outputDependencies: DependencyDetails[];
}

export interface Template {
  id: number;
  name: string;
  created: Date;
  updated: Date;
}

export interface LeafComponent extends Component {
  children: LeafComponent[];
  parent?: string;
  parentName?: string;
}
