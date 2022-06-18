package com.github.wchraun.checklist

//#user-registry-actor
import akka.actor.typed.ActorRef
import akka.actor.typed.Behavior
import akka.actor.typed.scaladsl.Behaviors

object Checklist {
  sealed trait Command
  final case class GetChecklist(id: String, replyTo: ActorRef[String]) extends Command
  final case class GetChecklists(replyTo: ActorRef[String]) extends Command
  final case class StartChecklist(arg: StartChecklistArg, replyTo: ActorRef[String]) extends Command
  final case class SubmitChecklist(id: String, replyTo: ActorRef[String]) extends Command

  def apply(): Behavior[Command] = generator()

  private def generator(): Behavior[Command] =
    Behaviors.receiveMessage {
      case GetChecklist(id, replyTo) =>
        replyTo ! s"Get Checklist ID #$id"
        Behaviors.same
      case GetChecklists(replyTo) =>
        replyTo ! "Get All Checklists!"
        Behaviors.same
      case StartChecklist(templateId, replyTo) =>
        replyTo ! s"Start a Checklist with Template ID #$templateId"
        Behaviors.same
      case SubmitChecklist(id, replyTo) =>
        replyTo ! s"Submit Checklist ID #$id"
        Behaviors.same
    }
}
