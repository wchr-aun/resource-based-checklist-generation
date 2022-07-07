package com.github.wchraun.checklist

//#user-registry-actor
import akka.actor.typed.ActorRef
import akka.actor.typed.Behavior
import akka.actor.typed.scaladsl.Behaviors

import scala.collection.immutable.HashMap

object Template {
  sealed trait Command
  final case class GetTemplate(id: String, replyTo: ActorRef[String]) extends Command
  final case class GetTemplates(replyTo: ActorRef[GetTemplatesResponse], database: Database) extends Command
  final case class CreateTemplate(process: Process, replyTo: ActorRef[CreateTemplateResponse], database: Database) extends Command
  final case class SaveTemplate(template: SaveTemplateRequest, replyTo: ActorRef[SaveTemplateResponse], database: Database) extends Command

  def apply(): Behavior[Command] = generator()

  private def generator(): Behavior[Command] =
    Behaviors.receiveMessage {
      case GetTemplate(id, replyTo) =>
        replyTo ! s"Get Template ID #$id"
        Behaviors.same
      case GetTemplates(replyTo, db) =>
        replyTo ! getTemplates(db)
        Behaviors.same
        Behaviors.same
      case CreateTemplate(process, replyTo, db) =>
        replyTo ! generateTemplate(process, db)
        Behaviors.same
      case SaveTemplate(template, replyTo, db) =>
        replyTo ! saveTemplate(template, db)
        Behaviors.same
    }

  private def generateTemplate(process: Process, db: Database) = {
    val autolink = process.autolink.getOrElse(false)
    var tableFieldToModel = new HashMap[String, String]()
    val recommendations = db.getRecommendedDependencies(process.name)
    def dfsInputs(child: Arg): Array[Information] = {
      Array(
        Information(child.name, 0, db.getDataModel(child.name).zipWithIndex
          .map{
            case((table, field), i) => {
              tableFieldToModel = tableFieldToModel + (s"${table}_$field" -> child.name)
              Details(field, i, child.name, field, false)
            }
          }, child.name)
      ) ++ child.args.get.flatMap(v => dfsInputs(v))
    }

    def dfsOutput(child: Arg, index: Int = 0): Array[Component] = {
      if (child.argType != ArgType.VARR) {
        Array[Component](
          Component(
            index,
            if (child.args.get.map(_.name).mkString("") != "")
              s"${child.argType.toString}(${child.args.get.map(arg => arg.name).mkString(", ")})"
            else s"Untitled Header - ${index + 1}",
            "",
            if (child.argType == ArgType.PLUS) ComponentType.TAB else ComponentType.HEADER,
            false,
            false,
            "", "", "", "", "", "",
            child.args.get.zipWithIndex.flatMap{case(arg, i) => dfsOutput(arg, i)}
          )
        )
      }
      else {
        Array[Component](
          Component(index, s"${index + 1} - ${child.name}", "", ComponentType.HEADER, false, false, "", "", "", "", "", "",
            db.getDataModel(child.name).zipWithIndex
              .map{case((table, field), i) => {
                var inputDep = ""
                var inputDepField = ""
                if (autolink) {
                  inputDep = recommendations.find(_._4 == field).getOrElse(
                    (tableFieldToModel.getOrElse(s"${table}_$field", ""), "", "", "")
                  )._1
                  inputDepField = recommendations.find(_._4 == field).getOrElse(
                    ("", if (tableFieldToModel.contains(s"${table}_$field")) field else "", "", "")
                  )._2
                }
                Component(
                  i,
                  field,
                  "",
                  ComponentType.INPUT,
                  true,
                  autolink && !inputDepField.isEmpty,
                  "",
                  "",
                  inputDep,
                  inputDepField,
                  child.name,
                  field,
                  Array.empty[Component])
              }}
          )
        )
      }
    }

    CreateTemplateResponse(
      process.name,
      process.inputs.flatMap(v => dfsInputs(v))
        .groupBy(_.name).zipWithIndex
        .map{case(v, i) =>
          Information(v._2.head.name, i, v._2.head.details, v._2.head.inputDependency)
        }.toArray
        .sortBy(_.order),
      dfsOutput(process.output)
    )
  }

  private def saveTemplate(process: SaveTemplateRequest, db: Database) = {
    val templateId = db.createTemplate(process.name, process.processName)

    def dfsSQL(component: Component, parentId: Int): Unit = {
      val componentId = db.createComponents(
        templateId,
        component.inputDependency,
        component.inputDependencyField,
        component.outputDependency,
        component.outputDependencyField,
        component.order,
        component.name,
        component.componentType,
        component.required,
        component.hide,
        component.validation,
        component.function,
        parentId
      )
      component.children.foreach(c => dfsSQL(c, componentId))
    }

    process.information.foreach(info => {
      val infoId = db.createInputInformation(info.name, info.order, templateId, info.inputDependency)
      val childIds = db.createInputInformationChildren(info.details, infoId)
      val tuples = info.details.zip(childIds).filter(_._1.isQuery)
      if (tuples.length > 0) db.createInputInformationQuery(tuples, info.inputDependency)
    })

    process.components.foreach(component => dfsSQL(component, -1))

    SaveTemplateResponse(templateId)
  }

  private def getTemplates(db: Database) = {
    GetTemplatesResponse(db.queryAllTemplates())
  }
}
//#user-registry-actor
