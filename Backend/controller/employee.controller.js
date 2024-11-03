const { prisma, firstSalary, secondSalary, normalSalary, overtimeSalary, memberSalary } = require("../utils");

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.GetEmployee = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const take = 10;
        const skip = (page * take) - 10;
        const start_date = req.query.start_date
        const end_date = req.query.end_date
        // const start_date = "2024-06-01"
        // const end_date = "2024-11-01"
        console.log({ start_date, end_date })
        let data = []

        data = await prisma.employee.findMany({
            take,
            skip,
            include: {
                Attendance_Data: true
            }
        })


        if (data.length > 0) {
            data = getDetailEmployeeDataArray({ data, start_date, end_date })
        }

        const total_employee = await prisma.employee.count()

        const total_page = Math.ceil(total_employee / take)

        return res.status(200).json({
            status: 200,
            message: "Succesfully Get Employee",
            data,
            current_page: page,
            total_page,
        })
    } catch (error) {
        console.log("Error in GetEmployee : ", error)
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
exports.GetEmployeeById = async (req, res) => {
    try {
        const { id } = req.params

        const start_date = req.query.start_date
        const end_date = req.query.end_date
        // const start_date = "2024-06-01"
        // const end_date = "2024-11-01"
        console.log({ start_date, end_date })
        let data = []

        data = await prisma.employee.findFirst({
            where: { id },
            include: {
                Attendance_Data: {
                    orderBy: {
                        date: "asc"
                    }
                }
            }
        })
        if (!data) return res.status(404).json({
            status: 404,
            message: "Employe Not Found!!"
        })

        // let startDate;
        // let endDate;
        // let overtime;
        // let permit;

        // if (start_date && end_date) {
        //     startDate = new Date(start_date)
        //     endDate = new Date(end_date)
        //     data = await prisma.employee.findFirst({
        //         where: { id },
        //         include: {
        //             Attendance_Data: {
        //                 where: {
        //                     AND: [
        //                         { date: { gte: startDate } },
        //                         { date: { lte: endDate } }
        //                     ]
        //                 },
        //                 orderBy: {
        //                     date: "asc"
        //                 }
        //             }
        //         }
        //     })

        //     overtime = data.Attendance_Data
        //         .filter(item => {
        //             const attendanceDate = new Date(item.date)
        //             if (item.type === "OVERTIME" && attendanceDate >= startDate && attendanceDate <= endDate) return true
        //             return false
        //         }).length;

        //     permit = data.Attendance_Data
        //         .filter(item => {
        //             const attendanceDate = new Date(item.date)
        //             if (item.type === "PERMIT" && attendanceDate >= startDate && attendanceDate <= endDate) return true
        //             return false
        //         }).length;

        // } else {
        //     startDate = new Date(data.first_enter);
        //     endDate = new Date();

        //     overtime = data.Attendance_Data
        //         .filter(item => item.type === "OVERTIME").length;
        //     permit = data.Attendance_Data
        //         .filter(item => item.type === "PERMIT").length;
        // }

        // const firstEnter = new Date(data.first_enter)
        // const dueDate = firstEnter.getDate()
        // const first = start_date && end_date && startDate > firstEnter ? new Date(start_date) : firstEnter
        // first.setDate(dueDate)
        // const now = start_date && end_date ? new Date(end_date) : new Date()
        // if (new Date(end_date) > new Date) {
        //     now.setDate(new Date().getDate())
        // }

        // // Attendance
        // const differenceInMilliseconds = start_date && end_date && startDate > firstEnter ? endDate.getTime() - first.getTime() : endDate.getTime() - firstEnter.getTime();
        // const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
        // const attendance = differenceInDays - permit < 0 ? 0 : differenceInDays - permit


        // // Check Total Count Sejak Awal
        // let firstAndSecond = 0;
        // const check = 2;
        // const dateWhenSalaryNormal = new Date(firstEnter.toISOString().split("T")[0]);
        // while (firstAndSecond <= check) {
        //     if (dateWhenSalaryNormal.getDate() === dueDate) firstAndSecond++
        //     dateWhenSalaryNormal.setMonth(dateWhenSalaryNormal.getMonth() + 1)
        // }
        // const dateSalarySecond = new Date(dateWhenSalaryNormal.toISOString().split("T")[0])
        // dateSalarySecond.setMonth(dateSalarySecond.getMonth() - 1)
        // const dateSalaryFirst = new Date(dateWhenSalaryNormal.toISOString().split("T")[0])
        // dateSalaryFirst.setMonth(dateSalaryFirst.getMonth() - 2)


        // // Pay Day Count
        // let pay_day_data = [];
        // first.setMonth(first.getMonth() + 1)
        // let payDayIndex = 0
        // while (first <= now) {
        //     if (first.getDate() === dueDate) {
        //         const nextMonth = new Date(first.toISOString().split("T")[0]);
        //         nextMonth.setMonth(nextMonth.getMonth() + 1)

        //         // Total Days
        //         const differenceInMilliseconds = nextMonth.getTime() - first.getTime();
        //         const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

        //         // Permit In This Month
        //         const permitData = data.Attendance_Data
        //             .filter(item => {
        //                 const prevMonth = new Date(first.toISOString().split("T")[0]);
        //                 prevMonth.setMonth(prevMonth.getMonth() - 1)
        //                 const attendanceDate = new Date(item.date)
        //                 if (item.type === "PERMIT" && attendanceDate >= prevMonth && attendanceDate <= first) return true
        //                 return false
        //             }).map(item => item.date);

        //         // Overtime In This Month
        //         const overtimeData = data.Attendance_Data
        //             .filter(item => {
        //                 const prevMonth = new Date(first.toISOString().split("T")[0]);
        //                 prevMonth.setMonth(prevMonth.getMonth() - 1)
        //                 const attendanceDate = new Date(item.date)
        //                 if (item.type === "OVERTIME" && attendanceDate >= prevMonth && attendanceDate <= first) return true
        //                 return false
        //             }).map(item => item.date);;

        //         let salary = 0;
        //         if (start_date && end_date) {
        //             if (startDate < dateWhenSalaryNormal) {
        //                 if (first <= dateSalaryFirst) salary = firstSalary
        //                 else if (first <= dateSalarySecond) salary = secondSalary
        //                 else salary = normalSalary
        //             } else {
        //                 salary = normalSalary
        //             }
        //         } else {
        //             if (payDayIndex === 0) salary = firstSalary
        //             else if (payDayIndex === 1) salary = secondSalary
        //             else salary = normalSalary
        //         }
        //         console.log({ payDayIndex, salary })

        //         const MonthNames = [
        //             "January", "February", "March", "April", "May", "June",
        //             "July", "August", "September", "October", "November", "December"
        //         ]

        //         pay_day_data.push({
        //             date: `${first.getFullYear()}-${(first.getMonth() + 1).toString().padStart(2, "0")}-${first.getDate().toString().padStart(2, "0")}`,
        //             month: MonthNames[first.getMonth()],
        //             attendance: differenceInDays - permitData.length,
        //             permit: permitData.length,
        //             permit_data: permitData,
        //             overtime: overtimeData.length,
        //             overtime_data: overtimeData,
        //             salary

        //         })
        //     }

        //     first.setMonth(first.getMonth() + 1)
        //     payDayIndex++
        // }

        // // Salary
        // let total_salary = 0
        // let overtime_salary = overtimeSalary * overtime;
        // pay_day_data.forEach((item, index) => {
        //     total_salary += (item.attendance * item.salary)
        // })
        // const sendData = {
        //     ...data,
        //     id: data.id,
        //     name: data.name,
        //     first_enter: data.first_enter,
        //     member: data.member,
        //     createdAt: data.createdAt,
        //     updatedAt: data.updatedAt,
        //     attendance,
        //     overtime,
        //     overtime_salary,
        //     permit,
        //     pay_day_data,
        //     total_salary
        // }

        const sendData = await getDetailEmployeeDataObject({ object: data, start_date, end_date, id })

        return res.status(200).json({
            status: 200,
            message: "Succesfully Get Employee",
            data: sendData,
        })
    } catch (error) {
        console.log("Error in GetEmployee : ", error)
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
exports.AddEmployee = async (req, res) => {
    try {
        const { name, member, first_enter } = req.body;
        console.log({ name, member, first_enter })
        if (!name || !member || !first_enter) return res.status(404).json({
            status: 404,
            message: "Data is not valid!"
        })
        const data = await prisma.employee.create({
            data: {
                name, member, first_enter: new Date(first_enter)
            },
        })

        return res.status(200).json({
            status: 200,
            message: "Succesfully Add Employee",
            data
        })
    } catch (error) {
        console.log("Error in AddEmployee : ", error)
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
exports.EditEmployee = async (req, res) => {
    try {
        const { id, name, member, first_enter } = req.body;
        console.log({ name, member, first_enter })
        if (!id || !name || !member || !first_enter) return res.status(404).json({
            status: 404,
            message: "Data is not valid!"
        })
        const data = await prisma.employee.update({
            where: { id },
            data: {
                name, member, first_enter: new Date(first_enter)
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
exports.DeleteEmployee = async (req, res) => {
    try {
        const { id } = req.query;
        console.log({ id })
        if (!id) return res.status(404).json({
            status: 404,
            message: "Data ID is Required!"
        })
        const checkData = await prisma.employee.findFirst({
            where: { id }
        })
        if (!checkData) return res.status(404).json({
            status: 404,
            message: "Data is Not Found!!"
        })
        const data = await prisma.employee.delete({
            where: { id },
        })

        return res.status(200).json({
            status: 200,
            message: "Succesfully Delete Employee",
            data
        })
    } catch (error) {
        console.log("Error in DeleteEmployee : ", error)
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
exports.GetSearchEmployee = async (req, res) => {
    try {
        const page = req.query.page;
        const take = 10;
        const skip = (page - 1) * take;
        const name = req.query.name;
        const member = parseInt(req.query.member);
        const start_date = req.query.start_date
        const end_date = req.query.end_date

        if (page) {
            let data = [];
            let total_employee = 0;
            if (name) {
                data = await prisma.employee.findMany({
                    take: take,
                    skip,
                    where: {
                        name: { contains: name }
                    },
                    include: {
                        Attendance_Data: true
                    }
                })
                total_employee = await prisma.employee.count({
                    where: {
                        name: { contains: name }
                    }
                })
            }
            else if (member) {
                data = await prisma.employee.findMany({
                    take: take,
                    skip,
                    where: {
                        member: { equals: member }
                    },
                    include: {
                        Attendance_Data: true
                    }
                })
                total_employee = await prisma.employee.count({
                    where: {
                        member: { equals: member }
                    }
                })
            }
            if (data.length > 0) {
                const total_page = Math.ceil(total_employee / take)
                data = getDetailEmployeeDataArray({ data, start_date, end_date })

                return res.status(200).json({
                    status: 200,
                    message: "Succesfully Search Employee",
                    data,
                    current_page: page,
                    total_page
                })
            } else {
                return res.status(404).json({
                    status: 404,
                    message: "Employee Not Found",
                })
            }
        }
        let data = []
        if (nama) {
            data = await prisma.employee.findMany({
                where: {
                    name: { contains: name }
                }
            })
        }
        else if (telp) {
            data = await prisma.employee.findMany({
                where: {
                    member: { contains: member }
                }
            })
        }

        if (data.length > 0) {
            return res.status(200).json({
                status: 200,
                message: "Succesfully Search Employee",
                data
            })
        } else {
            return res.status(404).json({
                status: 404,
                message: "Employee Not Found",
            })
        }
    } catch (error) {
        console.log("Error In GetSearchEmployee:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
}

const getDetailEmployeeDataArray = ({ data, start_date, end_date }) => {
    const newData = data.map((employee) => {
        let startDate;
        let endDate;
        let overtime;
        let permit;

        if (start_date && end_date) {
            startDate = new Date(start_date)
            endDate = new Date(end_date)

            overtime = employee.Attendance_Data
                .filter(item => {
                    const attendanceDate = new Date(item.date)
                    if (item.type === "OVERTIME" && attendanceDate >= startDate && attendanceDate <= endDate) return true
                    return false
                }).length;

            permit = employee.Attendance_Data
                .filter(item => {
                    const attendanceDate = new Date(item.date)
                    if (item.type === "PERMIT" && attendanceDate >= startDate && attendanceDate <= endDate) return true
                    return false
                }).length;

        } else {
            startDate = new Date(employee.first_enter);
            endDate = new Date();

            overtime = employee.Attendance_Data
                .filter(item => item.type === "OVERTIME").length;
            permit = employee.Attendance_Data
                .filter(item => item.type === "PERMIT").length;
        }

        const firstEnter = new Date(employee.first_enter)
        const dueDate = firstEnter.getDate()
        const first = start_date && end_date && startDate > firstEnter ? new Date(start_date) : firstEnter
        first.setDate(dueDate)
        const now = start_date && end_date ? new Date(end_date) : new Date()

        // Attendance
        const differenceInMilliseconds = start_date && end_date && startDate > firstEnter ? endDate.getTime() - first.getTime() : endDate.getTime() - firstEnter.getTime();
        const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
        const attendance = differenceInDays - permit < 0 ? 0 : differenceInDays - permit


        // Check Total Count Sejak Awal
        let firstAndSecond = 0;
        const check = 2;
        const dateWhenSalaryNormal = new Date(firstEnter.toISOString().split("T")[0]);
        while (firstAndSecond <= check) {
            if (dateWhenSalaryNormal.getDate() === dueDate) firstAndSecond++
            dateWhenSalaryNormal.setMonth(dateWhenSalaryNormal.getMonth() + 1)
        }
        const dateSalarySecond = new Date(dateWhenSalaryNormal.toISOString().split("T")[0])
        dateSalarySecond.setMonth(dateSalarySecond.getMonth() - 1)
        const dateSalaryFirst = new Date(dateWhenSalaryNormal.toISOString().split("T")[0])
        dateSalaryFirst.setMonth(dateSalaryFirst.getMonth() - 2)


        // Pay Day Count
        let pay_day_data = [];
        first.setMonth(first.getMonth() + 1)
        let payDayIndex = 0
        while (first <= now) {
            if (first.getDate() === dueDate) {
                const nextMonth = new Date(first.toISOString().split("T")[0]);
                nextMonth.setMonth(nextMonth.getMonth() + 1)

                // Total Hari
                const differenceInMilliseconds = nextMonth.getTime() - first.getTime();
                const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

                // Permit bulan ini
                const permitData = employee.Attendance_Data
                    .filter(item => {
                        const attendanceDate = new Date(item.date)
                        if (item.type === "PERMIT" && attendanceDate >= first && attendanceDate <= nextMonth) return true
                        return false
                    }).length;

                // Overtime bulan ini
                const overtimeData = employee.Attendance_Data
                    .filter(item => {
                        const attendanceDate = new Date(item.date)
                        if (item.type === "OVERTIME" && attendanceDate >= first && attendanceDate <= nextMonth) return true
                        return false
                    }).length;

                let salary = 0;
                if (start_date && end_date) {
                    if (startDate < dateWhenSalaryNormal) {
                        if (first <= dateSalaryFirst) salary = firstSalary
                        else if (first <= dateSalarySecond) salary = secondSalary
                        else salary = normalSalary
                    } else {
                        salary = normalSalary
                    }
                } else {
                    if (payDayIndex === 0) salary = firstSalary
                    else if (payDayIndex === 1) salary = secondSalary
                    else salary = normalSalary
                }
                console.log({ payDayIndex, salary })

                pay_day_data.push({
                    year: first.getFullYear(),
                    month: first.getMonth() + 1,
                    attendance: differenceInDays - permitData,
                    permit: permitData,
                    overtime: overtimeData,
                    salary

                })
            }

            first.setMonth(first.getMonth() + 1)
            payDayIndex++
        }

        // Salary
        let total_salary = 0
        let overtime_salary = overtimeSalary * overtime;
        pay_day_data.forEach((item, index) => {
            total_salary += (item.attendance * item.salary)
        })
        return {
            ...employee,
            id: employee.id,
            name: employee.name,
            first_enter: employee.first_enter,
            member: employee.member,
            createdAt: employee.createdAt,
            updatedAt: employee.updatedAt,
            attendance,
            overtime,
            permit,
            pay_day_data,
            total_salary: total_salary + overtime_salary + (employee.member * memberSalary)
        }
    })
    return newData
}

const getDetailEmployeeDataObject = async ({ object, start_date, end_date, id }) => {
    let data = object
    let startDate;
    let endDate;
    let overtime;
    let permit;

    if (start_date && end_date) {
        startDate = new Date(start_date)
        endDate = new Date(end_date)
        data = await prisma.employee.findFirst({
            where: { id },
            include: {
                Attendance_Data: {
                    where: {
                        AND: [
                            { date: { gte: startDate } },
                            { date: { lte: endDate } }
                        ]
                    },
                    orderBy: {
                        date: "asc"
                    }
                }
            }
        })

        overtime = data.Attendance_Data
            .filter(item => {
                const attendanceDate = new Date(item.date)
                if (item.type === "OVERTIME" && attendanceDate >= startDate && attendanceDate <= endDate) return true
                return false
            }).length;

        permit = data.Attendance_Data
            .filter(item => {
                const attendanceDate = new Date(item.date)
                if (item.type === "PERMIT" && attendanceDate >= startDate && attendanceDate <= endDate) return true
                return false
            }).length;

    } else {
        startDate = new Date(data.first_enter);
        endDate = new Date();

        overtime = data.Attendance_Data
            .filter(item => item.type === "OVERTIME").length;
        permit = data.Attendance_Data
            .filter(item => item.type === "PERMIT").length;
    }

    const firstEnter = new Date(data.first_enter)
    const dueDate = firstEnter.getDate()
    const first = start_date && end_date && startDate > firstEnter ? new Date(start_date) : firstEnter
    first.setDate(dueDate)
    const now = start_date && end_date ? new Date(end_date) : new Date()
    if (new Date(end_date) > new Date) {
        now.setDate(new Date().getDate())
    }

    // Attendance
    const differenceInMilliseconds = start_date && end_date && startDate > firstEnter ? endDate.getTime() - first.getTime() : endDate.getTime() - firstEnter.getTime();
    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    const attendance = differenceInDays - permit < 0 ? 0 : differenceInDays - permit


    // Check Total Count Sejak Awal
    let firstAndSecond = 0;
    const check = 2;
    const dateWhenSalaryNormal = new Date(firstEnter.toISOString().split("T")[0]);
    while (firstAndSecond <= check) {
        if (dateWhenSalaryNormal.getDate() === dueDate) firstAndSecond++
        dateWhenSalaryNormal.setMonth(dateWhenSalaryNormal.getMonth() + 1)
    }
    const dateSalarySecond = new Date(dateWhenSalaryNormal.toISOString().split("T")[0])
    dateSalarySecond.setMonth(dateSalarySecond.getMonth() - 1)
    const dateSalaryFirst = new Date(dateWhenSalaryNormal.toISOString().split("T")[0])
    dateSalaryFirst.setMonth(dateSalaryFirst.getMonth() - 2)


    // Pay Day Count
    let pay_day_data = [];
    first.setMonth(first.getMonth() + 1)
    let payDayIndex = 0
    while (first <= now) {
        if (first.getDate() === dueDate) {
            const nextMonth = new Date(first.toISOString().split("T")[0]);
            nextMonth.setMonth(nextMonth.getMonth() + 1)

            // Total Hari
            const differenceInMilliseconds = nextMonth.getTime() - first.getTime();
            const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

            // Permit bulan ini
            const permitData = data.Attendance_Data
                .filter(item => {
                    const prevMonth = new Date(first.toISOString().split("T")[0]);
                    prevMonth.setMonth(prevMonth.getMonth() - 1)
                    const attendanceDate = new Date(item.date)
                    if (item.type === "PERMIT" && attendanceDate >= prevMonth && attendanceDate <= first) return true
                    return false
                }).map(item => item.date);

            // Overtime bulan ini
            const overtimeData = data.Attendance_Data
                .filter(item => {
                    const prevMonth = new Date(first.toISOString().split("T")[0]);
                    prevMonth.setMonth(prevMonth.getMonth() - 1)
                    const attendanceDate = new Date(item.date)
                    if (item.type === "OVERTIME" && attendanceDate >= prevMonth && attendanceDate <= first) return true
                    return false
                }).map(item => item.date);;

            let salary = 0;
            if (start_date && end_date) {
                if (startDate < dateWhenSalaryNormal) {
                    if (first <= dateSalaryFirst) salary = firstSalary
                    else if (first <= dateSalarySecond) salary = secondSalary
                    else salary = normalSalary
                } else {
                    salary = normalSalary
                }
            } else {
                if (payDayIndex === 0) salary = firstSalary
                else if (payDayIndex === 1) salary = secondSalary
                else salary = normalSalary
            }
            console.log({ payDayIndex, salary })

            const MonthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ]

            pay_day_data.push({
                date: `${first.getFullYear()}-${(first.getMonth() + 1).toString().padStart(2, "0")}-${first.getDate().toString().padStart(2, "0")}`,
                month: MonthNames[first.getMonth()],
                attendance: differenceInDays - permitData.length,
                permit: permitData.length,
                permit_data: permitData,
                overtime: overtimeData.length,
                overtime_data: overtimeData,
                salary

            })
        }

        first.setMonth(first.getMonth() + 1)
        payDayIndex++
    }

    // Salary
    let total_salary = 0
    let overtime_salary = overtimeSalary * overtime;
    pay_day_data.forEach((item, index) => {
        total_salary += (item.attendance * item.salary)
    })
    const sendData = {
        ...data,
        id: data.id,
        name: data.name,
        first_enter: data.first_enter,
        member: data.member,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        attendance,
        overtime,
        overtime_salary,
        permit,
        pay_day_data,
        total_salary
    }
    return sendData
}



// Backup GetEmploye
// data = data.map((employee) => {
//     let startDate;
//     let endDate;
//     let overtime;
//     let permit;

//     if (start_date && end_date) {
//         startDate = new Date(start_date)
//         endDate = new Date(end_date)

//         overtime = employee.Attendance_Data
//             .filter(item => {
//                 const attendanceDate = new Date(item.date)
//                 if (item.type === "OVERTIME" && attendanceDate >= startDate && attendanceDate <= endDate) return true
//                 return false
//             }).length;

//         permit = employee.Attendance_Data
//             .filter(item => {
//                 const attendanceDate = new Date(item.date)
//                 if (item.type === "PERMIT" && attendanceDate >= startDate && attendanceDate <= endDate) return true
//                 return false
//             }).length;

//     } else {
//         startDate = new Date(employee.first_enter);
//         endDate = new Date();

//         overtime = employee.Attendance_Data
//             .filter(item => item.type === "OVERTIME").length;
//         permit = employee.Attendance_Data
//             .filter(item => item.type === "PERMIT").length;
//     }

//     const firstEnter = new Date(employee.first_enter)
//     const dueDate = firstEnter.getDate()
//     const first = start_date && end_date && startDate > firstEnter ? new Date(start_date) : firstEnter
//     first.setDate(dueDate)
//     const now = start_date && end_date ? new Date(end_date) : new Date()

//     // Attendance
//     const differenceInMilliseconds = start_date && end_date && startDate > firstEnter ? endDate.getTime() - first.getTime() : endDate.getTime() - firstEnter.getTime();
//     const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
//     const attendance = differenceInDays - permit < 0 ? 0 : differenceInDays - permit


//     // Check Total Count Sejak Awal
//     let firstAndSecond = 0;
//     const check = 2;
//     const dateWhenSalaryNormal = new Date(firstEnter.toISOString().split("T")[0]);
//     while (firstAndSecond <= check) {
//         if (dateWhenSalaryNormal.getDate() === dueDate) firstAndSecond++
//         dateWhenSalaryNormal.setMonth(dateWhenSalaryNormal.getMonth() + 1)
//     }
//     const dateSalarySecond = new Date(dateWhenSalaryNormal.toISOString().split("T")[0])
//     dateSalarySecond.setMonth(dateSalarySecond.getMonth() - 1)
//     const dateSalaryFirst = new Date(dateWhenSalaryNormal.toISOString().split("T")[0])
//     dateSalaryFirst.setMonth(dateSalaryFirst.getMonth() - 2)


//     // Pay Day Count
//     let pay_day_data = [];
//     first.setMonth(first.getMonth() + 1)
//     let payDayIndex = 0
//     while (first <= now) {
//         if (first.getDate() === dueDate) {
//             const nextMonth = new Date(first.toISOString().split("T")[0]);
//             nextMonth.setMonth(nextMonth.getMonth() + 1)

//             // Total Days
//             const differenceInMilliseconds = nextMonth.getTime() - first.getTime();
//             const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

//             // Permit In This Month
//             const permitData = employee.Attendance_Data
//                 .filter(item => {
//                     const attendanceDate = new Date(item.date)
//                     if (item.type === "PERMIT" && attendanceDate >= first && attendanceDate <= nextMonth) return true
//                     return false
//                 }).length;

//             // Overtime In This Month
//             const overtimeData = employee.Attendance_Data
//                 .filter(item => {
//                     const attendanceDate = new Date(item.date)
//                     if (item.type === "OVERTIME" && attendanceDate >= first && attendanceDate <= nextMonth) return true
//                     return false
//                 }).length;

//             let salary = 0;
//             if (start_date && end_date) {
//                 if (startDate < dateWhenSalaryNormal) {
//                     if (first <= dateSalaryFirst) salary = firstSalary
//                     else if (first <= dateSalarySecond) salary = secondSalary
//                     else salary = normalSalary
//                 } else {
//                     salary = normalSalary
//                 }
//             } else {
//                 if (payDayIndex === 0) salary = firstSalary
//                 else if (payDayIndex === 1) salary = secondSalary
//                 else salary = normalSalary
//             }
//             console.log({ payDayIndex, salary })

//             pay_day_data.push({
//                 year: first.getFullYear(),
//                 month: first.getMonth() + 1,
//                 attendance: differenceInDays - permitData,
//                 permit: permitData,
//                 overtime: overtimeData,
//                 salary

//             })
//         }

//         first.setMonth(first.getMonth() + 1)
//         payDayIndex++
//     }

//     // Salary
//     let total_salary = 0
//     let overtime_salary = overtimeSalary * overtime;
//     pay_day_data.forEach((item, index) => {
//         total_salary += (item.attendance * item.salary)
//     })
//     return {
//         ...employee,
//         id: employee.id,
//         name: employee.name,
//         first_enter: employee.first_enter,
//         member: employee.member,
//         createdAt: employee.createdAt,
//         updatedAt: employee.updatedAt,
//         attendance,
//         overtime,
//         permit,
//         pay_day_data,
//         total_salary: total_salary + overtime_salary + (employee.member * memberSalary)
//     }
// })