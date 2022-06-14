package com.github.wchraun.checklist

//#user-registry-actor
import akka.actor.typed.ActorRef
import akka.actor.typed.Behavior
import akka.actor.typed.scaladsl.Behaviors

final case class Arg(argType: String, name: String)
final case class Process(name: String, inputs: String, output: String)

object Template {
  sealed trait Command
  final case class GetTemplate(id: String, replyTo: ActorRef[String]) extends Command
  final case class GetTemplates(replyTo: ActorRef[String]) extends Command
  final case class CreateTemplate(process: Process, replyTo: ActorRef[String]) extends Command
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
      case CreateTemplate(process, replyTo) =>
        replyTo ! generateDraft(process)
        Behaviors.same
      case SaveTemplate(id, replyTo) =>
        replyTo ! s"Saved Checklist ID #$id!"
        Behaviors.same
    }

  private def generateDraft(process: Process) =
    s"Created a template: ${process.name}!"
}
//#user-registry-actor
