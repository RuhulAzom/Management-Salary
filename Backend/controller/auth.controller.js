

const { prisma, bcrypt, jwt, secretKeyJwt } = require("../utils")

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/

exports.Register = async (req, res) => {
    try {
        const { email, password, username } = req.body
        if (!email || !password || !username) return res.status(404).json({
            status: 404,
            message: "Data is not valid!"
        })

        const checkAccount = await prisma.user.findFirst({
            where: { email }
        })

        if (checkAccount) return res.status(400).json({
            status: 400,
            message: "Email is Already Used"
        })

        await prisma.user.create({
            data: {
                email, username,
                password: bcrypt.hashSync(password, 10),
            }
        })

        return res.status(200).json({
            status: 200,
            message: "Succesfully Created Account",
            data: {
                email, username
            }
        })

    } catch (error) {
        console.log("Error in Register : ", error)
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

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const findAccount = await prisma.user.findFirst({ where: { email } })
        if (!findAccount) return res.status(404).json({
            status: 404,
            message: "Email Not Found!"
        })
        const isPasswordCorrect = bcrypt.compareSync(password, findAccount.password)

        if (!isPasswordCorrect) return res.status(400).json({
            status: 400,
            message: "Your Password is Wrong!"
        })

        const dataUser = {
            username: findAccount.username,
            email: findAccount.email,
            role: findAccount.role
        }

        const token = jwt.sign(dataUser, secretKeyJwt, { expiresIn: "1d" })

        return res.status(200).json({
            status: 200,
            message: "Login Succesfully",
            token
        })
    } catch (error) {
        console.log("Error in Login : ", error)
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

exports.CheckToken = async (req, res) => {
    try {
        return res.status(200).json({
            status: 200,
            message: "Token is active",
            data: req.user
        })

    } catch (error) {
        console.log("Error in CheckToken : ", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
}
