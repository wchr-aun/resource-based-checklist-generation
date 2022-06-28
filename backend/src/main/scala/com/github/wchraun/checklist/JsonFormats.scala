package com.github.wchraun.checklist

import spray.json.{DefaultJsonProtocol, DeserializationException, JsString, JsValue, RootJsonFormat}

object JsonFormats  {
  import DefaultJsonProtocol._

  class EnumJsonFormat[T <: scala.Enumeration](enu: T) extends RootJsonFormat[T#Value] {
    override def write(obj: T#Value): JsValue = JsString(obj.toString)
    override def read(json: JsValue): T#Value = {
      json match {
        case JsString(txt) => enu.withName(txt)
        case somethingElse => throw DeserializationException(s"Expected a value from enum $enu instead of $somethingElse")
      }
    }
  }

  implicit val argTypeEnumJsonFormat = new EnumJsonFormat(ArgType)
  implicit val componentTypeEnumJsonFormat = new EnumJsonFormat(ComponentType)
  implicit val startChecklistArgJsonFormat = jsonFormat1(StartChecklistArg)

  implicit val argJsonFormat: RootJsonFormat[Arg] = rootFormat(lazyFormat(jsonFormat3(Arg)))
  implicit val processJsonFormat = jsonFormat3(Process)
  implicit val detailsJsonFormat = jsonFormat6(Details)
  implicit val informationJsonFormat = jsonFormat3(Information)
  implicit val componentJsonFormat: RootJsonFormat[Component] = rootFormat(lazyFormat(jsonFormat13(Component)))
  implicit val dependencyDetailsJsonFormat = jsonFormat2(DependencyDetails)

  implicit val createTemplateResponseJsonFormat = jsonFormat3(CreateTemplateResponse)
  implicit val getDependencyResponseJsonFormat = jsonFormat2(GetDependencyResponse)
}
