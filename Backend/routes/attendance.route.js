const { isAuthenticated } = require("../middleware")

const AttendanceRouter = require("express").Router()
const AttendanceController = require("../controller/attendance.controller")

AttendanceRouter.get("/", isAuthenticated, AttendanceController.GetAttendanceByEmployeeId)
AttendanceRouter.post("/add", isAuthenticated, AttendanceController.AddAttendanceById)
AttendanceRouter.put("/edit", isAuthenticated, AttendanceController.EditAttendance)
AttendanceRouter.delete("/delete", isAuthenticated, AttendanceController.DeleteAttendanceById)

module.exports = { AttendanceRouter }