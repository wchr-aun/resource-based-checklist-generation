package com.github.wchraun.checklist

import akka.actor.typed.{ActorRef, Behavior}
import akka.actor.typed.scaladsl.Behaviors

import java.sql.{Connection, DriverManager}
import scala.util.Properties

class Database {
  val url = Properties.envOrElse("DB_URL", "jdbc:postgresql://localhost:5432/db")
  val driver = "org.postgresql.Driver"
  val username = Properties.envOrElse("DB_USERNAME", "username")
  val password = Properties.envOrElse("DB_PASSWORD", "username")
  var connection: Connection = _
  try {
    Class.forName(driver)
    connection = DriverManager.getConnection(url, username, password)
  } catch {
    case e: Exception => e.printStackTrace
  }

  def executeQuery(query: String) = {
    val statement = connection.createStatement
    val rs = statement.executeQuery(query)
    var result = Array.empty[String]
    while (rs.next) {
      result = result :+ rs.getString("field")
    }
    result
  }
}
