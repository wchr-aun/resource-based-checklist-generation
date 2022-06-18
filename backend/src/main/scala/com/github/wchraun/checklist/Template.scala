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
    val inputComponents = process.inputs.zipWithIndex
      .map{case(arg, i) => Component(i, arg.name, "", ComponentType.HEADER, false, false, "", "", "", "", "", "", "",
        db.executeQuery(s"SELECT * from datamodel WHERE name = '${arg.name}'").zipWithIndex
          .map{case(field, i) => Component(i, field, "", ComponentType.INPUT, false, false, "", "", "", "", "", "", "", Array.empty[Component])})}

    val outputComponents = Component(process.inputs.length, process.output.name, "", ComponentType.HEADER, false, false, "", "", "", "", "", "", "",
      db.executeQuery(s"SELECT * from datamodel WHERE name = '${process.output.name}'").zipWithIndex
        .map{case(field, i) => Component(i, field, "", ComponentType.INPUT, true, true, "", "", "", "", "", "", "", Array.empty[Component])})

    CreateTemplateResponse(process.name, inputComponents :+ outputComponents)
  }
}
//#user-registry-actor
