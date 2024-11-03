const AuthController = require("../controller/auth.controller")
const { isAuthenticated } = require("../middleware")
const AuthRouter = require("express").Router()

AuthRouter.post("/register", AuthController.Register)
AuthRouter.post("/login", AuthController.Login)
AuthRouter.get("/token", isAuthenticated, AuthController.CheckToken)


module.exports = { AuthRouter }