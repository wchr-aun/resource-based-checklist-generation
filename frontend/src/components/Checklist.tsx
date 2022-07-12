import { BaseComponent, Component, COMPONENT_TYPES } from "@models";
import { useState } from "react";
import Divider from "./Divider";
import Checkboxes from "./inputs/Checkboxes";
import Choices from "./inputs/Choices";
import Date from "./inputs/Date";
import Dropdown from "./inputs/Dropdown";
import Input from "./inputs/Input";
import Paragraph from "./inputs/Paragraph";
import Time from "./inputs/Time";
import Tabs from "./Tabs";

interface Props {
  checklist: BaseComponent[];
}

function Checklist(props: Props) {
  const { checklist } = props;
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState<Record<string, number>>({});

  function dfsChecklist(
    component: BaseComponent | Component,
    key: string = "root",
    last: boolean = false
  ) {
    const prefix = `${key}.${component.name}`;
    if (
      component.componentType === COMPONENT_TYPES.TAB &&
      tab[prefix] === undefined
    ) {
      setTab({ ...tab, [prefix]: 0 });
    }
    if (
      component.componentType === COMPONENT_TYPES.HEADER &&
      show[prefix] === undefined
    ) {
      setShow({ ...show, [prefix]: true });
    }
    return (
      <div key={prefix}>
        {component.componentType === COMPONENT_TYPES.HEADER &&
          !component.children.every((c) => c.hide) && (
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <div className="font-bold">{component.name}</div>
                <div
                  className="cursor-pointer flex self-center text-sm font-medium"
                  onClick={() =>
                    setShow({
                      ...show,
                      [prefix]: !show[prefix],
                    })
                  }
                >
                  {show[prefix] ? "Collapse" : "Expand"}
                </div>
              </div>
              {show[prefix] && (
                <div className="ml-5">
                  {[...component.children]
                    .sort((a, b) => a.order - b.order)
                    .map((child, i) =>
                      dfsChecklist(
                        child,
                        prefix,
                        i === component.children.length - 1
                      )
                    )}
                </div>
              )}
              {!last && <Divider className="pt-2" />}
            </div>
          )}
        {component.componentType === COMPONENT_TYPES.TAB && (
          <div>
            <Tabs
              tabs={component.children.map((child) => child.name)}
              currentTab={tab[prefix]}
              onTabChange={(index) => setTab({ ...tab, [prefix]: index })}
            />
            <div className="ml-7 mt-3">
              {[...component.children]
                .sort((a, b) => a.order - b.order)
                .flatMap((child, i) =>
                  i === tab[prefix]
                    ? child.componentType === COMPONENT_TYPES.HEADER &&
                      child.children.every(
                        (v) => v.componentType === COMPONENT_TYPES.HEADER
                      ) &&
                      child.children.every(
                        (v) => v.componentType === COMPONENT_TYPES.HEADER
                      )
                      ? child.children
                          .filter((v) => !v.children.every((vv) => vv.hide))
                          .map((c, j) =>
                            dfsChecklist(
                              c,
                              prefix,
                              j ===
                                child.children.filter(
                                  (v) => !v.children.every((vv) => vv.hide)
                                ).length -
                                  1
                            )
                          )
                      : dfsChecklist(child, prefix, true)
                    : null
                )}
            </div>
          </div>
        )}
        {component.componentType !== COMPONENT_TYPES.HEADER &&
          component.componentType !== COMPONENT_TYPES.TAB &&
          !component.hide && (
            <div className="flex space-y-1 space-x-2">
              <div className="font-medium w-2/12 flex justify-end self-center">
                {component.name}
                {component.required ? (
                  <span className="text-red-500 ml-1">*</span>
                ) : (
                  ""
                )}
              </div>
              {component.componentType === COMPONENT_TYPES.INPUT && (
                <Input
                  className="w-10/12"
                  disabled={!!component.inputDependencyField}
                  placeholder={
                    !component.inputDependencyField
                      ? ""
                      : `Linked to { ${component.inputDependency} - ${component.inputDependencyField} }`
                  }
                />
              )}
              {component.componentType === COMPONENT_TYPES.CONSTANT && (
                <Input
                  className="w-10/12"
                  disabled={true}
                  placeholder={`Constant ${component.validation} to { ${component.outputDependency} - ${component.outputDependencyField} }`}
                />
              )}
              {component.componentType === COMPONENT_TYPES.PARAGRAPH && (
                <Paragraph
                  className="w-10/12"
                  disabled={!!component.inputDependencyField}
                />
              )}
              {component.componentType === COMPONENT_TYPES.DROPDOWN && (
                <Dropdown
                  name={`Select ${component.name}`}
                  options={component.validation
                    .replaceAll("^", "")
                    .replaceAll("$", "")
                    .split("|")}
                />
              )}
              {component.componentType === COMPONENT_TYPES.CHOICES && (
                <Choices
                  className="w-full"
                  options={component.validation
                    .replaceAll("^", "")
                    .replaceAll("$", "")
                    .split("|")}
                />
              )}
              {component.componentType === COMPONENT_TYPES.CHECKBOXES && (
                <Checkboxes
                  options={component.validation
                    .replaceAll("^", "")
                    .replaceAll("$", "")
                    .split("|")}
                  className="w-full"
                />
              )}
              {component.componentType === COMPONENT_TYPES.TIME && (
                <Time
                  className="w-10/12"
                  disabled={!!component.inputDependencyField}
                />
              )}
              {component.componentType === COMPONENT_TYPES.DATE && (
                <Date
                  className="w-10/12"
                  disabled={!!component.inputDependencyField}
                />
              )}
            </div>
          )}
      </div>
    );
  }

  return (
    <div className="border rounded-lg border-indigo-200 bg-white p-5">
      {checklist.map((c, i) => (
        <div className="px-5 py-1" key={i}>
          {dfsChecklist(c, "root", true)}
          {i !== checklist.length - 1 && <Divider className="mt-2" />}
        </div>
      ))}
    </div>
  );
}

export default Checklist;
