require("dotenv").config()
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const secretKeyJwt = process.env.JWT_TOKEN_KEY;

const firstSalary = 40000;
const secondSalary = 50000;
const normalSalary = 60000;
const overtimeSalary = 50000;
const memberSalary = 2000;

const getDateGroup = (dates) => {
    console.log("dates", dates)
    const datas = dates.map((item) => {
        return item.toISOString().split("T")[0]
    })

    const object = datas.reduce((acc, item) => {
        const key = item.split("-")[1];
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(item)
        return acc
    }, {})

    const sendData = Object.keys(object).map((item) => {
        const data = object[item]
        const createDate = new Date(data[0])
        const month = createDate.getMonth();
        const MonthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]
        const days = data.map((item) => {
            const createDate = new Date(item)
            return `${createDate.getDate()}`
        })
        const finalData = {
            value: days.join(","),
            month: MonthNames[month],
        }

        return Object.values(finalData).join("")


    })

    console.log({ object, sendData })
    return sendData.join(",")

}


module.exports = { bcrypt, jwt, prisma, secretKeyJwt, firstSalary, secondSalary, normalSalary, overtimeSalary, memberSalary, getDateGroup }