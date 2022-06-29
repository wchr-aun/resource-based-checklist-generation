package com.github.wchraun.checklist

//#user-registry-actor
import akka.actor.typed.ActorRef
import akka.actor.typed.Behavior
import akka.actor.typed.scaladsl.Behaviors

object Template {
  sealed trait Command
  final case class GetTemplate(id: String, replyTo: ActorRef[String]) extends Command
  final case class GetTemplates(replyTo: ActorRef[GetTemplatesResponse], database: Database) extends Command
  final case class CreateTemplate(process: Process, replyTo: ActorRef[CreateTemplateResponse], database: Database) extends Command
  final case class SaveTemplate(template: CreateTemplateResponse, replyTo: ActorRef[SaveTemplateResponse], database: Database) extends Command

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
    def dfsInputs(child: Arg): Array[Information] = {
      Array(
        Information(child.name, 0, db.getDataModel(child.name).zipWithIndex
          .map{case((_, field), i) => Details(field, i, "", child.name, field, false)})
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
              .map{case((_, field), i) =>
                Component(i, field, "", ComponentType.INPUT, true, true, "", "", "", "", child.name, field, Array.empty[Component])
              }
          )
        )
      }
    }

    CreateTemplateResponse(
      process.name,
      process.inputs.flatMap(v => dfsInputs(v))
        .groupBy(_.name).zipWithIndex
        .map{case(v, i) =>
          Information(v._2.head.name, i, v._2.head.details)
        }.toArray
        .sortBy(_.order),
      dfsOutput(process.output)
    )
  }

  private def saveTemplate(process: CreateTemplateResponse, db: Database) = {
    val templateId = db.createTemplate(process.processName)

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
        component.validation,
        component.function,
        parentId
      )
      component.children.foreach(c => dfsSQL(c, componentId))
    }

    process.information.foreach(info => {
      val infoId = db.createInputInformation(info.name, info.order, templateId)
      db.createInputInformationChildren(info.details, infoId)
    })

    process.components.foreach(component => dfsSQL(component, -1))

    SaveTemplateResponse(templateId)
  }

  private def getTemplates(db: Database) = {
    GetTemplatesResponse(db.queryAllTemplates())
  }
}
//#user-registry-actor
