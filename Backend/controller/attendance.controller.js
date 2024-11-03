

const { prisma } = require("../utils");


/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.GetAttendanceByEmployeeId = async (req, res) => {
    try {
        const employee_id = req.query.employee_id
        const page = req.query.page || 1;
        const take = 10;
        const skip = (page * take) - 10;

        if (!employee_id) return res.status(404).json({
            status: 404,
            message: "Employee ID is Required"
        })

        let data = await prisma.attendance_Data.findMany({
            where: { employee_id },
            take,
            skip,
            orderBy: {
                date: "desc"
            }
        })

        const total_attendance = await prisma.attendance_Data.count({
            where: { employee_id }
        })

        const total_page = Math.ceil(total_attendance / take)

        return res.status(200).json({
            status: 200,
            message: "Succesfully Get Employee Attendance",
            data,
            current_page: page,
            total_page,
        })
    } catch (error) {
        console.log("Error in GetAttendanceById : ", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
}

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.AddAttendanceById = async (req, res) => {
    try {
        const { employee_id, type, date } = req.body;
        console.log({ employee_id, type, date })
        if (!employee_id || !type || !date) return res.status(404).json({
            status: 404,
            message: "Data is not valid!"
        })
        const data = await prisma.attendance_Data.create({
            data: {
                employee_id, type, date: new Date(date)
            },
        })

        return res.status(200).json({
            status: 200,
            message: "Succesfully Add Attendance",
            data
        })
    } catch (error) {
        console.log("Error in AddAttendance : ", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
}

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/

exports.EditAttendance = async (req, res) => {
    try {
        const { id, type, date } = req.body;
        console.log({ id, type, date })
        if (!id || !type || !date) return res.status(404).json({
            status: 404,
            message: "Data is not valid!"
        })
        const data = await prisma.attendance_Data.update({
            where: { id },
            data: {
                type, date: new Date(date)
            }
        })

        return res.status(200).json({
            status: 200,
            message: "Succesfully Edit Attendance",
            data
        })
    } catch (error) {
        console.log("Error in EditAttendance : ", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
}

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.DeleteAttendanceById = async (req, res) => {
    try {
        const { id } = req.query;
        console.log({ id })
        if (!id) return res.status(404).json({
            status: 404,
            message: "Data ID is Required!"
        })
        const checkData = await prisma.attendance_Data.findFirst({
            where: { id }
        })
        if (!checkData) return res.status(404).json({
            status: 404,
            message: "Data is Not Found!!"
        })
        const data = await prisma.attendance_Data.delete({
            where: { id },
        })

        return res.status(200).json({
            status: 200,
            message: "Succesfully Delete Attendance",
            data
        })
    } catch (error) {
        console.log("Error in DeleteAttendance : ", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
}
