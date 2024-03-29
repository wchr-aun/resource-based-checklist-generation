package com.github.wchraun.checklist

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Route
import akka.actor.typed.ActorRef
import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.AskPattern._
import akka.util.Timeout

import scala.concurrent.Future
import com.github.wchraun.checklist.Checklist._

class ChecklistRoutes(checklist: ActorRef[Checklist.Command])(implicit val system: ActorSystem[_], implicit val timeout: Timeout, implicit val database: Database) {

  import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
  import JsonFormats._

  def getChecklist(id: Int): Future[SaveTemplateRequest] =
    checklist.ask(GetChecklist(id, _, database))
  def getChecklists(): Future[String] =
    checklist.ask(GetChecklists(_))
  def startChecklist(arg: StartChecklistArg): Future[String] =
    checklist.ask(StartChecklist(arg, _))
  def submitChecklist(id: String): Future[String] =
    checklist.ask(SubmitChecklist(id, _))
  def deleteTemplate(id: Int): Future[SuccessResponse] =
    checklist.ask(DeleteTemplate(id, _, database))

  private val cors = new CORSHandler {}

  val checklistRoutes: Route =
  pathPrefix("checklist") {
    concat(
      pathEnd {
        concat(
          get {
            onSuccess(getChecklists()) { response =>
              complete(StatusCodes.OK, response)
            }
          },
          post {
            entity(as[StartChecklistArg]) { arg =>
              onSuccess(startChecklist(arg)) { response =>
                complete(StatusCodes.Created, response)
              }
            }
          }
        )
      },
      path(Segment) { checklistId =>
        concat(
          get {
            cors.corsHandler {
              rejectEmptyResponse {
                onSuccess(getChecklist(checklistId.toInt)) { response =>
                  complete(StatusCodes.OK, response)
                }
              }
            }
          },
          delete {
            cors.corsHandler(
              rejectEmptyResponse {
                onSuccess(deleteTemplate(checklistId.toInt)) { response =>
                  complete(StatusCodes.OK, response)
                }
              }
            )
          },
          post {
            rejectEmptyResponse {
              onSuccess(submitChecklist(checklistId)) { response =>
                complete(StatusCodes.Accepted, response)
              }
            }
          },
          options {
            cors.corsHandler(complete(StatusCodes.OK))
          }
        )
      }
    )
  }
  //#all-routes
}
