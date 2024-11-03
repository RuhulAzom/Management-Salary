const { isAuthenticated } = require("../middleware")

const EmployeeRouter = require("express").Router()
const EmployeeController = require("../controller/employee.controller")

EmployeeRouter.get("/", isAuthenticated, EmployeeController.GetEmployee)
EmployeeRouter.get("/detail/:id", isAuthenticated, EmployeeController.GetEmployeeById)
EmployeeRouter.get("/search", isAuthenticated, EmployeeController.GetSearchEmployee)
EmployeeRouter.post("/add", isAuthenticated, EmployeeController.AddEmployee)
EmployeeRouter.put("/edit", isAuthenticated, EmployeeController.EditEmployee)
EmployeeRouter.delete("/delete", isAuthenticated, EmployeeController.DeleteEmployee)

module.exports = { EmployeeRouter }