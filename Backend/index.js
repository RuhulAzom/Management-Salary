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
const { BranchRouter } = require("./routes/branch.route")
const { isAuthenticated } = require("./middleware")
const { prisma } = require("./utils")

app.use("/auth", AuthRouter)
app.use("/employee", EmployeeRouter)
app.use("/attendance", AttendanceRouter)
app.use("/branch", BranchRouter)

app.get("/dashboard", isAuthenticated, async (req, res) => {
    try {
        const employee_per_branch = await prisma.branch.findMany({
            include: {
                Employee: {
                    include: {
                        Employee_Salary: true
                    }
                },
                _count: {
                    select: {
                        Employee: true
                    }
                }
            }
        });
        const employeeSalary = await prisma.employee_Salary.findMany({
            include: {
                Employee: true
            }
        })
        const data2 = employeeSalary.reduce((acc, item) => {
            const MonthNames = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "July", "Agustus", "September", "Oktober", "November", "Desember"
            ]
            const year = new Date(item.end_date).getFullYear()
            const month = MonthNames[new Date(item.end_date).getMonth()]
            const key = `${year}-${month}-${new Date(item.end_date).getMonth() + 1}`

            if (!acc[key]) {
                acc[key] = []
            }

            acc[key].push(item)

            console.log("key", key)
            return acc;
        }, {})
        const data3 = Object.keys(data2).map((item) => {
            let total_salary = 0;
            const data = data2[item];
            data.forEach((item) => {
                total_salary += item.total_salary
            })
            return {
                year: item.split("-")[0],
                month: item.split("-")[1],
                month_number: item.split("-")[2],
                total_salary
            }
        })
        const data4 = data3.reduce((acc, item) => {
            const key = item.year;
            if (!acc[key]) {
                acc[key] = []
            }
            acc[key].push({ ...item })
            return acc;
        }, {})
        const finalData = Object.keys(data4).map((item) => {
            const data = data4[item]
            return {
                year: parseInt(item),
                data: data.sort((a, b) => b.month_number - a.month_number)
            }
        })
        return res.status(200).json({
            status: 200,
            message: "Succesfully Get Dashboard Data",
            data: employee_per_branch,
            // data2: data2,
            // data3,
            // data4,
            // salary_data: finalData
        })
    } catch (error) {
        console.log("Error in GetDashboardData : ", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
})

app.get("/dashboard/salary", isAuthenticated, async (req, res) => {
    try {
        const branch_id = req.query.branch_id;
        let employeeSalary = []
        if (!branch_id) {
            employeeSalary = await prisma.employee_Salary.findMany()
        } else {
            employeeSalary = await prisma.employee_Salary.findMany({
                where: {
                    Employee: {
                        branch_id
                    }
                }
            })
        }

        const data2 = employeeSalary.reduce((acc, item) => {
            const MonthNames = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "July", "Agustus", "September", "Oktober", "November", "Desember"
            ]
            const year = new Date(item.end_date).getFullYear()
            const month = MonthNames[new Date(item.end_date).getMonth()]
            const key = `${year}-${month}-${new Date(item.end_date).getMonth() + 1}`

            if (!acc[key]) {
                acc[key] = []
            }

            acc[key].push(item)

            console.log("key", key)
            return acc;
        }, {})
        const data3 = Object.keys(data2).map((item) => {
            let total_salary = 0;
            const data = data2[item];
            data.forEach((item) => {
                total_salary += item.total_salary
            })
            return {
                year: item.split("-")[0],
                month: item.split("-")[1],
                month_number: item.split("-")[2],
                total_salary
            }
        })
        const data4 = data3.reduce((acc, item) => {
            const key = item.year;
            if (!acc[key]) {
                acc[key] = []
            }
            acc[key].push({ ...item })
            return acc;
        }, {})
        const finalData = Object.keys(data4).map((item) => {
            const data = data4[item]
            return {
                year: parseInt(item),
                data: data.sort((a, b) => b.month_number - a.month_number)
            }
        }).sort((a, b) => b.year - a.year)
        return res.status(200).json({
            status: 200,
            message: "Succesfully Get Salary Data",
            data: finalData
        })
    } catch (error) {
        console.log("Error in GetSalaryData : ", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
})


app.listen(port, () => {
    console.log("Server berjalan di port " + port)
})