package com.github.wchraun.checklist

import com.github.wchraun.checklist.UserRegistry.ActionPerformed

//#json-formats
import spray.json.DefaultJsonProtocol

object JsonFormats  {
  // import the default encoders for primitive types (Int, String, Lists etc)
  import DefaultJsonProtocol._

  implicit val startChecklistArgJsonFormat = jsonFormat1(StartChecklistArg)

  implicit val argJsonFormat = jsonFormat2(Arg)
  implicit val processJsonFormat = jsonFormat3(Process)

  implicit val userJsonFormat = jsonFormat3(User)
  implicit val usersJsonFormat = jsonFormat1(Users)

  implicit val actionPerformedJsonFormat = jsonFormat1(ActionPerformed)
}
//#json-formats
