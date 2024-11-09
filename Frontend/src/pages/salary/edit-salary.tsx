import { API_URL } from "@/env"
import { getDateForInput, toastError, token } from "@/lib/utils"
import axios from "axios"
import React, { SetStateAction, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"
import { EditEmployeeSalaryProps, EmployeeSalaryProps } from "."

interface EditDataProps {
    id: string,
    start_date: string,
    end_date: string,
    member: number | string,
    salary_per_day: number | string,

    loading: boolean
}

type Props = {
    data: EmployeeSalaryProps | null,
    setEdit: React.Dispatch<SetStateAction<EditEmployeeSalaryProps>>
    refresh: () => void;
    name: string
}

export default function EditSalary({ data, setEdit, refresh, name }: Props) {


    const [editData, setEditData] = useState<EditDataProps>({
        id: "",
        start_date: "",
        end_date: "",
        member: "",
        salary_per_day: "",
        loading: false
    })

    console.log(data)

    useEffect(() => {
        if (data) {
            setEditData({
                id: data.id,
                start_date: data.start_date,
                end_date: data.end_date,
                member: data.member,
                salary_per_day: data.salary_per_day,
                loading: false
            })
        }
    }, [data])

    const handleEditAttendance = async () => {
        setEditData(prev => ({ ...prev, loading: true }))
        try {
            const res = await axios.put(`${API_URL}/employee/salary`, {
                id: editData.id,
                employee_id: data?.employee_id,
                start_date: editData.start_date,
                end_date: editData.end_date,
                member: parseInt(editData.member.toString()),
                salary_per_day: parseInt(editData.salary_per_day.toString())
            }, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            console.log(res)
            toast.success(`Succes To Edit Salary`, { duration: 3000 })
            refresh()
            setEditData(prev => ({ ...prev, loading: false }))
            setEdit({ value: false, data: null })
            return;
        } catch (error: any) {
            console.log("Failed to Edit Salary :", error)
            toastError({ error, message: "Failed to Edit Salary" })
            setEditData(prev => ({ ...prev, loading: false }))
            return error;
        }
    }

    if (!data) return null

    return (
        <div className="fixed top-0 left-0 z-[100] w-full h-full bg-[#ffffff01] backdrop-blur-[8px] flex justify-center items-center">
            <div className="bg-white p-[3rem] shadow-default-black rounded-[1rem] flex flex-col gap-[2rem] relative w-[90%] md:w-full max-w-[400px]">
                <i className="bx bx-x absolute top-4 right-4 text-[1.5rem] hover:bg-main-gray-border rounded-[50%] duration-300"
                    onClick={() => { !editData.loading && setEdit({ value: false, data: null }) }}
                />
                <h1 className="text-[1.1rem] font-[600] text-main-gray-text text-center">
                    Edit Employee
                </h1>
                <form className="flex flex-col gap-[1rem]">
                    <div id="nama" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>Name</p>
                        <input className="outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full"
                            type="text"
                            placeholder="Input Name.."
                            value={name}
                            disabled
                        />
                    </div>

                    <div id="member" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>Member</p>
                        <input className="outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full"
                            type="number"
                            placeholder="Input Member.."
                            value={editData.member}
                            onChange={(e) => {
                                setEditData(prev => ({ ...prev, member: e.target.value }))
                            }}
                        />
                    </div>

                    <div id="start_date" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>Start Date</p>
                        <input className="outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full"
                            type="date"
                            placeholder="Input Start Date.."
                            value={editData.start_date.length > 0 ? getDateForInput(editData.start_date) : undefined}
                            onChange={(e) => {
                                setEditData(prev => ({ ...prev, start_date: e.target.value }))
                            }}
                            max={new Date().toISOString().split("T")[0]}
                        />
                    </div>
                    <div id="end_date" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>End Date</p>
                        <input className="outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full"
                            type="date"
                            placeholder="Input End Date.."
                            value={editData.end_date.length > 0 ? getDateForInput(editData.end_date) : undefined}
                            onChange={(e) => {
                                setEditData(prev => ({ ...prev, end_date: e.target.value }))
                            }}
                            max={new Date().toISOString().split("T")[0]}
                        />
                    </div>
                    <div id="salary" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>Salary per day</p>
                        <select className="outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full"
                            value={editData.salary_per_day}
                            onChange={(e) => {
                                setEditData(prev => ({ ...prev, salary_per_day: e.target.value }))
                            }}
                            required
                        >
                            <option value="60000">
                                Rp. 60.000
                            </option>
                            <option value="50000">
                                Rp. 50.000
                            </option>
                            <option value="40000">
                                Rp. 40.000
                            </option>
                        </select>
                    </div>
                    <div className="flex items-center gap-[1rem] w-full">
                        {!editData.loading &&
                            <div className="mt-[2rem] bg-transparent border border-blue-500 hover:bg-blue-100 duration-300 text-blue-600 font-[500] h-[50px] w-full flex justify-center items-center cursor-pointer" onClick={() => { setEdit({ value: false, data: null }) }}>
                                Cancel
                            </div>
                        }
                        {!editData.loading ?
                            <button className="mt-[2rem] bg-blue-500 hover:bg-blue-400 duration-300 text-white font-[500] h-[50px] w-full" onClick={() => { handleEditAttendance() }}>
                                Save Data
                            </button>
                            :
                            <div className="flex mt-[2rem] justify-center items-center w-full text-blue-600">
                                <Loader2 className="animate-spin h-[50px] w-[50px]" />
                            </div>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}