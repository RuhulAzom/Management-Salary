import { API_URL } from "@/env"
import { getDateForInput, toastError, token } from "@/lib/utils"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"

type InputDataProps = {
    employee_id: string,
    start_date: string,
    end_date: string,
    member: number | string,
    salary_per_day: number | string,

    loading: boolean;
}

type Props = {
    employee: {
        id: string,
        name: string,
        show: boolean
    } | null,
    refresh: () => void;
    onClose: () => void;
}

export default function AddSalary({ refresh, onClose, employee }: Props) {
    const [inputData, setInputData] = useState<InputDataProps>({
        employee_id: "",
        start_date: "",
        end_date: "",
        member: "",
        salary_per_day: "60000",
        loading: false
    })

    const handleAddSalary = async () => {
        // if (inputData.type !== "PERMIT" && inputData.type !== "OVERTIME") {
        //     toast.error("Select Type")
        //     return
        // }
        // else if (inputData.start_date.length === 0) {
        //     toast.error("Input Date")
        //     return
        // }
        setInputData(prev => ({ ...prev, loading: true }))
        try {
            const res = await axios.post(`${API_URL}/employee/salary`, {
                employee_id: inputData.employee_id,
                start_date: inputData.start_date,
                end_date: inputData.end_date,
                member: parseInt(inputData.member.toString()),
                salary_per_day: parseInt(inputData.salary_per_day.toString())
            }, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            console.log(res)
            toast.success(`Succes To Add Salary`, { duration: 3000 })
            refresh()
            setInputData(prev => ({ ...prev, loading: false }))
            onClose()
            return;
        } catch (error: any) {
            console.log("Failed to Add Salary :", error)
            toastError({ error, message: "Failed to Add Salary" })
            setInputData(prev => ({ ...prev, loading: false }))
            return error;
        }
    }

    useEffect(() => {
        if (employee) {
            setInputData(prev => ({
                ...prev,
                employee_id: employee.id,
            }))
        }
    }, [employee])

    return (
        <div className="fixed top-0 left-0 z-[100] w-full h-full bg-[#ffffff01] backdrop-blur-[8px] flex justify-center items-center">
            <div className="bg-white p-[3rem] shadow-default-black rounded-[1rem] flex flex-col gap-[2rem] relative w-[90%] md:w-full max-w-[400px]">
                <i className="bx bx-x absolute top-4 right-4 text-[1.5rem] hover:bg-main-gray-border rounded-[50%] duration-300"
                    onClick={() => { !inputData.loading && onClose() }}
                />
                <h1 className="text-[1.1rem] font-[600] text-main-gray-text text-center">
                    Add Salary
                </h1>
                <form className="flex flex-col gap-[1rem]"
                    onSubmit={(e) => { handleAddSalary(); e.preventDefault() }}
                >
                    <div id="nama" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>Name</p>
                        <input className="outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full"
                            type="text"
                            placeholder="Input Name.."
                            value={employee?.name}
                            disabled
                        />
                    </div>

                    <div id="member" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>Member</p>
                        <input className="outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full"
                            type="number"
                            placeholder="Input Member.."
                            value={inputData.member}
                            onChange={(e) => {
                                setInputData(prev => ({ ...prev, member: e.target.value }))
                            }}
                            required
                        />
                    </div>

                    <div id="start_date" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>Start Date</p>
                        <input className="outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full"
                            type="date"
                            placeholder="Input Start Date.."
                            value={inputData.start_date.length > 0 ? getDateForInput(inputData.start_date) : undefined}
                            onChange={(e) => {
                                setInputData(prev => ({ ...prev, start_date: e.target.value }))
                            }}
                            required
                            max={new Date().toISOString().split("T")[0]}
                        />
                    </div>
                    <div id="end_date" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>End Date</p>
                        <input className="outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full"
                            type="date"
                            placeholder="Input End Date.."
                            value={inputData.end_date.length > 0 ? getDateForInput(inputData.end_date) : undefined}
                            onChange={(e) => {
                                setInputData(prev => ({ ...prev, end_date: e.target.value }))
                            }}
                            required
                            max={new Date().toISOString().split("T")[0]}
                        />
                    </div>
                    <div id="salary" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>Salary per day</p>
                        <select className="outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full"
                            value={inputData.salary_per_day}
                            onChange={(e) => {
                                setInputData(prev => ({ ...prev, salary_per_day: e.target.value }))
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
                        {!inputData.loading &&
                            <div className="mt-[2rem] bg-transparent border border-blue-500 hover:bg-blue-100 duration-300 text-blue-600 font-[500] h-[50px] w-full flex justify-center items-center cursor-pointer" onClick={() => onClose()}>
                                Cancel
                            </div>
                        }
                        {!inputData.loading ?
                            <button className="mt-[2rem] bg-blue-500 hover:bg-blue-400 duration-300 text-white font-[500] h-[50px] w-full">
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