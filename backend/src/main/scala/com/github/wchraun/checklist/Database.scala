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
                        hide: Boolean,
                        validation: String,
                        function: String,
                        parent: Int
                      ) = {
    val sql = "INSERT INTO components (template_id, input_dep, input_dep_field, output_dep, output_dep_field, \"order\", name, type, required, hide, validation, function, parent) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id;"
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
    preparedStatement.setBoolean(10, hide)
    preparedStatement.setString(11, validation)
    preparedStatement.setString(12, function)
    if (parent != -1) preparedStatement.setInt(13, parent)
    else preparedStatement.setNull(13, INTEGER)

    val rs = preparedStatement.executeQuery()
    rs.next
    rs.getInt("id")
  }

  def createInputInformation(name: String, order: Int, templateId: Int, inputDep: String) = {
    val sql = "INSERT INTO input_information_parent (name, \"order\", input_dep, template_id) VALUES(?, ?, ?, ?) RETURNING id;"
    val preparedStatement = connection.prepareStatement(sql)
    preparedStatement.setString(1, name)
    preparedStatement.setInt(2, order)
    preparedStatement.setString(3, inputDep)
    preparedStatement.setInt(4, templateId)
    val rs = preparedStatement.executeQuery()
    rs.next
    rs.getInt("id")
  }

  def createInputInformationChildren(children: Array[InputDetails], parentId: Int) = {
    val sql = "INSERT INTO input_information_child (name, \"order\", input_dep_field, hide, parent_id) VALUES" +
      "(?, ?, ?, ?, ?)," * (children.length - 1) + "(?, ?, ?, ?, ?)" +
      "RETURNING id;"
    val preparedStatement = connection.prepareStatement(sql)
    val noOfColumns = 5
    children.zipWithIndex.foreach{ case(child, i) => {
      preparedStatement.setString(1 + i * noOfColumns, child.name)
      preparedStatement.setInt(2 + i * noOfColumns, child.order)
      preparedStatement.setString(3 + i * noOfColumns, child.inputDependencyField)
      preparedStatement.setBoolean(4 + i * noOfColumns, child.hide)
      preparedStatement.setInt(5 + i * noOfColumns, parentId)
    }}
    val rs = preparedStatement.executeQuery()
    var ids = Array.empty[Int]
    while(rs.next) {
      ids = ids :+ rs.getInt("id")
    }
    ids
  }

  def createInputInformationQuery(values: Array[(InputDetails, Int)], inputDependency: String): Unit = {
    val sql = "INSERT INTO input_information_child_query (foreign_table, foreign_key, query_table, query_field, details_id) VALUES" +
      "(?, ?, ? ,?, ?)," * (values.length - 1) + "(?, ?, ?, ?, ?);"
    val preparedStatement = connection.prepareStatement(sql)
    val noOfColumns = 5
    values.zipWithIndex.foreach{ case((child, id), i) => {
      preparedStatement.setString(1 + i * noOfColumns, inputDependency)
      preparedStatement.setString(2 + i * noOfColumns, child.inputDependencyField)
      preparedStatement.setString(3 + i * noOfColumns, child.queryTable)
      preparedStatement.setString(4 + i * noOfColumns, child.queryField)
      preparedStatement.setInt(5 + i * noOfColumns, id)
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

  def getForeignTable(table: String, field: String) = {
    val sql = "SELECT kcu.table_name AS parent_table_name, kcu.column_name AS parent_column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema JOIN datamodel AS dm ON dm.table=kcu.table_name OR dm.table=ccu.table_name WHERE tc.constraint_type = 'FOREIGN KEY' AND (kcu.column_name=? OR ccu.column_name=?) AND dm.name=? GROUP BY(parent_table_name, parent_column_name, foreign_table_name, foreign_column_name);"
    val preparedStatement = connection.prepareStatement(sql)
    preparedStatement.setString(1, field)
    preparedStatement.setString(2, field)
    preparedStatement.setString(3, table)
    val rs = preparedStatement.executeQuery()
    var result = Array.empty[(String, String)]
    while (rs.next) {
      result =
        if (field != rs.getString("foreign_column_name"))
          result :+ (rs.getString("foreign_table_name"), rs.getString("foreign_column_name"))
        else
          result :+ (rs.getString("parent_table_name"), rs.getString("parent_column_name"))
    }
    result
  }

  def getTableFields(table: String) = {
    val sql = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema='public' AND is_updatable='YES' AND table_name=?;"
    val preparedStatement = connection.prepareStatement(sql)
    preparedStatement.setString(1, table)
    val rs = preparedStatement.executeQuery()
    var result = Array.empty[String]
    while (rs.next) {
      result = result :+ rs.getString("column_name")
    }
    result
  }

  def getInputInformation(id: Int) = {
    val sql = "SELECT p.name AS parent_name, p.\"order\" AS parent_order, p.input_dep AS input_dep, c.name AS child_name, c.\"order\" AS child_order, input_dep_field, hide, foreign_key, query_table, query_field  FROM input_information_parent AS p LEFT JOIN input_information_child AS c ON p.id=c.parent_id LEFT JOIN input_information_child_query AS q ON c.id=q.details_id WHERE template_id=?;"
    val preparedStatement = connection.prepareStatement(sql)
    preparedStatement.setInt(1, id)
    val rs = preparedStatement.executeQuery()
    var result = Array.empty[InputInformation]
    var children = Array.empty[(Int, InputDetails)]
    while(rs.next) {
      result = result :+ InputInformation(
        rs.getString("parent_name"),
        rs.getInt("parent_order"),
        Array.empty[InputDetails],
        rs.getString("input_dep")
      )
      result = result.distinctBy(_.order)
      children = children :+ (
        rs.getInt("parent_order"),
        InputDetails(
          rs.getString("child_name"),
          rs.getInt("child_order"),
          rs.getString("input_dep_field"),
          rs.getBoolean("hide"),
          Option(rs.getString("foreign_key")).nonEmpty,
          Option(rs.getString("foreign_key")).getOrElse(""),
          Option(rs.getString("query_table")).getOrElse(""),
          Option(rs.getString("query_field")).getOrElse("")
        )
      )
    }
    result.map(r => InputInformation(r.name, r.order, children.filter(_._1 == r.order).map(_._2).sortBy(_.order), r.inputDependency)).sortBy(_.order)
  }

  def getChecklistName(id: Int) = {
    val sql = "SELECT name FROM templates WHERE id=?"
    val preparedStatement = connection.prepareStatement(sql)
    preparedStatement.setInt(1, id)
    val rs = preparedStatement.executeQuery()
    var result = ""
    while (rs.next) {
      result = rs.getString("name")
    }
    result
  }

  def getComponents(id: Int) = {
    val sql = "SELECT * FROM components WHERE template_id=?;"
    val preparedStatement = connection.prepareStatement(sql)
    preparedStatement.setInt(1, id)
    val rs = preparedStatement.executeQuery()
    var result = Array.empty[(Int, Component, Int)]
    while (rs.next) {
      result = result :+ (
        rs.getInt("id"),
        Component(
          rs.getInt("order"),
          rs.getString("name"),
          "",
          ComponentType.withNameOpt(rs.getString("type")).getOrElse(ComponentType.HEADER),
          rs.getBoolean("required"),
          rs.getBoolean("hide"),
          rs.getString("validation"),
          rs.getString("function"),
          rs.getString("input_dep"),
          rs.getString("input_dep_field"),
          rs.getString("output_dep"),
          rs.getString("output_dep_field"),
          Array.empty[Component]
        ),
        rs.getInt("parent")
      )
    }
    result
  }

  def getRecommendedQueryFields(foreignTable: String, foreignKey: String) = {
    val sql = "SELECT foreign_key, query_table, query_field, COUNT(*) AS count FROM input_information_child_query WHERE foreign_table=? AND foreign_key=? GROUP BY(foreign_table, foreign_key, query_table, query_field) HAVING COUNT(*) > 0;"
    val preparedStatement = connection.prepareStatement(sql)
    preparedStatement.setString(1, foreignTable)
    preparedStatement.setString(2, foreignKey)
    val rs = preparedStatement.executeQuery()
    var result = Array.empty[(String, String, String, Int)]
    while (rs.next) {
      result = result :+ (
        rs.getString("query_table"),
        rs.getString("query_field"),
        rs.getString("foreign_key"),
        rs.getInt("count"))
    }
    result
  }

  def deleteTemplate(id: Int) = {
    val sql = "DELETE FROM templates WHERE id=?"
    val preparedStatement = connection.prepareStatement(sql)
    preparedStatement.setInt(1, id)
    preparedStatement.executeUpdate()
    ()
  }

  def getRecommendedDependencies(inputDep: String, inputDepField: String) = {
    val sql = "SELECT input_dep, input_dep_field, COUNT(*) FROM components WHERE output_dep=? AND output_dep_field=? AND input_dep != '' GROUP BY(input_dep, input_dep_field, output_dep, output_dep_field) HAVING COUNT(*) > 0 ORDER BY COUNT(*) LIMIT 1;"
    val preparedStatement = connection.prepareStatement(sql)
    preparedStatement.setString(1, inputDep)
    preparedStatement.setString(2, inputDepField)
    val rs = preparedStatement.executeQuery()
    var result = ("", "")
    while (rs.next) {
      result = (rs.getString("input_dep"), rs.getString("input_dep_field"))
    }
    result
  }
}
