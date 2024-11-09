import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"
import { API_URL } from "@/env"
import { getDateString, toastError, token } from "@/lib/utils"
import LoadingPageWithText from "@/components/loading/loading-page"
import { Loader2 } from "lucide-react"
import ModalDelete, { ModalDeleteProps } from "@/components/_sub-components/modal-delete"
import EditAttendance from "./edit-attendance"
import InputText from "@/components/_sub-components/input-text"
import AddAttendance from "./add-attendance"
import { EmployeeProps } from "../employee"


export interface BranchProps {
    id: string;
    branch: string;

    createdAt: string;
    updatedAt: string;
}

interface InputDataProps {
    id: string;
    name: string;
    disabled: boolean;
}

// export interface AttendanceDataProps {
//     id: string,
//     employee_id: string,
//     type: "PERMIT" | "OVERTIME",
//     date: string,
//     createdAt: string,
//     updatedAt: string
// }

export interface EditBranchProps {
    value: boolean,
    data: BranchProps | null
}

export default function Branch() {

    const [loading, setLoading] = useState<boolean>(false)
    const [loadingFetch, setLoadingFetch] = useState<boolean>(false)

    const [branchData, setBranchData] = useState<BranchProps[]>([])

    // const [attendanceData, setAttendanceData] = useState<AttendanceDataProps[]>([])

    const [inputData, setInputData] = useState<InputDataProps>({
        id: "",
        name: "",
        disabled: false
    })

    const [editData, setEditData] = useState<EditBranchProps>({
        value: false,
        data: null
    })

    const [modalDelete, setModalDelete] = useState<ModalDeleteProps>({
        id: "",
        title: "",
        show: false
    })

    const getBranchData = async () => {
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

    // const searchByName = async () => {
    //     try {
    //         const res = await axios.get(`${API_URL}/employee/search?name=${inputData.name}&page=1`, {
    //             headers: {
    //                 Authorization: `bearer ${token}`
    //             }
    //         })
    //         console.log("1111", res)
    //         setSearchData([...res.data.data])
    //         return;
    //     } catch (error) {
    //         console.log("Failed Search Employee:", error)
    //         // toastError({ error, message: "Failed Search Employee" })
    //         setSearchData([])
    //         return error
    //     }
    // }

    // const getAttendanceById = async (id: string, page: number) => {
    //     setLoadingFetch(true)
    //     try {
    //         const res = await axios.get(`${API_URL}/attendance?employee_id=${id}&page=${page}`, {
    //             headers: {
    //                 Authorization: `bearer ${token}`
    //             }
    //         })
    //         setTotalPages(res.data.total_page)
    //         setAttendanceData([...res.data.data])
    //         setLoadingFetch(false)
    //         return;
    //     } catch (error) {
    //         console.log("Failed Search Employee:", error)
    //         toastError({ error, message: "Failed Search Employee" })
    //         setAttendanceData([])
    //         setLoadingFetch(false)
    //         return error
    //     }
    // }

    const deleteBranch = async (id: string) => {
        setLoading(true)
        try {
            const res = await axios.delete(`${API_URL}/branch/delete?id=${id}`, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            setLoading(false)
            console.log(res)
            toast.success("Succes To Delete Branch")
            setModalDelete((prev) => ({ ...prev, show: false, id: "" }))
        } catch (error) {
            console.log("Failed delete Branch:", error)
            setLoading(false)
            toast.error("Failed To Delete Branch")
            setModalDelete((prev) => ({ ...prev, show: false, id: "" }))
            return error
        }
    }

    const handleDelete = async () => {
        setModalDelete((prev) => ({ ...prev, show: false }))
        await deleteBranch(modalDelete.id)
        await getBranchData()
    }

    const refresh = async () => {
        await getBranchData()
    }

    useEffect(() => {
        getBranchData()
    }, [])

    const handleAddBranch = async () => {
        setLoading(true)
        try {
            const res = await axios.post(`${API_URL}/branch/add`, {
                branch: inputData.name
            }, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            setLoading(false)
            console.log(res)
            toast.success("Succes To Add Branch")
            await refresh()
        } catch (error) {
            console.log("Failed Add Branch:", error)
            setLoading(false)
            toast.error("Failed To Add Branch")
            return error
        }
    }


    return (
        <div className="p-[2rem] bg-body">

            <ModalDelete data={modalDelete} setDelete={setModalDelete} onClick={handleDelete} />
            <LoadingPageWithText heading="Deleting Attendance...." loading={loading} />

            {editData.value && (
                <EditAttendance
                    data={editData.data}
                    name={inputData.name}
                    refresh={refresh}
                    setEdit={setEditData}
                />
            )}

            <Link to={"/employee"} className="flex gap-[1rem] justify-start items-center mb-[2rem] hover:bg-main-gray-border cursor-pointer select-none w-fit px-[.8rem] rounded-[1rem] duration-300">
                <i className='bx bx-arrow-back text-[1.5rem]' />
                <p className="text-[1.5rem]">
                    Back
                </p>
            </Link>

            <div className="rounded-sm bg-white">
                <div className="border-b py-4 px-[1.5rem] flex w-full justify-between items-center">
                    <div className="flex">
                        <div className="pr-4">
                            <h3 className="font-medium text-black dark:text-white">
                                Cabang
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-[1.5rem] p-[1.5rem]">
                    <form className="relative flex flex-col gap-[1rem]"
                        onSubmit={(e) => { e.preventDefault(); handleAddBranch() }}
                    >
                        <InputText
                            heading="Cabang"
                            placeholder="Input Cabang..."
                            value={inputData.name}
                            required
                            onChange={(e) => {
                                setInputData(prev => ({ ...prev, name: e.target.value }))
                            }}
                        />
                        <div className="w-full flex justify-end">
                            <button
                                className="bg-main-purple font-[500] hover:bg-main-hover hover:text-white duration-200 text-main py-[.8rem] px-[1rem] rounded-[.8rem]"
                            >
                                Tambah Cabang
                            </button>
                        </div>
                    </form>

                    {/* {inputData.disabled && !loadingFetch && (
                        <div className="flex justify-end p-4">
                            <button
                                className="bg-main-purple font-[500] hover:bg-main-hover hover:text-white duration-200 text-main py-[.8rem] px-[1rem] rounded-[.8rem]"
                                onClick={() => {
                                    setAddData({ id: inputData.id, name: inputData.name, show: true })
                                }}
                            >
                                Add Attendance
                            </button>
                        </div>
                    )}

                    {inputData.disabled && !loadingFetch && (
                        <div className="w-full">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="font-[500] p-[.5rem] text-center">
                                            No
                                        </th>
                                        <th className="font-[500] p-[.5rem] text-start">
                                            Date
                                        </th>
                                        <th className="font-[500] p-[.5rem] text-start">
                                            Description
                                        </th>
                                        <th className="font-[500] p-[.5rem] text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.map((item, index) => (
                                        <tr>
                                            <td className="p-[.5rem] text-center">
                                                {index + 1}
                                            </td>
                                            <td className="p-[.5rem] text-start">
                                                {getDateString(item.date)}
                                            </td>
                                            <td className="p-[.5rem] text-start">
                                                {item.type}
                                            </td>
                                            <td className="p-[.5rem] text-start">
                                                <div className="w-full flex justify-center items-center gap-[1rem]">
                                                    <button className="bg-blue-100 text-blue-600 py-[.5rem] px-[1rem] font-[600] rounded-[.7rem] hover:bg-blue-200 active:bg-blue-100 text-[.8rem]"
                                                        onClick={() => { setEditData({ value: true, data: { ...item } }) }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button className="bg-main-pink text-main-red py-[.5rem] px-[1rem] font-[600] rounded-[.7rem] hover:bg-main-pink-hover active:bg-main-pink text-[.8rem]"
                                                        onClick={() => { setModalDelete((prev) => ({ ...prev, title: `Attendance in ${getDateString(item.date)}`, show: true, id: item.id })) }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {inputData.disabled && !loadingFetch && (
                        <div className="w-full flex justify-between">
                            <div className="bg-white rounded-[.8rem] shadow-table-black px-[2rem] py-[.8rem] text-main-gray-text">
                                <p>Total Page : {totalPages}</p>
                            </div>
                            <div className="flex items-center gap-[1rem] bg-white rounded-[.8rem] overflow-hidden shadow-table-black">
                                <button className="px-[1rem] py-[.8rem] text-main font-[500] bg-main-purple hover:bg-main-purple-hover duration-200 active:bg-main-purple" onClick={() => {
                                    if (page > 1) {
                                        setPage(page - 1)
                                    }
                                }}>
                                    Prev
                                </button>
                                <p className="text-main-gray-text">{page}</p>
                                <button className="px-[1rem] py-[.8rem] text-main font-[500] bg-main-purple hover:bg-main-purple-hover duration-200 active:bg-main-purple" onClick={() => {
                                    if (page < totalPages) {
                                        setPage(page + 1)
                                    }
                                }}>
                                    Next
                                </button>
                            </div>
                        </div>
                    )} */}
                    <div className="w-full">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="font-[500] p-[.5rem] text-center">
                                        No
                                    </th>
                                    <th className="font-[500] p-[.5rem] text-start">
                                        Cabang
                                    </th>
                                    <th className="font-[500] p-[.5rem] text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {branchData.map((item, index) => (
                                    <tr>
                                        <td className="p-[.5rem] text-center">
                                            {index + 1}
                                        </td>
                                        <td className="p-[.5rem] text-start">
                                            {item.branch}
                                        </td>
                                        <td className="p-[.5rem] text-start">
                                            <div className="w-full flex justify-center items-center gap-[1rem]">
                                                <button className="bg-blue-100 text-blue-600 py-[.5rem] px-[1rem] font-[600] rounded-[.7rem] hover:bg-blue-200 active:bg-blue-100 text-[.8rem]"
                                                    onClick={() => { setEditData({ value: true, data: { ...item } }) }}
                                                >
                                                    Edit
                                                </button>
                                                <button className="bg-main-pink text-main-red py-[.5rem] px-[1rem] font-[600] rounded-[.7rem] hover:bg-main-pink-hover active:bg-main-pink text-[.8rem]"
                                                    onClick={() => { setModalDelete((prev) => ({ ...prev, title: `Branch in ${item.branch}`, show: true, id: item.id })) }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {loadingFetch && (
                        <div className="w-full flex justify-center py-[4rem]">
                            <div className="flex flex-col items-center text-center gap-[.5rem]">
                                <Loader2 className="animate-spin h-[2rem] w-[2rem]" />
                                <p>Loading...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
