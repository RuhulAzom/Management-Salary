import { API_URL } from "@/env"
import { cn, getDateForInput, toastError, token } from "@/lib/utils"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"

type InputDataProps = {
    employee_id: string;
    type: "PERMIT" | "OVERTIME" | null;
    date: string;
    name: string;
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

export default function AddAttendance({ refresh, onClose, employee }: Props) {
    const [inputData, setInputData] = useState<InputDataProps>({
        employee_id: "",
        type: null,
        date: "",
        name: "",
        loading: false
    })

    const handleAddAttendance = async () => {
        if (inputData.type !== "PERMIT" && inputData.type !== "OVERTIME") {
            toast.error("Select Type")
            return
        }
        else if (inputData.date.length === 0) {
            toast.error("Input Date")
            return
        }
        setInputData(prev => ({ ...prev, loading: true }))
        try {
            const res = await axios.post(`${API_URL}/attendance/add`, {
                employee_id: inputData.employee_id,
                type: inputData.type,
                date: inputData.date,
            }, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            console.log(res)
            toast.success(`Succes To Add Attendance`, { duration: 3000 })
            refresh()
            setInputData(prev => ({ ...prev, loading: false }))
            onClose()
            return;
        } catch (error: any) {
            console.log("Failed to Add Attendance :", error)
            toastError({ error, message: "Failed to Add Attendance" })
            setInputData(prev => ({ ...prev, loading: false }))
            return error;
        }
    }

    useEffect(() => {
        if (employee) {
            setInputData(prev => ({
                ...prev,
                employee_id: employee.id,
                name: employee.name,
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
                    Add Attendance
                </h1>
                <form className="flex flex-col gap-[1rem]"
                    onSubmit={(e) => { handleAddAttendance(); e.preventDefault() }}
                >
                    <div id="nama" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>Name</p>
                        <input className="outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full"
                            type="text"
                            placeholder="Input Name.."
                            value={inputData.name}
                            onChange={(e) => {
                                setInputData(prev => ({ ...prev, name: e.target.value }))
                            }}
                            disabled
                        />
                    </div>

                    <div id="nama" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>Type</p>
                        <select className={cn("outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full focus:ring-0",
                            !inputData.type && "text-gray-600/70"
                        )}
                            value={inputData.type ? inputData.type : "placeholder"}
                            onChange={(e) => {
                                setInputData(prev => ({ ...prev, type: e.target.value as "PERMIT" | "OVERTIME" | null }))
                            }}
                        >
                            <option value="placeholder" className="text-gray-600/70">
                                Pilih Type
                            </option>
                            <option value="PERMIT" className="text-black">
                                Permit
                            </option>
                            <option value="OVERTIME" className="text-black">
                                Overtime
                            </option>
                        </select>
                    </div>

                    <div id="date" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>Date</p>
                        <input className="outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full"
                            type="date"
                            placeholder="Input Alamat.."
                            value={inputData.date.length > 0 ? getDateForInput(inputData.date) : undefined}
                            onChange={(e) => {
                                setInputData(prev => ({ ...prev, date: e.target.value }))
                            }}
                            max={new Date().toISOString().split("T")[0]}
                        />
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