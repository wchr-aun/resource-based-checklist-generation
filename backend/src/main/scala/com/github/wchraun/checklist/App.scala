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
      val checklistActor = context.spawn(Checklist(), "ChecklistActor")
      val templateActor = context.spawn(Template(), "TemplateActor")
      val dependencyActor = context.spawn(Dependency(), "DependencyActor")
      val evaluationActor = context.spawn(Evaluation(), "EvaluationActor")
      context.watch(checklistActor)
      context.watch(templateActor)
      context.watch(dependencyActor)
      context.watch(evaluationActor)

      val timeout = Timeout.create(context.system.settings.config.getDuration("my-app.routes.ask-timeout"))

      val database = new Database()

      val routes = concat(
        new DefaultRoutes().routes,
        new ChecklistRoutes(checklistActor)(context.system, timeout, database).checklistRoutes,
        new TemplateRoutes(templateActor)(context.system, timeout, database).templateRoutes,
        new DependencyRoutes(dependencyActor)(context.system, timeout, database).dependencyRoutes,
        new EvaluationRoutes(evaluationActor)(context.system, timeout, database).evaluationRoutes
      )
      startHttpServer(routes)(context.system)

      Behaviors.empty
    }
    val system = ActorSystem[Nothing](rootBehavior, "ChecklistGenerationToolHttpServer")
    //#server-bootstrapping
  }
}
//#main-class
