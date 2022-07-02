package com.github.wchraun.checklist

//#user-registry-actor
import akka.actor.typed.{ActorRef, Behavior}
import akka.actor.typed.scaladsl.Behaviors

object Dependency {
  sealed trait Command
  final case class GetDependencies(process: Process, replyTo: ActorRef[GetDependencyResponse], database: Database) extends Command
  final case class GetForeignTable(tableName: String, fieldName: String, replyTo: ActorRef[GetForeignTableResponse], database: Database) extends Command

  def apply(): Behavior[Command] = generator()

  private def generator(): Behavior[Command] =
    Behaviors.receiveMessage {
      case GetDependencies(process, replyTo, db) =>
        replyTo ! extractDependencies(process, db)
        Behaviors.same
      case GetForeignTable(tableName, fieldName, replyTo, db) =>
        replyTo ! foreignTable(tableName, fieldName, db)
        Behaviors.same
    }

  private def extractDependencies(process: Process, db: Database) = {
    def dfsDependencies(child: Arg): Array[DependencyDetails] = {
      Array(
        DependencyDetails(child.name, db.getDataModel(child.name).map(_._2))
      ) ++ child.args.get.flatMap(v => dfsDependencies(v))
    }
    GetDependencyResponse(
      process.inputs.flatMap(v => dfsDependencies(v)),
      dfsDependencies(process.output).filter(_.name != "")
    )
  }

  private def foreignTable(tableName: String, fieldName: String, db: Database) = {
    val (foreignTable, foreignKey) = db.getForeignTable(tableName, fieldName)
    GetForeignTableResponse(foreignTable, db.getTableFields(foreignTable), foreignKey)
  }
}
//#user-registry-actor
