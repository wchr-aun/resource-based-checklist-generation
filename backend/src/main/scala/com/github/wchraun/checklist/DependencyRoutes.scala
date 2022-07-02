package com.github.wchraun.checklist

import akka.actor.typed.{ActorRef, ActorSystem}
import akka.actor.typed.scaladsl.AskPattern._
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.util.Timeout
import com.github.wchraun.checklist.Dependency.{GetDependencies, GetForeignTable}

import scala.concurrent.Future
import scala.util.{Failure, Success}

class DependencyRoutes(dependency: ActorRef[Dependency.Command])(implicit val system: ActorSystem[_], implicit val timeout: Timeout, implicit val database: Database) {

  import JsonFormats._
  import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._

  def getDependencies(process: Process): Future[GetDependencyResponse] = {
    dependency.ask(GetDependencies(process, _, database))
  }
  def getForeignTable(tableName: String, fieldName: String): Future[GetForeignTableResponse] = {
    dependency.ask(GetForeignTable(tableName, fieldName, _, database))
  }

  private val cors = new CORSHandler {}

  val dependencyRoutes: Route =
    path("dependency") {
      pathEnd {
        concat(
          get {
            cors.corsHandler(
              parameters('tableName.as[String], 'fieldName.as[String])  { (tableName, fieldName) =>
                onComplete(getForeignTable(tableName, fieldName)) { response =>
                  complete(StatusCodes.OK, response)
                }
              }
            )
          },
          post {
            cors.corsHandler(
              entity(as[Process]) {process =>
                onComplete(getDependencies(process)) {
                  case Success(value) => complete(StatusCodes.OK, value)
                  case Failure(exception) => complete(StatusCodes.ExpectationFailed, exception)
                }
              }
            )
          },
          options {
            cors.corsHandler(complete(StatusCodes.OK))
          }
        )
      }
    }
}
