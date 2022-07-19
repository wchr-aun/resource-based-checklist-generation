package com.github.wchraun.checklist

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Route
import akka.actor.typed.ActorRef
import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.AskPattern._
import akka.util.Timeout
import com.github.wchraun.checklist.Evaluation.{BookEvaluationId, SaveEvaluation}

import scala.concurrent.Future
import scala.util.{Failure, Success}

class EvaluationRoutes(evaluation: ActorRef[Evaluation.Command])(implicit val system: ActorSystem[_], implicit val timeout: Timeout, implicit val database: Database) {

  import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
  import JsonFormats._

  def saveEvaluation(id: String, result: SaveTemplateRequest, task: String): Future[SuccessResponse] =
    evaluation.ask(SaveEvaluation(id, result, task, _, database))
  def bookEvaluationId(id: String): Future[SuccessResponse] =
    evaluation.ask(BookEvaluationId(id, _, database))

  private val cors = new CORSHandler {}

  val evaluationRoutes: Route =
    pathPrefix("evaluation") {
      concat(
        pathEnd {
          concat(
            post {
              cors.corsHandler(
                entity(as[SaveEvaluationRequest]) {temp =>
                  onSuccess(saveEvaluation(temp.id, temp.result, temp.task)) { response =>
                    complete(StatusCodes.OK, response)
                  }
                }
              )
            },
            post {
              cors.corsHandler(
                entity(as[SaveEvaluationRequest]) {temp =>
                  onSuccess(saveEvaluation(temp.id, temp.result, temp.task)) { response =>
                    complete(StatusCodes.OK, response)
                  }
                }
              )
            },
            options {
              cors.corsHandler(complete(StatusCodes.OK))
            }
          )
        },
        path(Segment) { evalId =>
          concat(
            post {
              cors.corsHandler(
                onSuccess(bookEvaluationId(evalId)) { response =>
                  complete(StatusCodes.OK, response)
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
