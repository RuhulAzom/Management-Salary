/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */

const { jwt, secretKeyJwt } = require("../utils");
require("dotenv").config()


const isAuthenticated = async (req, res, next) => {
    try {
        if (!req.headers) return res.status(401).json({
            message: "Unauthorized",
        });
        if (!req.headers.authorization) return res.status(401).json({
            message: "Unauthorized",
        });
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).json({
            message: "Unauthorized",
        });
        console.log("2", token)

        let userData = null;
        jwt.verify(token, secretKeyJwt, (error, decode) => {
            if (error) userData = null
            else userData = decode
        })

        if (userData) {
            req.user = userData;
            return next()
        }
        return res.status(401).json({
            message: "Unauthorized",
        });

    } catch (error) {
        console.log("Middleware Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
}

module.exports = { isAuthenticated }