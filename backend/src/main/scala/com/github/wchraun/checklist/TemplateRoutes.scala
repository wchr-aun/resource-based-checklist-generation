package com.github.wchraun.checklist

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Route
import akka.actor.typed.ActorRef
import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.AskPattern._
import akka.util.Timeout

import scala.concurrent.Future
import com.github.wchraun.checklist.Template._

import scala.util.{Failure, Success}

class TemplateRoutes(template: ActorRef[Template.Command])(implicit val system: ActorSystem[_], implicit val timeout: Timeout, implicit val database: Database) {

  import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
  import JsonFormats._

  def getTemplate(id: String): Future[String] =
    template.ask(GetTemplate(id, _))
  def getTemplates(): Future[GetTemplatesResponse] =
    template.ask(GetTemplates(_, database))
  def createTemplate(process: Process): Future[CreateTemplateResponse] =
    template.ask(CreateTemplate(process, _, database))

  def saveTemplate(temp: CreateTemplateResponse): Future[SaveTemplateResponse] =
    template.ask(SaveTemplate(temp, _, database))

  private val cors = new CORSHandler {}

  val templateRoutes: Route =
    pathPrefix("template") {
      concat(
        pathEnd {
          concat(
            get {
              cors.corsHandler(
                onComplete(getTemplates()) {
                  case Success(value) => complete(StatusCodes.OK, value)
                  case Failure(exception) => complete(StatusCodes.ExpectationFailed, exception)
                }
              )
            },
            put {
              cors.corsHandler(
                entity(as[Process]) { process =>
                  onSuccess(createTemplate(process)) { response => {
                    complete(response)
                  }}
                }
              )
            },
            post {
              cors.corsHandler(
                entity(as[CreateTemplateResponse]) {temp =>
                  onSuccess(saveTemplate(temp)) { response =>
                    complete(StatusCodes.Accepted, response)
                  }
                }
              )
            },
            options {
              cors.corsHandler(complete(StatusCodes.OK))
            }
          )
        },
        path(Segment) { checklistId =>
          concat(
            get {
              cors.corsHandler(
                rejectEmptyResponse {
                  onSuccess(getTemplate(checklistId)) { response =>
                    complete(StatusCodes.OK, response)
                  }
                }
              )
            },
//            post {
//              cors.corsHandler(
//                entity(as[CreateTemplateResponse]) {temp =>
//                  onSuccess(saveTemplate(temp)) { response =>
//                    complete(StatusCodes.Accepted, response)
//                  }
//                }
//              )
//            },
            options {
              cors.corsHandler(complete(StatusCodes.OK))
            }
          )
        },
      )
    }
  //#all-routes
}
