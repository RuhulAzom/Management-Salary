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
    member: string,
    first_enter: string,
    loading: boolean
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
    const [editData, setEditData] = useState<EditDataProps>({
        id: "",
        member: "",
        first_enter: "",
        name: "",
        loading: false
    })

    console.log(data)

    useEffect(() => {
        if (data) {
            setEditData({
                id: data.id,
                member: data.member.toString(),
                first_enter: data.first_enter,
                name: data.name,
                loading: false
            })
        }
    }, [data])

    const handleEditEmployee = async () => {
        setEditData(prev => ({ ...prev, loading: true }))
        try {
            const res = await axios.put(`${API_URL}/employee/edit`, {
                id: editData.id,
                name: editData.name,
                member: parseInt(editData.member),
                first_enter: editData.first_enter
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