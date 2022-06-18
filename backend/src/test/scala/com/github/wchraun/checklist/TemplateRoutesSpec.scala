package com.github.wchraun.checklist

import akka.actor.testkit.typed.scaladsl.ActorTestKit
import akka.http.scaladsl.marshalling.Marshal
import akka.http.scaladsl.model._
import akka.http.scaladsl.testkit.ScalatestRouteTest
import akka.util.Timeout
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.matchers.should.Matchers
import org.scalatest.wordspec.AnyWordSpec

class TemplateRoutesSpec extends AnyWordSpec with Matchers with ScalaFutures with ScalatestRouteTest {
  lazy val testKit = ActorTestKit()
  implicit def typedSystem = testKit.system
  override def createActorSystem(): akka.actor.ActorSystem =
    testKit.system.classicSystem

  val template = testKit.spawn(Template())
  val timeout = Timeout.create(typedSystem.settings.config.getDuration("my-app.routes.ask-timeout"))
  lazy val routes = new TemplateRoutes(template)(typedSystem, timeout).templateRoutes

  import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
  import Models._

  //#actual-test
  "TemplateRoutes" should {
    "return no templates if no present (GET /template)" in {
      val request = HttpRequest(uri = "/template")

      request ~> routes ~> check {
        status should === (StatusCodes.OK)
        contentType should === (ContentTypes.`application/json`)
        entityAs[String] should === ("""{"templates":[]}""")
      }
    }

//    "be able to add users (POST /users)" in {
//      val user = User("Kapi", 42, "jp")
//      val userEntity = Marshal(user).to[MessageEntity].futureValue // futureValue is from ScalaFutures
//
//      // using the RequestBuilding DSL:
//      val request = Post("/users").withEntity(userEntity)
//
//      request ~> routes ~> check {
//        status should ===(StatusCodes.Created)
//
//        // we expect the response to be json:
//        contentType should ===(ContentTypes.`application/json`)
//
//        // and we know what message we're expecting back:
//        entityAs[String] should ===("""{"description":"User Kapi created."}""")
//      }
//    }
//    //#testing-post
//
//    "be able to remove users (DELETE /users)" in {
//      // user the RequestBuilding DSL provided by ScalatestRouteSpec:
//      val request = Delete(uri = "/users/Kapi")
//
//      request ~> routes ~> check {
//        status should ===(StatusCodes.OK)
//
//        // we expect the response to be json:
//        contentType should ===(ContentTypes.`application/json`)
//
//        // and no entries should be in the list:
//        entityAs[String] should ===("""{"description":"User Kapi deleted."}""")
//      }
//    }
  }
}
