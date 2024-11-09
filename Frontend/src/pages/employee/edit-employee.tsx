import { API_URL } from "@/env"
import { getDateForInput, toastError, token } from "@/lib/utils"
import axios from "axios"
import React, { SetStateAction, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { EditEmployeeProps, EmployeeProps } from "."
import { Loader2 } from "lucide-react"

type EditDataProps = {
    id: string,
    name: string,
    first_enter: string,
    branch_id: string;
    loading: boolean
}

interface BranchProps {
    id: string;
    branch: string;

    createdAt: string;
    updatedAt: string;
}

type Props = {
    data: EmployeeProps | null,
    setEdit: React.Dispatch<SetStateAction<EditEmployeeProps>>
    refresh: () => void;
}

export default function EditEmployee({ data, setEdit, refresh }: Props) {


    // const [name, setName] = useState<string>(data.nama || "")
    // const [telp, setTelp] = useState<string>(data.telp || "")
    // const [alamat, setAlamat] = useState<string>(data.alamat || "")
    // const [loading, setLoading] = useState<boolean>(false)
    const [branchData, setBranchData] = useState<BranchProps[]>([])
    const [editData, setEditData] = useState<EditDataProps>({
        id: "",
        first_enter: "",
        name: "",
        branch_id: "",
        loading: false
    })

    console.log(data)

    const GetBranch = async () => {
        try {
            const res = await axios.get(`${API_URL}/branch`, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            console.log(res)
            setBranchData([...res.data.data])
            return;
        } catch (error: any) {
            console.log("Failed get branch:", error)
            toastError({ error, message: "Failed Get branch" })
            return error
        }
    }

    const handleEditEmployee = async () => {
        setEditData(prev => ({ ...prev, loading: true }))
        try {
            const res = await axios.put(`${API_URL}/employee/edit`, {
                id: editData.id,
                name: editData.name,
                first_enter: editData.first_enter,
                branch_id: editData.branch_id
            }, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            console.log(res)
            toast.success(`Succes To Edit Employee`, { duration: 3000 })
            refresh()
            setEditData(prev => ({ ...prev, loading: false }))
            setEdit({ value: false, data: null })
            return;
        } catch (error: any) {
            console.log("Failed to Edit Employee :", error)
            toastError({ error, message: "Failed to Edit Employee" })
            setEditData(prev => ({ ...prev, loading: false }))
            return error;
        }
    }

    useEffect(() => {
        if (data) {
            setEditData({
                id: data.id,
                first_enter: data.first_enter,
                name: data.name,
                branch_id: data.Branch.id,
                loading: false
            })
        }
    }, [data])

    useEffect(() => {
        GetBranch()
    }, [])

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
                            placeholder="Input Nama Customer.."
                            value={editData.name}
                            onChange={(e) => {
                                setEditData(prev => ({ ...prev, name: e.target.value }))
                            }}
                        />
                    </div>

                    <div id="nama" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>First Enter</p>
                        <input className="outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full"
                            type="date"
                            placeholder="Input Alamat.."
                            value={getDateForInput(editData.first_enter)}
                            onChange={(e) => {
                                setEditData(prev => ({ ...prev, first_enter: e.target.value }))
                            }}
                        />
                    </div>
                    <div id="salary" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>Salary per day</p>
                        <select className="outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full"
                            value={editData.branch_id}
                            onChange={(e) => {
                                setEditData((prev) => ({ ...prev, branch_id: e.target.value }))
                            }}
                            required
                        >
                            {branchData.map((item, index) => (
                                <option key={index} value={item.id}>
                                    {item.branch}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-[1rem] w-full">
                        {!editData.loading &&
                            <div className="mt-[2rem] bg-transparent border border-blue-500 hover:bg-blue-100 duration-300 text-blue-600 font-[500] h-[50px] w-full flex justify-center items-center cursor-pointer" onClick={() => { setEdit({ value: false, data: null }) }}>
                                Cancel
                            </div>
                        }
                        {!editData.loading ?
                            <button className="mt-[2rem] bg-blue-500 hover:bg-blue-400 duration-300 text-white font-[500] h-[50px] w-full" onClick={() => { handleEditEmployee() }}>
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