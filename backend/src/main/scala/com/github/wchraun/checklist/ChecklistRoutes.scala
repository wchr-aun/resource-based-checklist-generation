package com.github.wchraun.checklist

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Route

import scala.concurrent.Future
import akka.actor.typed.ActorRef
import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.AskPattern._
import akka.util.Timeout
import com.github.wchraun.checklist.ChecklistGeneration.GetUsers2

class ChecklistRoutes(userRegistry: ActorRef[ChecklistGeneration.Command])(implicit val system: ActorSystem[_], implicit val timeout: Timeout) {

  import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
  import JsonFormats._

  def getUsers2(): Future[Users] =
    userRegistry.ask(GetUsers2)

  val checklistRoutes: Route =
  pathPrefix("checklist") {
    concat(
      pathEnd {
        concat(
          get {
            complete(StatusCodes.OK, "Generate a draft checklist!")
          },
          post {
            complete(StatusCodes.Created, "Created a checklist!")
          }
        )
      },
      path(Segment) { checklistId =>
        get {
          rejectEmptyResponse {
            complete(StatusCodes.OK, s"Checklist ID #$checklistId")
          }
        }
      }
    )
  }
  //#all-routes
}
