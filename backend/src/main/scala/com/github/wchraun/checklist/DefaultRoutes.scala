package com.github.wchraun.checklist

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Route

class DefaultRoutes() {
  val routes: Route = concat(
    path("") { complete(StatusCodes.OK, "Welcome to Resource-based Checklist Generation BACKEND") },
    path("ping") { complete(StatusCodes.OK, "pong!") }
  )
}
