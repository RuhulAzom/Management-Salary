require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const port = process.env.PORT

app.use(cors())
app.use(express.json())

const { AuthRouter } = require("./routes/auth.route")
const { EmployeeRouter } = require("./routes/employee.route")
const { AttendanceRouter } = require("./routes/attendance.route")

app.use("/auth", AuthRouter)
app.use("/employee", EmployeeRouter)
app.use("/attendance", AttendanceRouter)


app.listen(port, () => {
    console.log("Server berjalan di port " + port)
})