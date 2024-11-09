import { API_URL } from "@/env"
import { cn, getDateForInput, toastError, token } from "@/lib/utils"
import axios from "axios"
import React, { SetStateAction, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"
import { BranchProps, EditBranchProps } from "."

type EditDataProps = {
    id: string;
    branch: string;

    createdAt: string;
    updatedAt: string;
    loading: boolean
}

type Props = {
    data: BranchProps | null,
    setEdit: React.Dispatch<SetStateAction<EditBranchProps>>
    refresh: () => void;
    name: string
}

export default function EditAttendance({ data, setEdit, refresh, name }: Props) {


    const [editData, setEditData] = useState<EditDataProps>({
        id: "",
        branch: "",
        createdAt: "",
        updatedAt: "",
        loading: false
    })

    console.log(data)

    useEffect(() => {
        if (data) {
            setEditData({
                id: data.id,
                branch: data.branch,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                loading: false
            })
        }
    }, [data])

    const handleEditAttendance = async () => {
        setEditData(prev => ({ ...prev, loading: true }))
        try {
            const res = await axios.put(`${API_URL}/branch/edit`, {
                id: editData.id,
                branch: editData.branch
            }, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            console.log(res)
            toast.success(`Succes To Edit Attendance`, { duration: 3000 })
            refresh()
            setEditData(prev => ({ ...prev, loading: false }))
            setEdit({ value: false, data: null })
            return;
        } catch (error: any) {
            console.log("Failed to Edit Attendance :", error)
            toastError({ error, message: "Failed to Edit Attendance" })
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

                    <div id="date" className="text-[.9rem] flex flex-col gap-[.2rem]">
                        <p>Branch</p>
                        <input className="outline-none border border-black rounded-[.1rem] px-[1rem] py-[.5rem] w-full"
                            type="text"
                            placeholder="Input Branch.."
                            value={editData.branch}
                            onChange={(e) => {
                                setEditData(prev => ({ ...prev, branch: e.target.value }))
                            }}
                        />
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