const {
  prisma,
  firstSalary,
  secondSalary,
  normalSalary,
  overtimeSalary,
  memberSalary,
  getDateGroup,
} = require("../utils");

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.GetEmployee = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const take = 10;
    const skip = page * take - 10;
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;
    // const start_date = "2024-06-01"
    // const end_date = "2024-11-01"
    console.log({ start_date, end_date });
    let data = [];

    data = await prisma.employee.findMany({
      take,
      skip,
      include: {
        Attendance_Data: true,
        Branch: true,
      },
    });

    if (data.length > 0) {
      data = getDetailEmployeeDataArray({ data, start_date, end_date });
    }

    const total_employee = await prisma.employee.count();

    const total_page = Math.ceil(total_employee / take);

    return res.status(200).json({
      status: 200,
      message: "Succesfully Get Employee",
      data,
      current_page: page,
      total_page,
    });
  } catch (error) {
    console.log("Error in GetEmployee : ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.GetEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const start_date = req.query.start_date;
    const end_date = req.query.end_date;
    // const start_date = "2024-06-01"
    // const end_date = "2024-11-01"
    console.log({ start_date, end_date });
    let data = [];

    data = await prisma.employee.findFirst({
      where: { id },
      include: {
        Attendance_Data: {
          orderBy: {
            date: "asc",
          },
        },
      },
    });
    if (!data)
      return res.status(404).json({
        status: 404,
        message: "Employe Not Found!!",
      });

    const sendData = await getDetailEmployeeDataObject({
      object: data,
      start_date,
      end_date,
      id,
    });

    return res.status(200).json({
      status: 200,
      message: "Succesfully Get Employee",
      data: sendData,
    });
  } catch (error) {
    console.log("Error in GetEmployee : ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.AddEmployee = async (req, res) => {
  try {
    const { name, first_enter, branch_id } = req.body;
    console.log({ name, first_enter });
    if (!name || !first_enter || !branch_id)
      return res.status(404).json({
        status: 404,
        message: "Data is not valid!",
      });
    const data = await prisma.employee.create({
      data: {
        name,
        first_enter: new Date(first_enter),
        branch_id,
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Succesfully Add Employee",
      data,
    });
  } catch (error) {
    console.log("Error in AddEmployee : ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.EditEmployee = async (req, res) => {
  try {
    const { id, name, first_enter, branch_id } = req.body;
    console.log({ name, first_enter, branch_id });
    if (!id || !name || !first_enter || !branch_id)
      return res.status(404).json({
        status: 404,
        message: "Data is not valid!",
      });
    const data = await prisma.employee.update({
      where: { id },
      data: {
        name,
        first_enter: new Date(first_enter),
        branch_id,
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Succesfully Edit Employee",
      data,
    });
  } catch (error) {
    console.log("Error in EditEmployee : ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.DeleteEmployee = async (req, res) => {
  try {
    const { id } = req.query;
    console.log({ id });
    if (!id)
      return res.status(404).json({
        status: 404,
        message: "Data ID is Required!",
      });
    const checkData = await prisma.employee.findFirst({
      where: { id },
    });
    if (!checkData)
      return res.status(404).json({
        status: 404,
        message: "Data is Not Found!!",
      });
    const data = await prisma.employee.delete({
      where: { id },
    });

    return res.status(200).json({
      status: 200,
      message: "Succesfully Delete Employee",
      data,
    });
  } catch (error) {
    console.log("Error in DeleteEmployee : ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

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
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;

    if (page) {
      let data = [];
      let total_employee = 0;
      if (name) {
        data = await prisma.employee.findMany({
          take: take,
          skip,
          where: {
            name: { contains: name },
          },
          include: {
            Attendance_Data: true,
            Branch: true,
          },
        });
        total_employee = await prisma.employee.count({
          where: {
            name: { contains: name },
          },
        });
      } else if (member) {
        data = await prisma.employee.findMany({
          take: take,
          skip,
          where: {
            member: { equals: member },
          },
          include: {
            Attendance_Data: true,
            Branch: true,
          },
        });
        total_employee = await prisma.employee.count({
          where: {
            member: { equals: member },
          },
        });
      }
      if (data.length > 0) {
        const total_page = Math.ceil(total_employee / take);
        data = getDetailEmployeeDataArray({ data, start_date, end_date });

        return res.status(200).json({
          status: 200,
          message: "Succesfully Search Employee",
          data,
          current_page: page,
          total_page,
        });
      } else {
        return res.status(404).json({
          status: 404,
          message: "Employee Not Found",
        });
      }
    }
    let data = [];
    if (nama) {
      data = await prisma.employee.findMany({
        where: {
          name: { contains: name },
        },
      });
    } else if (telp) {
      data = await prisma.employee.findMany({
        where: {
          member: { contains: member },
        },
      });
    }

    if (data.length > 0) {
      return res.status(200).json({
        status: 200,
        message: "Succesfully Search Employee",
        data,
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "Employee Not Found",
      });
    }
  } catch (error) {
    console.log("Error In GetSearchEmployee:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.AddEmployeeSalary = async (req, res) => {
  try {
    const { employee_id, start_date, end_date, member, salary_per_day } =
      req.body;

    if (!employee_id || !start_date || !end_date || !member || !salary_per_day)
      return res.status(404).json({
        status: 404,
        message: "Data is Not Valid!",
      });

    const data = await getDetailEmployeeDataObject2({
      start_date,
      end_date,
      employee_id,
      salary_per_day,
    });

    await prisma.employee_Salary.create({
      data: {
        employee_id,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        member,
        attendance: data.attendance,
        permit: data.permit,
        permit_data: data.permit_data,
        overtime: data.overtime,
        overtime_data: data.overtime_data,
        overtime_salary: salary_per_day,
        total_salary: data.total_salary + member * memberSalary,
        salary_per_day,
      },
    });

    return res.status(200).json({
      status: 200,
      message: "Succesfully Add Employee Salary",
      data: {
        employee_id,
        start_date,
        end_date,
        member,
        attendance: data.attendance,
        permit: data.permit,
        permit_data: data.permit_data,
        overtime: data.overtime,
        overtime_data: data.overtime_data,
        overtime_salary: data.overtime_salary,
        total_salary: data.total_salary + member * memberSalary,
        salary_per_day,
      },
    });
  } catch (error) {
    console.log("Error in AddEmployeeSalary : ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.EditEmployeeSalaryById = async (req, res) => {
  try {
    // const { employee_id, start_date, end_date, member, attendance, permit, permit_data, overtime, overtime_data, overtime_salary, total_salary } = req.body;
    // console.log({ employee_id, start_date, end_date, member, attendance, permit, permit_data, overtime, overtime_data, overtime_salary, total_salary })
    // if (!employee_id || !start_date || !end_date || !member || !attendance || !permit || !permit_data || !overtime || !overtime_data || !overtime_salary || !total_salary) return res.status(404).json({
    //     status: 404,
    //     message: "Data is not valid!"
    // })
    const { id, employee_id, start_date, end_date, member, salary_per_day } =
      req.body;

    if (
      !id ||
      !employee_id ||
      !start_date ||
      !end_date ||
      !member ||
      !salary_per_day
    )
      return res.status(404).json({
        status: 404,
        message: "Data is Not Valid!",
      });

    const data = await getDetailEmployeeDataObject2({
      start_date,
      end_date,
      employee_id,
      salary_per_day,
    });

    await prisma.employee_Salary.update({
      where: { id },
      data: {
        employee_id,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        member,
        attendance: data.attendance,
        permit: data.permit,
        permit_data: data.permit_data,
        overtime: data.overtime,
        overtime_data: data.overtime_data,
        overtime_salary: data.overtime_salary,
        total_salary: data.total_salary + member * memberSalary,
        salary_per_day,
      },
    });

    // console.log({
    //   echeck: data,
    //   attendance: salary_per_day * data.attendance,
    //   overtime: salary_per_day * data.overtime,
    //   member: member * memberSalary,
    //   total:
    //     salary_per_day * data.attendance +
    //     salary_per_day * data.overtime +
    //     member * memberSalary,
    //   // total: data.total_salary + member * memberSalary,
    //   // salary_per_day,
    // });
    return res.status(200).json({
      status: 200,
      message: "Succesfully Edit Employee Salary",
      data: {
        id,
        employee_id,
        start_date,
        end_date,
        member,
        attendance: data.attendance,
        permit: data.permit,
        permit_data: data.permit_data,
        overtime: data.overtime,
        overtime_data: data.overtime_data,
        overtime_salary: salary_per_day,
        total_salary: data.total_salary + member * memberSalary,
        salary_per_day: data.salary_per_day,
      },
    });
  } catch (error) {
    console.log("Error in EditEmployeeSalary : ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.DeleteEmployeeSalaryById = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id)
      return res.status(404).json({
        status: 404,
        message: "Data ID is Required!",
      });
    const checkData = await prisma.employee_Salary.findFirst({ where: { id } });

    if (!checkData)
      return res.status(404).json({
        status: 404,
        message: "Data is Not Found!!",
      });

    await prisma.employee_Salary.delete({
      where: { id },
    });

    return res.status(200).json({
      status: 200,
      message: "Succesfully Delete Employee Salary",
    });
  } catch (error) {
    console.log("Error in DeleteEmployeeSalary : ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.GetEmployeeAndSalary = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const take = 10;
    const skip = page * take - take;
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;
    const branch_id = req.query.branch_id;
    console.log({ start_date, end_date });
    let data = [];
    let total_employee = await prisma.employee.count();

    if (start_date && end_date) {
      if (branch_id) {
        data = await prisma.employee.findMany({
          where: {
            branch_id,
          },
          take,
          skip,
          include: {
            Employee_Salary: {
              where: {
                AND: [
                  { start_date: { gte: new Date(start_date) } },
                  { end_date: { lte: new Date(end_date) } },
                ],
              },
            },
            Branch: true,
          },
        });
        total_employee = await prisma.employee.count({
          where: { branch_id },
        });
      } else {
        data = await prisma.employee.findMany({
          take,
          skip,
          include: {
            Employee_Salary: {
              where: {
                AND: [
                  { start_date: { gte: new Date(start_date) } },
                  { end_date: { lte: new Date(end_date) } },
                ],
              },
            },
            Branch: true,
          },
        });
      }
    } else {
      if (branch_id) {
        data = await prisma.employee.findMany({
          where: { branch_id },
          take,
          skip,
          include: {
            Employee_Salary: true,
            Branch: true,
          },
        });
        total_employee = await prisma.employee.count({
          where: { branch_id },
        });
      } else {
        data = await prisma.employee.findMany({
          take,
          skip,
          include: {
            Employee_Salary: true,
            Branch: true,
          },
        });
      }
    }

    if (data.length > 0) {
      // data = getDetailEmployeeDataArray({ data, start_date, end_date })
      data = data.map((employee) => {
        let attendance = 0;
        let permit = 0;
        let overtime = 0;
        let member = 0;
        let total_salary = 0;
        if (employee.Employee_Salary.length > 0) {
          employee.Employee_Salary.forEach((salary) => {
            attendance += salary.attendance;
            permit += salary.permit;
            overtime += salary.overtime;
            member += salary.member;
            total_salary += salary.total_salary;
          });
        }

        return {
          // ...employee,
          id: employee.id,
          name: employee.name,
          member,
          first_enter: employee.first_enter,
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt,
          attendance,
          permit,
          overtime,
          pay_day_count: employee.Employee_Salary.length,
          total_salary,
          Branch: {
            id: employee.Branch.id,
            branch: employee.Branch.branch,
          },
        };
      });
    }

    const total_page = Math.ceil(total_employee / take);

    return res.status(200).json({
      status: 200,
      message: "Succesfully Get Employee",
      data,
      current_page: page,
      total_page,
    });
  } catch (error) {
    console.log("Error in GetEmployee : ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.GetSalaryByEmployeeId = async (req, res) => {
  try {
    const employee_id = req.params.employee_id;
    const page = req.query.page || 1;
    const take = 5;
    const skip = page * take - take;

    if (!employee_id)
      return res.status(404).json({
        status: 404,
        message: "Employee ID is Required",
      });

    const data = await prisma.employee_Salary.findMany({
      where: { employee_id },
      take,
      skip,
      orderBy: {
        start_date: "desc",
      },
      include: { Employee: true },
    });

    const total_employee_salary = await prisma.employee_Salary.count({
      where: { employee_id },
    });

    const total_page = Math.ceil(total_employee_salary / take);

    return res.status(200).json({
      status: 200,
      message: "Succesfully Get Employee",
      data,
      current_page: page,
      total_page,
    });
  } catch (error) {
    console.log("Error in GetEmployee : ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

/**
@param {import("express").Request} req
@param {import("express").Response} res
*/
exports.GetEmployeeAndSalaryById = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const take = 10;
    const skip = page * take - take;
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;
    // const start_date = "2024-06-01"
    // const end_date = "2024-12-01"
    console.log({ start_date, end_date });
    let data = [];

    if (start_date && end_date) {
      data = await prisma.employee.findFirst({
        take,
        skip,
        include: {
          Employee_Salary: {
            where: {
              AND: [
                { start_date: { gte: new Date(start_date) } },
                { end_date: { lte: new Date(end_date) } },
              ],
            },
          },
        },
      });
    } else {
      data = await prisma.employee.findMany({
        take,
        skip,
        include: {
          Employee_Salary: true,
        },
      });
    }

    if (data.length > 0) {
      // data = getDetailEmployeeDataArray({ data, start_date, end_date })
      data = data.map((employee) => {
        let attendance = 0;
        let permit = 0;
        let overtime = 0;
        let total_salary = 0;
        if (employee.Employee_Salary.length > 0) {
          employee.Employee_Salary.forEach((salary) => {
            attendance += salary.attendance;
            permit += salary.permit;
            overtime += salary.overtime;
            total_salary += salary.total_salary;
          });
        }

        return {
          // ...employee,
          id: employee.id,
          name: employee.name,
          member: employee.member,
          first_enter: employee.first_enter,
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt,
          attendance,
          permit,
          overtime,
          pay_day_count: employee.Employee_Salary.length,
          total_salary,
        };
      });
    }

    const total_employee = await prisma.employee.count();

    const total_page = Math.ceil(total_employee / take);

    return res.status(200).json({
      status: 200,
      message: "Succesfully Get Employee",
      data,
      current_page: page,
      total_page,
    });
  } catch (error) {
    console.log("Error in GetEmployee : ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

const getDetailEmployeeDataArray = ({ data, start_date, end_date }) => {
  const newData = data.map((employee) => {
    let startDate;
    let endDate;
    let overtime;
    let permit;

    if (start_date && end_date) {
      startDate = new Date(start_date);
      endDate = new Date(end_date);

      overtime = employee.Attendance_Data.filter((item) => {
        const attendanceDate = new Date(item.date);
        if (
          item.type === "OVERTIME" &&
          attendanceDate >= startDate &&
          attendanceDate <= endDate
        )
          return true;
        return false;
      }).length;

      permit = employee.Attendance_Data.filter((item) => {
        const attendanceDate = new Date(item.date);
        if (
          item.type === "PERMIT" &&
          attendanceDate >= startDate &&
          attendanceDate <= endDate
        )
          return true;
        return false;
      }).length;
    } else {
      startDate = new Date(employee.first_enter);
      endDate = new Date();

      overtime = employee.Attendance_Data.filter(
        (item) => item.type === "OVERTIME"
      ).length;
      permit = employee.Attendance_Data.filter(
        (item) => item.type === "PERMIT"
      ).length;
    }

    const firstEnter = new Date(employee.first_enter);
    const dueDate = firstEnter.getDate();
    const first =
      start_date && end_date && startDate > firstEnter
        ? new Date(start_date)
        : firstEnter;
    first.setDate(dueDate);
    const now = start_date && end_date ? new Date(end_date) : new Date();

    // Attendance
    const differenceInMilliseconds =
      start_date && end_date && startDate > firstEnter
        ? endDate.getTime() - first.getTime()
        : endDate.getTime() - firstEnter.getTime();
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    const attendance =
      differenceInDays - permit < 0 ? 0 : differenceInDays - permit;

    // Check Total Count Sejak Awal
    let firstAndSecond = 0;
    const check = 2;
    const dateWhenSalaryNormal = new Date(
      firstEnter.toISOString().split("T")[0]
    );
    while (firstAndSecond <= check) {
      if (dateWhenSalaryNormal.getDate() === dueDate) firstAndSecond++;
      dateWhenSalaryNormal.setMonth(dateWhenSalaryNormal.getMonth() + 1);
    }
    const dateSalarySecond = new Date(
      dateWhenSalaryNormal.toISOString().split("T")[0]
    );
    dateSalarySecond.setMonth(dateSalarySecond.getMonth() - 1);
    const dateSalaryFirst = new Date(
      dateWhenSalaryNormal.toISOString().split("T")[0]
    );
    dateSalaryFirst.setMonth(dateSalaryFirst.getMonth() - 2);

    // Pay Day Count
    let pay_day_data = [];
    first.setMonth(first.getMonth() + 1);
    let payDayIndex = 0;
    while (first <= now) {
      if (first.getDate() === dueDate) {
        const nextMonth = new Date(first.toISOString().split("T")[0]);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        // Total Hari
        const differenceInMilliseconds = nextMonth.getTime() - first.getTime();
        const differenceInDays = Math.floor(
          differenceInMilliseconds / (1000 * 60 * 60 * 24)
        );

        // Permit bulan ini
        const permitData = employee.Attendance_Data.filter((item) => {
          const attendanceDate = new Date(item.date);
          if (
            item.type === "PERMIT" &&
            attendanceDate >= first &&
            attendanceDate <= nextMonth
          )
            return true;
          return false;
        }).length;

        // Overtime bulan ini
        const overtimeData = employee.Attendance_Data.filter((item) => {
          const attendanceDate = new Date(item.date);
          if (
            item.type === "OVERTIME" &&
            attendanceDate >= first &&
            attendanceDate <= nextMonth
          )
            return true;
          return false;
        }).length;

        let salary = 0;
        if (start_date && end_date) {
          if (startDate < dateWhenSalaryNormal) {
            if (first <= dateSalaryFirst) salary = firstSalary;
            else if (first <= dateSalarySecond) salary = secondSalary;
            else salary = normalSalary;
          } else {
            salary = normalSalary;
          }
        } else {
          if (payDayIndex === 0) salary = firstSalary;
          else if (payDayIndex === 1) salary = secondSalary;
          else salary = normalSalary;
        }
        console.log({ payDayIndex, salary });

        pay_day_data.push({
          year: first.getFullYear(),
          month: first.getMonth() + 1,
          attendance: differenceInDays - permitData,
          permit: permitData,
          overtime: overtimeData,
          salary,
        });
      }

      first.setMonth(first.getMonth() + 1);
      payDayIndex++;
    }

    // Salary
    let total_salary = 0;
    let overtime_salary = overtimeSalary * overtime;
    pay_day_data.forEach((item, index) => {
      total_salary += item.attendance * item.salary;
    });
    return {
      ...employee,
      id: employee.id,
      name: employee.name,
      first_enter: employee.first_enter,
      // member: employee.member,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      attendance,
      overtime,
      permit,
      pay_day_data,
      total_salary: total_salary + overtime_salary,
      Branch: {
        id: employee.Branch.id,
        branch: employee.Branch.branch,
      },
    };
  });
  return newData;
};

const getDetailEmployeeDataObject = async ({
  object,
  start_date,
  end_date,
  id,
}) => {
  let data = object;
  let startDate;
  let endDate;
  let overtime;
  let permit;

  if (start_date && end_date) {
    startDate = new Date(start_date);
    endDate = new Date(end_date);
    data = await prisma.employee.findFirst({
      where: { id },
      include: {
        Attendance_Data: {
          where: {
            AND: [{ date: { gte: startDate } }, { date: { lte: endDate } }],
          },
          orderBy: {
            date: "asc",
          },
        },
      },
    });

    overtime = data.Attendance_Data.filter((item) => {
      const attendanceDate = new Date(item.date);
      if (
        item.type === "OVERTIME" &&
        attendanceDate >= startDate &&
        attendanceDate <= endDate
      )
        return true;
      return false;
    }).length;

    permit = data.Attendance_Data.filter((item) => {
      const attendanceDate = new Date(item.date);
      if (
        item.type === "PERMIT" &&
        attendanceDate >= startDate &&
        attendanceDate <= endDate
      )
        return true;
      return false;
    }).length;
  } else {
    startDate = new Date(data.first_enter);
    endDate = new Date();

    overtime = data.Attendance_Data.filter(
      (item) => item.type === "OVERTIME"
    ).length;
    permit = data.Attendance_Data.filter(
      (item) => item.type === "PERMIT"
    ).length;
  }

  const firstEnter = new Date(data.first_enter);
  const dueDate = firstEnter.getDate();
  const first =
    start_date && end_date && startDate > firstEnter
      ? new Date(start_date)
      : firstEnter;
  first.setDate(dueDate);
  const now = start_date && end_date ? new Date(end_date) : new Date();
  if (new Date(end_date) > new Date()) {
    now.setDate(new Date().getDate());
  }

  // Attendance
  const differenceInMilliseconds =
    start_date && end_date && startDate > firstEnter
      ? endDate.getTime() - first.getTime()
      : endDate.getTime() - firstEnter.getTime();
  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );
  const attendance =
    differenceInDays - permit < 0 ? 0 : differenceInDays - permit;

  // Check Total Count Sejak Awal
  let firstAndSecond = 0;
  const check = 2;
  const dateWhenSalaryNormal = new Date(firstEnter.toISOString().split("T")[0]);
  while (firstAndSecond <= check) {
    if (dateWhenSalaryNormal.getDate() === dueDate) firstAndSecond++;
    dateWhenSalaryNormal.setMonth(dateWhenSalaryNormal.getMonth() + 1);
  }
  const dateSalarySecond = new Date(
    dateWhenSalaryNormal.toISOString().split("T")[0]
  );
  dateSalarySecond.setMonth(dateSalarySecond.getMonth() - 1);
  const dateSalaryFirst = new Date(
    dateWhenSalaryNormal.toISOString().split("T")[0]
  );
  dateSalaryFirst.setMonth(dateSalaryFirst.getMonth() - 2);

  // Pay Day Count
  let pay_day_data = [];
  first.setMonth(first.getMonth() + 1);
  let payDayIndex = 0;
  while (first <= now) {
    if (first.getDate() === dueDate) {
      const nextMonth = new Date(first.toISOString().split("T")[0]);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      // Total Hari
      const differenceInMilliseconds = nextMonth.getTime() - first.getTime();
      const differenceInDays = Math.floor(
        differenceInMilliseconds / (1000 * 60 * 60 * 24)
      );

      // Permit bulan ini
      const permitData = data.Attendance_Data.filter((item) => {
        const prevMonth = new Date(first.toISOString().split("T")[0]);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        const attendanceDate = new Date(item.date);
        if (
          item.type === "PERMIT" &&
          attendanceDate >= prevMonth &&
          attendanceDate <= first
        )
          return true;
        return false;
      }).map((item) => item.date);

      // Overtime bulan ini
      const overtimeData = data.Attendance_Data.filter((item) => {
        const prevMonth = new Date(first.toISOString().split("T")[0]);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        const attendanceDate = new Date(item.date);
        if (
          item.type === "OVERTIME" &&
          attendanceDate >= prevMonth &&
          attendanceDate <= first
        )
          return true;
        return false;
      }).map((item) => item.date);

      let salary = 0;
      if (start_date && end_date) {
        if (startDate < dateWhenSalaryNormal) {
          if (first <= dateSalaryFirst) salary = firstSalary;
          else if (first <= dateSalarySecond) salary = secondSalary;
          else salary = normalSalary;
        } else {
          salary = normalSalary;
        }
      } else {
        if (payDayIndex === 0) salary = firstSalary;
        else if (payDayIndex === 1) salary = secondSalary;
        else salary = normalSalary;
      }
      console.log({ payDayIndex, salary });

      const MonthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      pay_day_data.push({
        date: `${first.getFullYear()}-${(first.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${first.getDate().toString().padStart(2, "0")}`,
        month: MonthNames[first.getMonth()],
        attendance: differenceInDays - permitData.length,
        permit: permitData.length,
        permit_data: permitData,
        overtime: overtimeData.length,
        overtime_data: overtimeData,
        salary,
      });
    }

    first.setMonth(first.getMonth() + 1);
    payDayIndex++;
  }

  // Salary
  let total_salary = 0;
  let overtime_salary = item.salary * overtime;
  pay_day_data.forEach((item, index) => {
    total_salary += item.attendance * item.salary;
  });
  const sendData = {
    ...data,
    id: data.id,
    name: data.name,
    first_enter: data.first_enter,
    // member: data.member,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    attendance,
    overtime,
    overtime_salary,
    permit,
    pay_day_data,
    total_salary,
  };
  return sendData;
};

const getDetailEmployeeDataObject2 = async ({
  start_date,
  end_date,
  employee_id,
  salary_per_day,
}) => {
  let overtime;
  let permit;
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const data = await prisma.employee.findFirst({
    where: { id: employee_id },
    include: {
      Attendance_Data: {
        where: {
          AND: [{ date: { gte: startDate } }, { date: { lte: endDate } }],
        },
        orderBy: {
          date: "asc",
        },
      },
    },
  });

  overtime = data.Attendance_Data.filter((item) => {
    const attendanceDate = new Date(item.date);
    if (
      item.type === "OVERTIME" &&
      attendanceDate >= startDate &&
      attendanceDate <= endDate
    )
      return true;
    return false;
  });

  permit = data.Attendance_Data.filter((item) => {
    const attendanceDate = new Date(item.date);
    if (
      item.type === "PERMIT" &&
      attendanceDate >= startDate &&
      attendanceDate <= endDate
    )
      return true;
    return false;
  });

  const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );
  const attendance =
    differenceInDays - permit.length < 0 ? 0 : differenceInDays - permit.length;

  console.log({
    startDate,
    endDate,
    permit: permit.length,
    overtime: overtime.length,
    attendance: attendance + 1, // fix attendance
    differenceInDays,
  });

  const sendData = {
    // ...data,
    id: data.id,
    name: data.name,
    member: data.member,
    attendance: attendance + 1,
    overtime: overtime.length,
    overtime_data: getDateGroup(overtime.map((item) => item.date)),
    // overtime_salary: overtimeSalary * overtime.length,
    overtime_salary: salary_per_day * overtime.length,
    permit: permit.length,
    permit_data: getDateGroup(permit.map((item) => item.date)),
    total_salary:
      (attendance + 1) * salary_per_day + salary_per_day * overtime.length,
  };
  return sendData;
};
