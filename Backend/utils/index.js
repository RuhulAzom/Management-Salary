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


module.exports = { bcrypt, jwt, prisma, secretKeyJwt, firstSalary, secondSalary, normalSalary, overtimeSalary, memberSalary }