package com.github.wchraun.checklist

import akka.actor.typed.{ActorRef, Behavior}
import akka.actor.typed.scaladsl.Behaviors

import java.sql.{Connection, DriverManager}
import scala.util.Properties

class Database {
  val url = Properties.envOrElse("DB_URL", "jdbc:postgresql://localhost:5432/db")
  val driver = "org.postgresql.Driver"
  val username = Properties.envOrElse("DB_USERNAME", "username")
  val password = Properties.envOrElse("DB_PASSWORD", "password")
  var connection: Connection = _
  try {
    Class.forName(driver)
    connection = DriverManager.getConnection(url, username, password)
  } catch {
    case e: Exception => e.printStackTrace
  }

  def getDataModel(modelName: String) = {
    val sql = "SELECT \"table\", field from datamodel WHERE name = ?"
    val preparedStatement = connection.prepareStatement(sql)
    preparedStatement.setString(1, modelName)
    val rs = preparedStatement.executeQuery()
    var result = Array.empty[(String, String)]
    while (rs.next) {
      result = result :+ Tuple2(rs.getString("table"), rs.getString("field"))
    }
    result
  }
}
