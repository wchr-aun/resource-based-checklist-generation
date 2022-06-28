package com.github.wchraun.checklist

object ComponentType extends Enumeration {
  type ComponentType = Value
  val INPUT, PARAGRAPH, DROPDOWN, CHOICES, CHECKBOXES, DATE, TIME, UPLOAD, HEADER, TAB = Value
}

final object ArgType extends Enumeration {
  type ArgType = Value
  val VARR, PLUS, TIMES = Value
}

import com.github.wchraun.checklist.ArgType.ArgType
import com.github.wchraun.checklist.ComponentType.ComponentType

final case class StartChecklistArg(templateId: String)

final case class Arg(argType: ArgType, name: String, args: Option[Array[Arg]])
final case class Process(name: String, inputs: Array[Arg], output: Arg)
final case class Details(name: String,
                         order: Int,
                         value: String,
                         inputDependency: String,
                         inputDependencyField: String,
                         hide: Boolean)
final case class Information(name: String, order: Int, details: Array[Details])
final case class Component(
                            order: Int,
                            name: String,
                            value: String,
                            componentType: ComponentType,
                            editable: Boolean,
                            required: Boolean,
                            validation: String,
                            function: String,
                            inputDependency: String,
                            inputDependencyField: String,
                            outputDependency: String,
                            outputDependencyField: String,
                            children: Array[Component]
                          )
final case class DependencyDetails(name: String, children: Array[String])
final case class CreateTemplateResponse(
                                         processName: String,
                                         information: Array[Information],
                                         components: Array[Component]
                                       )
final case class GetDependencyResponse(inputDependencies: Array[DependencyDetails], outputDependencies: Array[DependencyDetails])
