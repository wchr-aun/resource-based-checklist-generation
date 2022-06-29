package com.github.wchraun.checklist

import akka.actor.typed.{ActorRef, Behavior}
import akka.actor.typed.scaladsl.Behaviors
import com.github.wchraun.checklist.ComponentType.ComponentType

import java.sql.{Connection, DriverManager}
import java.sql.Types.INTEGER
import java.text.SimpleDateFormat
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

  def createTemplate(name: String) = {
    val sql = "INSERT INTO templates (name, created, updated) VALUES(?, NOW(), NOW()) RETURNING id;"
    val preparedStatement = connection.prepareStatement(sql)
    preparedStatement.setString(1, name)
    val rs = preparedStatement.executeQuery()
    rs.next
    rs.getInt("id")
  }

  def createComponents(
                        templateId: Int,
                        inputDep: String,
                        inputDepField: String,
                        outputDep: String,
                        outputDepField: String,
                        order: Int,
                        name: String,
                        comType: ComponentType,
                        required: Boolean,
                        validation: String,
                        function: String,
                        parent: Int
                      ) = {
    val sql = "INSERT INTO components (template_id, input_dep, input_dep_field, output_dep, output_dep_field, \"order\", name, type, required, validation, function, parent) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id;"
    val preparedStatement = connection.prepareStatement(sql)
    preparedStatement.setInt(1, templateId)
    preparedStatement.setString(2, inputDep)
    preparedStatement.setString(3, inputDepField)
    preparedStatement.setString(4, outputDep)
    preparedStatement.setString(5, outputDepField)
    preparedStatement.setInt(6, order)
    preparedStatement.setString(7, name)
    preparedStatement.setString(8, comType.toString)
    preparedStatement.setBoolean(9, required)
    preparedStatement.setString(10, validation)
    preparedStatement.setString(11, function)
    if (parent != -1) preparedStatement.setInt(12, parent)
    else preparedStatement.setNull(12, INTEGER)

    val rs = preparedStatement.executeQuery()
    rs.next
    rs.getInt("id")
  }

  def createInputInformation(name: String, order: Int, templateId: Int) = {
    val sql = "INSERT INTO input_information_parent (name, \"order\", template_id) VALUES(?, ?, ?) RETURNING id;"
    val preparedStatement = connection.prepareStatement(sql)
    preparedStatement.setString(1, name)
    preparedStatement.setInt(2, order)
    preparedStatement.setInt(3, templateId)
    val rs = preparedStatement.executeQuery()
    rs.next
    rs.getInt("id")
  }

  def createInputInformationChildren(children: Array[Details], parentId: Int) = {
    val sql = "INSERT INTO input_information_child (name, \"order\", input_dep, input_dep_field, hide, parent_id) VALUES(?, ?, ?, ?, ?, ?);" * children.length
    val preparedStatement = connection.prepareStatement(sql)
    children.zipWithIndex.foreach{ case(child, i) => {
      preparedStatement.setString(1 + i * 6, child.name)
      preparedStatement.setInt(2 + i * 6, child.order)
      preparedStatement.setString(3 + i * 6, child.inputDependency)
      preparedStatement.setString(4 + i * 6, child.inputDependencyField)
      preparedStatement.setBoolean(5 + i * 6, child.hide)
      preparedStatement.setInt(6 + i * 6, parentId)
    }}
    preparedStatement.executeUpdate
    ()
  }

  def queryAllTemplates() = {
    val sql = "SELECT * FROM templates ORDER BY updated DESC LIMIT 50;"
    val statement = connection.createStatement()
    val rs = statement.executeQuery(sql)
    var result = Array.empty[TemplateResponse]
    while (rs.next) {
      result = result :+ TemplateResponse(rs.getInt("id"),
        rs.getString("name"),
        new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").format(rs.getTimestamp("created")),
        new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").format(rs.getTimestamp("updated"))
      )
    }
    result
  }
}
