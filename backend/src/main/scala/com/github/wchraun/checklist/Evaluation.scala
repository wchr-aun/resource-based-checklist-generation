package com.github.wchraun.checklist

//#user-registry-actor
import akka.actor.typed.ActorRef
import akka.actor.typed.Behavior
import akka.actor.typed.scaladsl.Behaviors

object Evaluation {
  sealed trait Command
  final case class SaveEvaluation(id: String, result: SaveTemplateRequest, task: String, replyTo: ActorRef[SuccessResponse], db: Database) extends Command
  final case class BookEvaluationId(id: String, replyTo: ActorRef[SuccessResponse], db: Database) extends Command

  def apply(): Behavior[Command] = generator()

  private def generator(): Behavior[Command] =
    Behaviors.receiveMessage {
      case SaveEvaluation(id, result, task, replyTo, db) =>
        replyTo ! save(id, result, task, db)
        Behaviors.same
      case BookEvaluationId(id, replyTo, db) =>
        replyTo ! book(id, db)
        Behaviors.same
    }

  private def save(id: String, result: SaveTemplateRequest, task: String, db: Database) = {
    db.saveEvaluation(id, result, task)
    SuccessResponse(true)
  }

  private def book(id: String, db: Database) = {
    SuccessResponse(db.bookEvaluationId(id))
  }
}
//#user-registry-actor
