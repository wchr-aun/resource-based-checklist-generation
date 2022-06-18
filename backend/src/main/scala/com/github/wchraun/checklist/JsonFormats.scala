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
  implicit val componentJsonFormat: RootJsonFormat[Component] = rootFormat(lazyFormat(jsonFormat14(Component)))

  implicit val createTemplateResponseJsonFormat = jsonFormat2(CreateTemplateResponse)
}
