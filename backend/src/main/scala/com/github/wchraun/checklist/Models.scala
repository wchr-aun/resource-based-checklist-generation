package com.github.wchraun.checklist

object ComponentType extends Enumeration {
  type ComponentType = Value
  val INPUT, PARAGRAPH, DROPDOWN, CHOICES, CHECKBOXES, DATE, TIME, UPLOAD, HEADER, TAB, CONSTANT = Value
  def withNameOpt(s: String): Option[Value] = values.find(_.toString == s)
}

final object ArgType extends Enumeration {
  type ArgType = Value
  val VARR, PLUS, TIMES = Value
}

import com.github.wchraun.checklist.ArgType.ArgType
import com.github.wchraun.checklist.ComponentType.ComponentType
import java.util.Date

final case class StartChecklistArg(templateId: String)

final case class Arg(argType: ArgType, name: String, args: Option[Array[Arg]])
final case class Process(name: String, inputs: Array[Arg], output: Arg, autolink: Option[Boolean])
final case class Details(name: String,
                         order: Int,
                         inputDependency: String,
                         inputDependencyField: String,
                         hide: Boolean)
final case class InputDetails(name: String,
                                  order: Int,
                                  inputDependencyField: String,
                                  hide: Boolean,
                                  array: Boolean,
                                  isQuery: Boolean,
                                  foreignKey: String,
                                  queryTable: String,
                                  queryField: String)
final case class Information(name: String, order: Int, details: Array[Details], inputDependency: String)
final case class InputInformation(name: String, order: Int, details: Array[InputDetails], inputDependency: String)
final case class Component(
                            order: Int,
                            name: String,
                            value: String,
                            componentType: ComponentType,
                            required: Boolean,
                            hide: Boolean,
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
final case class SaveTemplateResponse(templateId: Int)
final case class TemplateResponse(id: Int, name: String, created: String, updated: String)
final case class GetTemplatesResponse(templates: Array[TemplateResponse])
final case class ForeignQueries(queryTable: String, fields: Array[String], foreignKey: String, array: Boolean)
final case class GetForeignTableResponse(foreignQueries: Array[ForeignQueries])
final case class SaveTemplateRequest(name: String, processName: String, information: Array[InputInformation], components: Array[Component])
final case class SuccessResponse(success: Boolean)

final case class SaveEvaluationRequest(id: String, result: SaveTemplateRequest, task: String)

final case class Foreign(queryTable: String, field: String, foreignKey: String)
final case class GetRecommendedQueriesResponse(foreign: Array[Foreign])