import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { API_URL } from "@/env"
import { getDateString, toastError, token } from "@/lib/utils"
import InputText from "@/components/_sub-components/input-text"
import LoadingPageWithText from "@/components/loading/loading-page"
import { EmployeeProps } from "../employee"
import AddAttendance from "./add-attendance"
import { Loader2 } from "lucide-react"
import ModalDelete, { ModalDeleteProps } from "@/components/_sub-components/modal-delete"
import EditAttendance from "./edit-attendance"

interface InputDataProps {
    id: string;
    name: string;
    disabled: boolean;
}

export interface AttendanceDataProps {
    id: string,
    employee_id: string,
    type: "PERMIT" | "OVERTIME",
    date: string,
    createdAt: string,
    updatedAt: string
}

export interface EditAttendanceProps {
    value: boolean,
    data: AttendanceDataProps | null
}

export default function Attendance() {

    const [loading, setLoading] = useState<boolean>(false)
    const [loadingFetch, setLoadingFetch] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)

    const [searchData, setSearchData] = useState<EmployeeProps[]>([])
    const [showSearchData, setShowSearchData] = useState<boolean>(false)

    const [attendanceData, setAttendanceData] = useState<AttendanceDataProps[]>([])

    const [inputData, setInputData] = useState<InputDataProps>({
        id: "",
        name: "",
        disabled: false
    })

    const [editData, setEditData] = useState<EditAttendanceProps>({
        value: false,
        data: null
    })

    const [addData, setAddData] = useState<{ id: string, name: string, show: boolean }>({
        id: "",
        name: "",
        show: false
    })

    const [modalDelete, setModalDelete] = useState<ModalDeleteProps>({
        id: "",
        title: "",
        show: false
    })

    const getEmployeeData = async () => {
        try {
            const res = await axios.get(`${API_URL}/employee?page=1`, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            console.log(res)
            setSearchData([...res.data.data])
            return;
        } catch (error: any) {
            console.log("Failed get customer:", error)
            toastError({ error, message: "Failed Get customer" })
            return error
        }
    }

    const searchByName = async () => {
        try {
            const res = await axios.get(`${API_URL}/employee/search?name=${inputData.name}&page=1`, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            console.log("1111", res)
            setSearchData([...res.data.data])
            return;
        } catch (error) {
            console.log("Failed Search Employee:", error)
            // toastError({ error, message: "Failed Search Employee" })
            setSearchData([])
            return error
        }
    }

    const getAttendanceById = async (id: string, page: number) => {
        setLoadingFetch(true)
        try {
            const res = await axios.get(`${API_URL}/attendance?employee_id=${id}&page=${page}`, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            setTotalPages(res.data.total_page)
            setAttendanceData([...res.data.data])
            setLoadingFetch(false)
            return;
        } catch (error) {
            console.log("Failed Search Employee:", error)
            toastError({ error, message: "Failed Search Employee" })
            setAttendanceData([])
            setLoadingFetch(false)
            return error
        }
    }

    const deleteAttendance = async (id: string) => {
        setLoading(true)
        try {
            const res = await axios.delete(`${API_URL}/attendance/delete?id=${id}`, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            setLoading(false)
            console.log(res)
            toast.success("Succes To Delete Attendance")
            setModalDelete((prev) => ({ ...prev, show: false, id: "" }))
        } catch (error) {
            console.log("Failed delete Attendance:", error)
            setLoading(false)
            toast.error("Failed To Delete Attendance")
            setModalDelete((prev) => ({ ...prev, show: false, id: "" }))
            return error
        }
    }

    const handleDelete = async () => {
        setModalDelete((prev) => ({ ...prev, show: false }))
        await deleteAttendance(modalDelete.id)
        await getAttendanceById(inputData.id, page)
    }

    const refresh = async () => {
        await getAttendanceById(inputData.id, page)
    }

    useEffect(() => {
        getEmployeeData()
    }, [])

    useEffect(() => {
        if (inputData.name.length > 0) searchByName()
        if (inputData.name.length === 0) getEmployeeData()
    }, [inputData.name])

    useEffect(() => {
        if (inputData.id.length > 0) getAttendanceById(inputData.id, page)
    }, [page])


    return (
        <div className="px-[1rem] md:px-[4rem] py-[2rem] bg-body">

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

            {addData.show && (
                <AddAttendance
                    employee={addData}
                    onClose={() => {
                        setAddData(prev => ({ ...prev, show: false }))
                    }}
                    refresh={() => {
                        setPage(1)
                        getAttendanceById(inputData.id, 1)
                    }}
                />
            )}

            <Link to={"/employee"} className="flex gap-[1rem] justify-start items-center mb-[2rem] hover:bg-main-gray-border cursor-pointer select-none w-fit px-[.8rem] rounded-[1rem] duration-300">
                <i className='bx bx-arrow-back text-[1.5rem]' />
                <p className="text-[1.5rem]">
                    Back
                </p>
            </Link>

            <div className="rounded-sm bg-white shadow-xl">
                <div className="border-b py-4 px-[1.5rem]">
                    <div className="flex">
                        <div className="pr-4">
                            <h3 className="font-medium text-black dark:text-white">
                                Attendance
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-[1.5rem] p-[1.5rem]">
                    <div className="relative">
                        {inputData.disabled && (
                            <div className="absolute top-[.2rem] left-[3.5rem] text-[.7rem] bg-main text-white py-[.2rem] px-[1rem] rounded-[.5rem] cursor-pointer hover:bg-main-hover active:bg-main"
                                onClick={() => {

                                    setInputData(prev => ({
                                        ...prev,
                                        id: "",
                                        disabled: false
                                    }))
                                }}
                            >
                                <p>Change</p>
                            </div>
                        )}
                        <InputText
                            heading="Name"
                            placeholder="Input Name..."
                            value={inputData.name}
                            required
                            disabled={inputData.disabled}
                            onFocus={() => { setShowSearchData(true) }}
                            onBlur={() => {
                                setTimeout(() => {
                                    setShowSearchData(false)
                                }, 100);
                            }}
                            onChange={(e) => {
                                setInputData(prev => ({ ...prev, name: e.target.value }))
                            }}
                        />
                        {showSearchData && (
                            <div className="absolute w-full h-fit top-[100%] left-0 flex flex-col bg-white border rounded-[.5rem]">
                                {searchData.map((employe) => (
                                    <div className="p-[.5rem] hover:bg-main-hover hover:text-white"
                                        onClick={() => {
                                            setPage(1)
                                            getAttendanceById(employe.id, 1)
                                            setInputData(prev => ({
                                                ...prev,
                                                name: employe.name,
                                                id: employe.id,
                                                disabled: true
                                            }))
                                        }}
                                    >
                                        {employe.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {inputData.disabled && !loadingFetch && (
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
                    )}

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



// import axios from "axios"
// import { useEffect, useState } from "react"
// import { Link } from "react-router-dom"
// import toast from "react-hot-toast"
// import { API_URL } from "@/env"
// import { getDateString, toastError, token } from "@/lib/utils"
// import InputText from "@/components/_sub-components/input-text"
// import LoadingPageWithText from "@/components/loading/loading-page"
// import { EmployeeProps } from "../employee"
// import AddAttendance from "./add-attendance"
// import { Loader2 } from "lucide-react"
// import ModalDelete, { ModalDeleteProps } from "@/components/_sub-components/modal-delete"
// import EditAttendance from "./edit-attendance"

// interface InputDataProps {
//     id: string;
//     name: string;
//     disabled: boolean;
// }

// export interface AttendanceDataProps {
//     id: string,
//     employee_id: string,
//     type: "PERMIT" | "OVERTIME",
//     date: string,
//     createdAt: string,
//     updatedAt: string
// }

// export interface EditAttendanceProps {
//     value: boolean,
//     data: AttendanceDataProps | null
// }

// export default function Attendance() {

//     const [loading, setLoading] = useState<boolean>(false)
//     const [loadingFetch, setLoadingFetch] = useState<boolean>(false)
//     const [page, setPage] = useState<number>(1)
//     const [totalPages, setTotalPages] = useState<number>(1)

//     const [searchData, setSearchData] = useState<EmployeeProps[]>([])
//     const [showSearchData, setShowSearchData] = useState<boolean>(false)

//     const [attendanceData, setAttendanceData] = useState<AttendanceDataProps[]>([])

//     const [inputData, setInputData] = useState<InputDataProps>({
//         id: "",
//         name: "",
//         disabled: false
//     })

//     const [editData, setEditData] = useState<EditAttendanceProps>({
//         value: false,
//         data: null
//     })

//     const [addData, setAddData] = useState<{ id: string, name: string, show: boolean }>({
//         id: "",
//         name: "",
//         show: false
//     })

//     const [modalDelete, setModalDelete] = useState<ModalDeleteProps>({
//         id: "",
//         title: "",
//         show: false
//     })

//     const getEmployeeData = async () => {
//         try {
//             const res = await axios.get(`${API_URL}/employee?page=1`, {
//                 headers: {
//                     Authorization: `bearer ${token}`
//                 }
//             })
//             console.log(res)
//             setSearchData([...res.data.data])
//             return;
//         } catch (error: any) {
//             console.log("Failed get customer:", error)
//             toastError({ error, message: "Failed Get customer" })
//             return error
//         }
//     }

//     const searchByName = async () => {
//         try {
//             const res = await axios.get(`${API_URL}/employee/search?name=${inputData.name}&page=1`, {
//                 headers: {
//                     Authorization: `bearer ${token}`
//                 }
//             })
//             console.log("1111", res)
//             setSearchData([...res.data.data])
//             return;
//         } catch (error) {
//             console.log("Failed Search Employee:", error)
//             // toastError({ error, message: "Failed Search Employee" })
//             setSearchData([])
//             return error
//         }
//     }

//     const getAttendanceById = async (id: string, page: number) => {
//         setLoadingFetch(true)
//         try {
//             const res = await axios.get(`${API_URL}/attendance?employee_id=${id}&page=${page}`, {
//                 headers: {
//                     Authorization: `bearer ${token}`
//                 }
//             })
//             setTotalPages(res.data.total_page)
//             setAttendanceData([...res.data.data])
//             setLoadingFetch(false)
//             return;
//         } catch (error) {
//             console.log("Failed Search Employee:", error)
//             toastError({ error, message: "Failed Search Employee" })
//             setAttendanceData([])
//             setLoadingFetch(false)
//             return error
//         }
//     }

//     const deleteAttendance = async (id: string) => {
//         setLoading(true)
//         try {
//             const res = await axios.delete(`${API_URL}/attendance/delete?id=${id}`, {
//                 headers: {
//                     Authorization: `bearer ${token}`
//                 }
//             })
//             setLoading(false)
//             console.log(res)
//             toast.success("Succes To Delete Attendance")
//             setModalDelete((prev) => ({ ...prev, show: false, id: "" }))
//         } catch (error) {
//             console.log("Failed delete Attendance:", error)
//             setLoading(false)
//             toast.error("Failed To Delete Attendance")
//             setModalDelete((prev) => ({ ...prev, show: false, id: "" }))
//             return error
//         }
//     }

//     const handleDelete = async () => {
//         setModalDelete((prev) => ({ ...prev, show: false }))
//         await deleteAttendance(modalDelete.id)
//         await getAttendanceById(inputData.id, page)
//     }

//     const refresh = async () => {
//         await getAttendanceById(inputData.id, page)
//     }

//     useEffect(() => {
//         getEmployeeData()
//     }, [])

//     useEffect(() => {
//         if (inputData.name.length > 0) searchByName()
//         if (inputData.name.length === 0) getEmployeeData()
//     }, [inputData.name])

//     useEffect(() => {
//         if (inputData.id.length > 0) getAttendanceById(inputData.id, page)
//     }, [page])


//     return (
//         <div className="px-[1rem] md:px-[4rem] py-[2rem] bg-body">

//             <ModalDelete data={modalDelete} setDelete={setModalDelete} onClick={handleDelete} />
//             <LoadingPageWithText heading="Deleting Attendance...." loading={loading} />

//             {editData.value && (
//                 <EditAttendance
//                     data={editData.data}
//                     name={inputData.name}
//                     refresh={refresh}
//                     setEdit={setEditData}
//                 />
//             )}

//             {addData.show && (
//                 <AddAttendance
//                     employee={addData}
//                     onClose={() => {
//                         setAddData(prev => ({ ...prev, show: false }))
//                     }}
//                     refresh={() => {
//                         setPage(1)
//                         getAttendanceById(inputData.id, 1)
//                     }}
//                 />
//             )}

//             <Link to={"/employee"} className="flex gap-[1rem] justify-start items-center mb-[2rem] hover:bg-main-gray-border cursor-pointer select-none w-fit px-[.8rem] rounded-[1rem] duration-300">
//                 <i className='bx bx-arrow-back text-[1.5rem]' />
//                 <p className="text-[1.5rem]">
//                     Back
//                 </p>
//             </Link>

//             <div className="rounded-sm bg-white shadow-xl">
//                 <div className="border-b py-4 px-[1.5rem]">
//                     <div className="flex">
//                         <div className="pr-4">
//                             <h3 className="font-medium text-black dark:text-white">
//                                 Attendance
//                             </h3>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="flex flex-col gap-[1.5rem] p-[1.5rem]"
//                     onSubmit={(e) => { e.preventDefault() }}
//                 >
//                     <div className="relative">
//                         {inputData.disabled && (
//                             <div className="absolute top-[.2rem] left-[3.5rem] text-[.7rem] bg-main text-white py-[.2rem] px-[1rem] rounded-[.5rem] cursor-pointer hover:bg-main-hover active:bg-main"
//                                 onClick={() => {

//                                     setInputData(prev => ({
//                                         ...prev,
//                                         id: "",
//                                         disabled: false
//                                     }))
//                                 }}
//                             >
//                                 <p>Change</p>
//                             </div>
//                         )}
//                         <InputText
//                             heading="Name"
//                             placeholder="Input Name..."
//                             value={inputData.name}
//                             required
//                             disabled={inputData.disabled}
//                             onFocus={() => { setShowSearchData(true) }}
//                             onBlur={() => {
//                                 setTimeout(() => {
//                                     setShowSearchData(false)
//                                 }, 100);
//                             }}
//                             onChange={(e) => {
//                                 setInputData(prev => ({ ...prev, name: e.target.value }))
//                             }}
//                         />
//                         {showSearchData && (
//                             <div className="absolute w-full h-fit top-[100%] left-0 flex flex-col bg-white border rounded-[.5rem]">
//                                 {searchData.map((employe) => (
//                                     <div className="p-[.5rem] hover:bg-main-hover hover:text-white"
//                                         onClick={() => {
//                                             setPage(1)
//                                             getAttendanceById(employe.id, 1)
//                                             setInputData(prev => ({
//                                                 ...prev,
//                                                 name: employe.name,
//                                                 id: employe.id,
//                                                 disabled: true
//                                             }))
//                                         }}
//                                     >
//                                         {employe.name}
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {inputData.disabled && !loadingFetch && (
//                         <div className="flex justify-end p-4">
//                             <button
//                                 className="bg-main-purple font-[500] hover:bg-main-hover hover:text-white duration-200 text-main py-[.8rem] px-[1rem] rounded-[.8rem]"
//                                 onClick={() => {
//                                     setAddData({ id: inputData.id, name: inputData.name, show: true })
//                                 }}
//                             >
//                                 Add Attendance
//                             </button>
//                         </div>
//                     )}

//                     {inputData.disabled && !loadingFetch && (
//                         <div className="w-full">
//                             <table className="w-full">
//                                 <thead>
//                                     <tr>
//                                         <th className="font-[500] p-[.5rem] text-center">
//                                             No
//                                         </th>
//                                         <th className="font-[500] p-[.5rem] text-start">
//                                             Date
//                                         </th>
//                                         <th className="font-[500] p-[.5rem] text-start">
//                                             Description
//                                         </th>
//                                         <th className="font-[500] p-[.5rem] text-center">
//                                             Action
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {attendanceData.map((item, index) => (
//                                         <tr>
//                                             <td className="p-[.5rem] text-center">
//                                                 {index + 1}
//                                             </td>
//                                             <td className="p-[.5rem] text-start">
//                                                 {getDateString(item.date)}
//                                             </td>
//                                             <td className="p-[.5rem] text-start">
//                                                 {item.type}
//                                             </td>
//                                             <td className="p-[.5rem] text-start">
//                                                 <div className="w-full flex justify-center items-center gap-[1rem]">
//                                                     <button className="bg-blue-100 text-blue-600 py-[.5rem] px-[1rem] font-[600] rounded-[.7rem] hover:bg-blue-200 active:bg-blue-100 text-[.8rem]"
//                                                         onClick={() => { setEditData({ value: true, data: { ...item } }) }}
//                                                     >
//                                                         Edit
//                                                     </button>
//                                                     <button className="bg-main-pink text-main-red py-[.5rem] px-[1rem] font-[600] rounded-[.7rem] hover:bg-main-pink-hover active:bg-main-pink text-[.8rem]"
//                                                         onClick={() => { setModalDelete((prev) => ({ ...prev, title: `Attendance in ${getDateString(item.date)}`, show: true, id: item.id })) }}
//                                                     >
//                                                         Delete
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                     {inputData.disabled && !loadingFetch && (
//                         <div className="w-full flex justify-between">
//                             <div className="bg-white rounded-[.8rem] shadow-table-black px-[2rem] py-[.8rem] text-main-gray-text">
//                                 <p>Total Page : {totalPages}</p>
//                             </div>
//                             <div className="flex items-center gap-[1rem] bg-white rounded-[.8rem] overflow-hidden shadow-table-black">
//                                 <button className="px-[1rem] py-[.8rem] text-main font-[500] bg-main-purple hover:bg-main-purple-hover duration-200 active:bg-main-purple" onClick={() => {
//                                     if (page > 1) {
//                                         setPage(page - 1)
//                                     }
//                                 }}>
//                                     Prev
//                                 </button>
//                                 <p className="text-main-gray-text">{page}</p>
//                                 <button className="px-[1rem] py-[.8rem] text-main font-[500] bg-main-purple hover:bg-main-purple-hover duration-200 active:bg-main-purple" onClick={() => {
//                                     if (page < totalPages) {
//                                         setPage(page + 1)
//                                     }
//                                 }}>
//                                     Next
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     {loadingFetch && (
//                         <div className="w-full flex justify-center py-[4rem]">
//                             <div className="flex flex-col items-center text-center gap-[.5rem]">
//                                 <Loader2 className="animate-spin h-[2rem] w-[2rem]" />
//                                 <p>Loading...</p>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

