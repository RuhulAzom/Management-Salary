import { API_URL } from "@/env";
import { cn, toastError, token } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";

type BranchProps = {
  id: string;
  branch: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    Employee: number;
  };
};

type MonthSalaryProps = {
  year: string;
  month: string;
  month_number: string;
  total_salary: number;
};

type SalaryDataProps = {
  year: number;
  data: MonthSalaryProps[];
};

const Dashboard = () => {
  const [branchData, setBranchData] = useState<BranchProps[]>([]);
  const [allEmploye, setAllEmploye] = useState<number>(0);

  const [branchSalary, setBranchSalary] = useState<
    { branch: string; data: SalaryDataProps[] }[]
  >([]);

  const getEmployeeData = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      console.log(res);
      const data: BranchProps[] = [...res.data.data];
      setBranchData(data);
      let totalEmployee = 0;
      data.forEach((branch) => {
        totalEmployee += branch._count.Employee;
      });
      setAllEmploye(totalEmployee);
      return;
    } catch (error: any) {
      console.log("Failed get branch:", error);
      toastError({ error, message: "Failed Get branch" });
      return error;
    }
  };

  const getSalaryData = async ({
    branchId,
  }: {
    branchId: string;
  }): Promise<SalaryDataProps[]> => {
    try {
      let res;
      if (branchId) {
        res = await axios.get(
          `${API_URL}/dashboard/salary?branch_id=${branchId}`,
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        );
      } else {
        res = await axios.get(`${API_URL}/dashboard/salary`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
      }
      console.log(res);
      // setSalaryData([...res.data.data])
      return [...res.data.data];
      // console.log("salary", res.data)
      // return;
    } catch (error: any) {
      console.log("Failed get branch:", error);
      toastError({ error, message: "Failed Get branch" });
      return [];
    }
  };

  const getAllSalaryData = async () => {
    setBranchSalary([]);
    const saveData = [];
    for (const branch of branchData) {
      const data: SalaryDataProps[] = await getSalaryData({
        branchId: branch.id,
      });
      // setBranchSalary(prev => ([...prev, { branch: branch.branch, data: data }]))
      saveData.push({ branch: branch.branch, data: data });
    }
    setBranchSalary(saveData);
  };

  useEffect(() => {
    getEmployeeData();
  }, []);

  useEffect(() => {
    getAllSalaryData();
  }, [branchData]);

  return (
    <div className="py-[2rem] px-[1rem] md:px-[4rem] flex flex-col gap-[2rem] bg-body">
      <div
        className={cn(
          "flex flex-col gap-[1rem]",
          branchData.length > 0 && `md:grid grid-cols-${branchData.length + 1}`
        )}
      >
        <div className="col-span-1 flex flex-col gap-[.5rem] bg-white p-[2rem] rounded-[1rem] shadow-lg">
          <p className="text-[1.1rem] text-black font-[600]">Semua Cabang</p>
          <div className="flex justify-start items-end gap-[.5rem]">
            <p className="text-[3rem] font-[500] text-gray-500">{allEmploye}</p>
            <p className=" font-[500] text-gray-500 mb-[.8rem]">
              Total Karyawan
            </p>
          </div>
        </div>
        {branchData.map((branch) => (
          <div className="col-span-1 flex flex-col gap-[.5rem] bg-white p-[2rem] rounded-[1rem] shadow-lg">
            <p className="text-[1.1rem] text-black font-[600]">
              Cabang {branch.branch}
            </p>
            <div className="flex justify-start items-end gap-[.5rem]">
              <p className="text-[3rem] font-[500] text-gray-500">
                {branch._count.Employee}
              </p>
              <p className=" font-[500] text-gray-500 mb-[.8rem]">
                Total Karyawan
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-y-[2rem] md:grid-cols-2 gap-x-[2rem] mt-[2rem]">
        {branchSalary.map((branch, index) => (
          <div
            key={index}
            className="flex flex-col gap-[2rem] bg-white p-[1rem] rounded-[1rem] shadow-lg pb-[2rem]"
          >
            <p className="text-[1.8rem] font-[600] text-gray-500">
              Cabang {branch.branch}
            </p>
            {branch.data.map((item) => {
              let total = 0;
              item.data.forEach((month) => {
                total += month.total_salary;
              });
              return (
                <div
                  key={item.year}
                  className="bg-white flex flex-col p-[1rem] border-t-2"
                >
                  <div className="text-[1.3rem] font-[500] text-gray-500">
                    Tahun {item.year}
                  </div>
                  <div className="w-full">
                    <table className="w-full border-spacing-y-1 border-separate">
                      <thead>
                        <tr>
                          <th className="font-[500] p-[.5rem] text-center">
                            Bulan Ke
                          </th>
                          <th className="font-[500] p-[.5rem] text-start">
                            Bulan
                          </th>
                          <th className="font-[500] p-[.5rem] text-start">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.data.map((month, index) => (
                          <tr key={index}>
                            <td
                              width={"100px"}
                              className={cn(
                                "p-[.5rem] bg-main-purple text-center",
                                "rounded-l-[1rem]"
                              )}
                            >
                              {month.month_number}
                            </td>
                            <td
                              className={cn(
                                "p-[.5rem] bg-main-purple text-start"
                              )}
                            >
                              {month.month}
                            </td>
                            <td
                              className={cn(
                                "p-[.5rem] bg-main-purple text-start",
                                "rounded-r-[1rem]"
                              )}
                            >
                              Rp.{" "}
                              {month.total_salary.toLocaleString("id-ID", {
                                style: "decimal",
                              })}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td
                            width={"100px"}
                            className={cn(
                              "p-[.5rem] bg-main-purple text-center",
                              "rounded-l-[1rem]"
                            )}
                          ></td>
                          <td
                            className={cn(
                              "p-[.5rem] bg-main-purple text-start"
                            )}
                          >
                            <p className="font-[600]">Total :</p>
                          </td>
                          <td
                            className={cn(
                              "p-[.5rem] bg-main-purple text-start",
                              "rounded-r-[1rem] font-[600]"
                            )}
                          >
                            Rp.{" "}
                            {total.toLocaleString("id-ID", {
                              style: "decimal",
                            })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
