package com.github.wchraun.checklist

//#user-registry-actor
import akka.actor.typed.ActorRef
import akka.actor.typed.Behavior
import akka.actor.typed.scaladsl.Behaviors

object Checklist {
  sealed trait Command
  final case class GetChecklist(id: Int, replyTo: ActorRef[SaveTemplateRequest], db: Database) extends Command
  final case class GetChecklists(replyTo: ActorRef[String]) extends Command
  final case class StartChecklist(arg: StartChecklistArg, replyTo: ActorRef[String]) extends Command
  final case class SubmitChecklist(id: String, replyTo: ActorRef[String]) extends Command

  def apply(): Behavior[Command] = generator()

  private def generator(): Behavior[Command] =
    Behaviors.receiveMessage {
      case GetChecklist(id, replyTo, db) =>
        replyTo ! getChecklist(id, db)
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

  private def getChecklist(id: Int, db: Database): SaveTemplateRequest = {
    val processName = db.getChecklistName(id)
    if (processName == "") return SaveTemplateRequest("", Array.empty[InputInformation], Array.empty[Component])
    val result = db.getComponents(id)
    def dfs(res: Array[(Int, Component, Int)], parent: Int = 0): Array[Component] = {
      res.filter(_._3 == parent).map(r => Component(
        r._2.order,
        r._2.name,
        r._2.value,
        r._2.componentType,
        r._2.required,
        r._2.hide,
        r._2.validation,
        r._2.function,
        r._2.inputDependency,
        r._2.inputDependencyField,
        r._2.outputDependency,
        r._2.outputDependencyField,
        dfs(res, r._1).sortBy(_.order)
      )).sortBy(_.order)
    }
    SaveTemplateRequest(processName, db.getInputInformation(id), dfs(result))
  }
}
