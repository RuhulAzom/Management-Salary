const { prisma, firstSalary, secondSalary, normalSalary, overtimeSalary, memberSalary, getDateGroup } = require("../utils");

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.GetBranch = async (req, res) => {
    try {

        // const start_date = "2024-06-01"
        // const end_date = "2024-11-01"

        const data = await prisma.branch.findMany()

        return res.status(200).json({
            status: 200,
            message: "Succesfully Get Branch",
            data,
        })
    } catch (error) {
        console.log("Error in GetBranch : ", error)
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
exports.AddBranch = async (req, res) => {
    try {
        const { branch } = req.body;
        console.log({ branch })
        if (!branch) return res.status(404).json({
            status: 404,
            message: "Data is not valid!"
        })
        const data = await prisma.branch.create({
            data: {
                branch
            },
        })

        return res.status(200).json({
            status: 200,
            message: "Succesfully Add Branch",
            data
        })
    } catch (error) {
        console.log("Error in AddBranch : ", error)
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
exports.EditBranch = async (req, res) => {
    try {
        const { id, branch } = req.body;
        if (!id || !branch) return res.status(404).json({
            status: 404,
            message: "Data is not valid!"
        })
        const data = await prisma.branch.update({
            where: { id },
            data: {
                branch
            }
        })

        return res.status(200).json({
            status: 200,
            message: "Succesfully Edit Employee",
            data
        })
    } catch (error) {
        console.log("Error in EditEmployee : ", error)
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
exports.DeleteBranch = async (req, res) => {
    try {
        const { id } = req.query;
        console.log({ id })
        if (!id) return res.status(404).json({
            status: 404,
            message: "Data ID is Required!"
        })
        const checkData = await prisma.branch.findFirst({
            where: { id }
        })
        if (!checkData) return res.status(404).json({
            status: 404,
            message: "Data is Not Found!!"
        })
        const data = await prisma.branch.delete({
            where: { id },
        })

        return res.status(200).json({
            status: 200,
            message: "Succesfully Delete Branch",
            data
        })
    } catch (error) {
        console.log("Error in DeleteBranch : ", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
}