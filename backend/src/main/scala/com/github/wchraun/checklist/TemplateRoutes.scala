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

class TemplateRoutes(template: ActorRef[Template.Command])(implicit val system: ActorSystem[_], implicit val timeout: Timeout, implicit val database: Database) {

  import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
  import JsonFormats._

  def getTemplate(id: String): Future[String] =
    template.ask(GetTemplate(id, _))
  def getTemplates(): Future[String] =
    template.ask(GetTemplates)
  def createTemplate(process: Process): Future[CreateTemplateResponse] =
    template.ask(CreateTemplate(process, _, database))

  def saveTemplate(id: String): Future[String] =
    template.ask(SaveTemplate(id, _))

  private val cors = new CORSHandler {}

  val templateRoutes: Route =
    pathPrefix("template") {
      concat(
        pathEnd {
          concat(
            get {
              cors.corsHandler(
                onSuccess(getTemplates()) { response =>
                  complete(StatusCodes.OK, response)
                }
              )
            },
            post {
              cors.corsHandler(
                entity(as[Process]) { process =>
                  onSuccess(createTemplate(process)) { response => {
                    complete(response)
                  }}
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
            post {
              cors.corsHandler(
                rejectEmptyResponse {
                  onSuccess(saveTemplate(checklistId)) { response =>
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
      )
    }
  //#all-routes
}
