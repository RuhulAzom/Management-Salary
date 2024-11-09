const { isAuthenticated } = require("../middleware")

const BranchRouter = require("express").Router()
const BranchController = require("../controller/branch.controller")

BranchRouter.get("/", isAuthenticated, BranchController.GetBranch)
BranchRouter.post("/add", isAuthenticated, BranchController.AddBranch)
BranchRouter.put("/edit", isAuthenticated, BranchController.EditBranch)
BranchRouter.delete("/delete", isAuthenticated, BranchController.DeleteBranch)


module.exports = { BranchRouter }