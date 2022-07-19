package com.github.wchraun.checklist

import akka.actor.typed.ActorSystem
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Route

import scala.concurrent.{ExecutionContext, Future}

class DefaultRoutes() {
  private val cors = new CORSHandler {}

  val routes: Route = concat(
    path("") { complete(StatusCodes.OK, "Welcome to Resource-based Checklist Generation BACKEND") },
    path("ping") { cors.corsHandler(complete(StatusCodes.OK, "pong!")) }
  )
}
