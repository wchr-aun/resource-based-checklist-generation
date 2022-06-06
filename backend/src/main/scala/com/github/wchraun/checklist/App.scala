package com.github.wchraun.checklist

import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.Behaviors
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Route
import akka.util.Timeout
import akka.http.scaladsl.server.Directives.concat

import scala.util.{Failure, Properties, Success}

//#main-class
object App {
  //#start-http-server
  private def startHttpServer(routes: Route)(implicit system: ActorSystem[_]): Unit = {
    // Akka HTTP still needs a classic ActorSystem to start
    import system.executionContext

    val futureBinding = Http().newServerAt("0.0.0.0", Properties.envOrElse("PORT", "8080").toInt).bind(routes)
    futureBinding.onComplete {
      case Success(binding) =>
        val address = binding.localAddress
        system.log.info("Server online at http://{}:{}/", address.getHostString, address.getPort)
      case Failure(ex) =>
        system.log.error("Failed to bind HTTP endpoint, terminating system", ex)
        system.terminate()
    }
  }
  //#start-http-server
  def main(args: Array[String]): Unit = {
    //#server-bootstrapping
    val rootBehavior = Behaviors.setup[Nothing] { context =>
      val checklistGenerationActor = context.spawn(ChecklistGeneration(), "ChecklistGenerationActor")
      context.watch(checklistGenerationActor)

      val timeout = Timeout.create(context.system.settings.config.getDuration("my-app.routes.ask-timeout"))

      val routes = concat(
        new DefaultRoutes().routes,
        new ChecklistRoutes(checklistGenerationActor)(context.system, timeout).checklistRoutes
      )
      startHttpServer(routes)(context.system)

      Behaviors.empty
    }
    val system = ActorSystem[Nothing](rootBehavior, "HelloAkkaHttpServer")
    //#server-bootstrapping
  }
}
//#main-class
