package com.github.wchraun.checklist

//#user-registry-actor
import akka.actor.typed.{ActorRef, Behavior}
import akka.actor.typed.scaladsl.Behaviors

object Dependency {
  sealed trait Command
  final case class GetDependencies(process: Process, replyTo: ActorRef[GetDependencyResponse], database: Database) extends Command
  final case class GetForeignTable(tableName: String, fieldName: String, replyTo: ActorRef[GetForeignTableResponse], database: Database) extends Command
  final case class GetRecommendedQueries(tableName: String, fieldName: String, replyTo: ActorRef[GetRecommendedQueriesResponse], database: Database) extends Command

  def apply(): Behavior[Command] = generator()

  private def generator(): Behavior[Command] =
    Behaviors.receiveMessage {
      case GetDependencies(process, replyTo, db) =>
        replyTo ! extractDependencies(process, db)
        Behaviors.same
      case GetForeignTable(tableName, fieldName, replyTo, db) =>
        replyTo ! foreignTable(tableName, fieldName, db)
        Behaviors.same
      case GetRecommendedQueries(tableName, fieldName, replyTo, db) =>
        replyTo ! getRecommendedQueries(tableName, fieldName, db)
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
    val foreign = db.getForeignTable(tableName, fieldName)
    GetForeignTableResponse(foreign.map(f => ForeignQueries(f._1, db.getTableFields(f._1), f._2)))
  }

  private def getRecommendedQueries(tableName: String, fieldName: String, db: Database) = {
    val foreign = db.getRecommendedQueryFields(tableName, fieldName)
    val average = foreign.foldLeft((0.0, 1)) ((acc, i) => ((acc._1 + (i._4 - acc._1) / acc._2), acc._2 + 1))._1
    GetRecommendedQueriesResponse(foreign.filter(_._4 >= average).map(v => Foreign(v._1, v._2, v._3)))
  }
}
//#user-registry-actor
