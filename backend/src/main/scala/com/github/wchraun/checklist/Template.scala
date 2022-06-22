package com.github.wchraun.checklist

//#user-registry-actor
import akka.actor.typed.ActorRef
import akka.actor.typed.Behavior
import akka.actor.typed.scaladsl.Behaviors

object Template {
  sealed trait Command
  final case class GetTemplate(id: String, replyTo: ActorRef[String]) extends Command
  final case class GetTemplates(replyTo: ActorRef[String]) extends Command
  final case class CreateTemplate(process: Process, replyTo: ActorRef[CreateTemplateResponse], database: Database) extends Command
  final case class SaveTemplate(id: String, replyTo: ActorRef[String]) extends Command

  def apply(): Behavior[Command] = generator()

  private def generator(): Behavior[Command] =
    Behaviors.receiveMessage {
      case GetTemplate(id, replyTo) =>
        replyTo ! s"Get Template ID #$id"
        Behaviors.same
      case GetTemplates(replyTo) =>
        replyTo ! "Get All Templates"
        Behaviors.same
        Behaviors.same
      case CreateTemplate(process, replyTo, db) =>
        replyTo ! generateTemplate(process, db)
        Behaviors.same
      case SaveTemplate(id, replyTo) =>
        replyTo ! s"Saved Checklist ID #$id!"
        Behaviors.same
    }

  private def generateTemplate(process: Process, db: Database) = {
    val inputDetails = process.inputs.zipWithIndex.map{case(arg, i) => Details(arg.name, i, "", "", "",
      db.getDataModel(arg.name).zipWithIndex
        .map{case((table, field), i) => Details(field, i, "", table, field, Array.empty[Details])})}

    def dfsGetChildArg(child: Arg, index: Int = 0): Array[Component] = {
      if (child.argType != ArgType.VARR) {
        child.args.get.map(_.name).mkString("")
        Array[Component](
          Component(
            index,
            if (child.args.get.map(_.name).mkString("") != "")
              s"${child.argType.toString}(${child.args.get.map(arg => arg.name).mkString(", ")})"
            else s"Untitled Header - ${index + 1}",
            "",
            ComponentType.HEADER,
            false,
            false,
            "", "", "", "", "", "",
            child.args.get.zipWithIndex.flatMap{case(arg, i) => dfsGetChildArg(arg, i)}
          )
        )
      }
      else {
        Array[Component](
          Component(index, child.name, "", ComponentType.HEADER, false, false, "", "", "", "", "", "",
            db.getDataModel(child.name).zipWithIndex
              .map { case((table, field), i) =>
                Component(i, field, "", ComponentType.INPUT, true, true, "", "", "", "", table, field, Array.empty[Component])
              }
          )
        )
      }
    }

    CreateTemplateResponse(process.name, inputDetails, dfsGetChildArg(process.output))
  }
}
//#user-registry-actor
