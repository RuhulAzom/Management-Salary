import axios from "axios"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"
import { API_URL } from "@/env"
import { getDateString, memberSalary, numberToWords, overtimeSalary, toastError, token } from "@/lib/utils"
import LoadingPageWithText from "@/components/loading/loading-page"
import AddSalary from "./add-salary"
import { Loader2 } from "lucide-react"
import ModalDelete, { ModalDeleteProps } from "@/components/_sub-components/modal-delete"
import EditSalary from "./edit-salary"
import logo from "@/_assets/logo.png"

interface InputDataProps {
    id: string;
    name: string;
    disabled: boolean;
}

export interface EmployeeSalaryProps {
    id: string,
    employee_id: string,
    start_date: string,
    end_date: string,
    member: number,
    attendance: number,
    permit: number,
    permit_data: string,
    overtime: number,
    overtime_data: string,
    overtime_salary: number,
    total_salary: number,
    salary_per_day: number,
    Employee: {
        id: string,
        name: string,
        member: number,
        first_enter: string,
        createdAt: string,
        updatedAt: string
    }
}

export interface EditEmployeeSalaryProps {
    value: boolean,
    data: EmployeeSalaryProps | null
}

export default function Salary() {

    // const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    const employeeId = searchParams.get("employee_id");
    const name = searchParams.get("name");

    const [loading, setLoading] = useState<boolean>(false)
    const [loadingFetch, setLoadingFetch] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)

    // const [searchData, setSearchData] = useState<EmployeeProps[]>([])
    // const [showSearchData, setShowSearchData] = useState<boolean>(false)

    const [employeeSalaryData, setEmployeeSalaryData] = useState<EmployeeSalaryProps[]>([])

    const [printData, setPrintData] = useState<EmployeeSalaryProps | null>(null)

    const [inputData, setInputData] = useState<InputDataProps>({
        id: "",
        name: "",
        disabled: false
    })

    const [editData, setEditData] = useState<EditEmployeeSalaryProps>({
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

    // const getEmployeeData = async () => {
    //     try {
    //         const res = await axios.get(`${API_URL}/employee?page=1`, {
    //             headers: {
    //                 Authorization: `bearer ${token}`
    //             }
    //         })
    //         console.log(res)
    //         setSearchData([...res.data.data])
    //         return;
    //     } catch (error: any) {
    //         console.log("Failed get customer:", error)
    //         toastError({ error, message: "Failed Get customer" })
    //         return error
    //     }
    // }

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

    const getEmployeeSalaryById = async (id: string, page: number) => {
        setLoadingFetch(true)
        try {
            const res = await axios.get(`${API_URL}/employee/salary/${id}?page=${page}`, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            setTotalPages(res.data.total_page)
            setEmployeeSalaryData([...res.data.data])
            setLoadingFetch(false)
            console.log("res", res)
            return;
        } catch (error) {
            console.log("Failed Search Employee:", error)
            toastError({ error, message: "Failed Search Employee" })
            setEmployeeSalaryData([])
            setLoadingFetch(false)
            return error
        }
    }

    const deleteEmployeeSalary = async (id: string) => {
        setLoading(true)
        try {
            const res = await axios.delete(`${API_URL}/employee/salary?id=${id}`, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            setLoading(false)
            console.log(res)
            toast.success("Succes To Delete Employee Salary")
            setModalDelete((prev) => ({ ...prev, show: false, id: "" }))
        } catch (error) {
            console.log("Failed delete Employee Salary:", error)
            setLoading(false)
            toast.error("Failed To Delete Employee Salary")
            setModalDelete((prev) => ({ ...prev, show: false, id: "" }))
            return error
        }
    }

    const handleDelete = async () => {
        setModalDelete((prev) => ({ ...prev, show: false }))
        await deleteEmployeeSalary(modalDelete.id)
        await getEmployeeSalaryById(inputData.id, page)
    }

    const refresh = async () => {
        await getEmployeeSalaryById(inputData.id, page)
    }

    useEffect(() => {
        // getEmployeeData()
        if (employeeId && name) {
            getEmployeeSalaryById(employeeId, 1)
            setInputData(prev => ({
                ...prev,
                name: name,
                id: employeeId,
                disabled: true
            }))
        }
    }, [])

    useEffect(() => {
        if (employeeId && name) {
            getEmployeeSalaryById(employeeId, 1)
            setInputData(prev => ({
                ...prev,
                name: name,
                id: employeeId,
                disabled: true
            }))
        }
    }, [employeeId, name])

    // useEffect(() => {
    //     if (employeeId && name && employeeSalaryData.length > 0) {
    //         setInputData(prev => ({
    //             ...prev,
    //             name: name,
    //             id: employeeId,
    //             disabled: true
    //         }))
    //     }
    // }, [employeeSalaryData])

    // useEffect(() => {
    //     if (inputData.name.length > 0) searchByName()
    //     if (inputData.name.length === 0) getEmployeeData()
    // }, [inputData.name])

    useEffect(() => {
        if (inputData.id.length > 0) getEmployeeSalaryById(inputData.id, page)
    }, [page])

    const handlePrint = () => {
        const print = document.getElementById("printSalary") as HTMLDivElement;
        const content = document.getElementById("contentSalary") as HTMLDivElement;
        print.classList.add("flex", "h-[100vh]", "justify-center", "items-center", "p-[1rem]")

        content.classList.remove("shadow-xl")
        content.classList.add("shadow-print")
        const printContents = print.outerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };


    return (
        <div className="p-0 bg-body">

            <ModalDelete data={modalDelete} setDelete={setModalDelete} onClick={handleDelete} />
            <LoadingPageWithText heading="Deleting Attendance...." loading={loading} />

            {editData.value && (
                <EditSalary
                    data={editData.data}
                    name={inputData.name}
                    refresh={refresh}
                    setEdit={setEditData}
                />
            )}

            {addData.show && (
                <AddSalary
                    employee={addData}
                    onClose={() => {
                        setAddData(prev => ({ ...prev, show: false }))
                    }}
                    refresh={() => {
                        setPage(1)
                        getEmployeeSalaryById(inputData.id, 1)
                    }}
                />
            )}

            {/* <Link to={"/employee"} className="flex gap-[1rem] justify-start items-center mb-[2rem] hover:bg-main-gray-border cursor-pointer select-none w-fit px-[.8rem] rounded-[1rem] duration-300">
                <i className='bx bx-arrow-back text-[1.5rem]' />
                <p className="text-[1.5rem]">
                    Back
                </p>
            </Link> */}

            <div className="rounded-sm bg-white">
                <div className="border-b py-4 px-[1.5rem] w-full flex justify-between items-center">
                    <div className="flex">
                        <div className="pr-4">
                            <h3 className="font-medium text-black dark:text-white">
                                Salary
                            </h3>
                        </div>
                    </div>

                    {inputData.disabled && !loadingFetch && (
                        <button
                            className="bg-main-purple font-[500] hover:bg-main-hover hover:text-white duration-200 text-main py-[.8rem] px-[1rem] rounded-[.8rem]"
                            onClick={() => {
                                setAddData({ id: inputData.id, name: inputData.name, show: true })
                            }}
                        >
                            Add Salary
                        </button>
                    )}
                </div>
                <div className="flex flex-col gap-[1.5rem] p-[1.5rem]">
                    {/* <div className="relative">
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
                                            getEmployeeSalaryById(employe.id, 1)
                                            setInputData(prev => ({
                                                ...prev,
                                                name: employe.name,
                                                id: employe.id,
                                                disabled: true
                                            }))
                                            navigate(`/salary?employee_id=${employe.id}&name=${employe.name}`)
                                        }}
                                    >
                                        {employe.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div> */}
                    {/* 
                    {inputData.disabled && !loadingFetch && (
                        <div className="flex justify-end p-4">
                            <button
                                className="bg-main-purple font-[500] hover:bg-main-hover hover:text-white duration-200 text-main py-[.8rem] px-[1rem] rounded-[.8rem]"
                                onClick={() => {
                                    setAddData({ id: inputData.id, name: inputData.name, show: true })
                                }}
                            >
                                Add Salary
                            </button>
                        </div>
                    )} */}

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
                                            Member
                                        </th>
                                        <th className="font-[500] p-[.5rem] text-start">
                                            Attendance
                                        </th>
                                        <th className="font-[500] p-[.5rem] text-start">
                                            Permit
                                        </th>
                                        <th className="font-[500] p-[.5rem] text-start">
                                            Overtime
                                        </th>
                                        <th className="font-[500] p-[.5rem] text-start">
                                            Salary/day
                                        </th>
                                        <th className="font-[500] p-[.5rem] text-start">
                                            Total Salary
                                        </th>
                                        <th className="font-[500] p-[.5rem] text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeeSalaryData.map((item, index) => (
                                        <tr>
                                            <td className="p-[.5rem] text-center">
                                                {(page * 5) + (index + 1) - 5}
                                            </td>
                                            <td className="p-[.5rem] text-start">
                                                {getDateString(item.start_date)} - {getDateString(item.end_date)}
                                            </td>
                                            <td className="p-[.5rem] text-start">
                                                {item.member}
                                            </td>
                                            <td className="p-[.5rem] text-start">
                                                {item.attendance}
                                            </td>
                                            <td className="p-[.5rem] text-start">
                                                {item.permit}
                                            </td>
                                            <td className="p-[.5rem] text-start">
                                                {item.overtime}
                                            </td>
                                            <td className="p-[.5rem] text-start">
                                                Rp. {item.salary_per_day.toLocaleString("id-ID", { style: "decimal" })}
                                            </td>
                                            <td className="p-[.5rem] text-start">
                                                Rp. {item.total_salary.toLocaleString("id-ID", { style: "decimal" })}
                                            </td>
                                            <td className="p-[.5rem] text-start">
                                                <div className="w-full flex justify-center items-center gap-[.5rem]">
                                                    <button className="bg-blue-100 text-blue-600 py-[.5rem] px-[1rem] font-[600] rounded-[.7rem] hover:bg-blue-200 active:bg-blue-100 text-[.8rem]"
                                                        onClick={() => { setEditData({ value: true, data: { ...item } }) }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button className="bg-main-pink text-main-red py-[.5rem] px-[1rem] font-[600] rounded-[.7rem] hover:bg-main-pink-hover active:bg-main-pink text-[.8rem]"
                                                        onClick={() => { setModalDelete((prev) => ({ ...prev, title: `Salary ${getDateString(item.start_date)} - ${getDateString(item.end_date)}`, show: true, id: item.id })) }}
                                                    >
                                                        Delete
                                                    </button>
                                                    <button className="bg-green-100 text-green-600 py-[.5rem] px-[1rem] font-[600] rounded-[.7rem] hover:bg-green-200 active:bg-green-100 text-[.8rem]"
                                                        onClick={() => {
                                                            setPrintData({
                                                                ...item
                                                            })
                                                        }}
                                                    >
                                                        Show
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

            {printData && (
                <div className="w-full flex flex-col items-center mt-[5rem] pb-[5rem]">
                    <div className="w-full max-w-[800px] flex justify-end mb-[1rem]">
                        <button className="flex items-center gap-[.5rem] bg-main-hover px-[1.5rem] py-[.8rem] rounded-[2rem] font-[500] text-white duration-300 hover:bg-[#5d5fef9d]" onClick={() => { handlePrint() }}>
                            <i className='bx bx-printer text-[1.5rem]'></i>
                            Print
                        </button>
                    </div>
                    <div id="printSalary" className="w-full max-w-[800px]">
                        <div id="contentSalary" className="rounded-sm bg-white shadow-xl w-full">
                            <div className="flex p-[1rem] items-center justify-between text-[1.2rem] font-[500] border-b border-main-gray-border select-none">
                                <div className="flex gap-[.5rem] items-center">
                                    <img src={logo} alt="" className="w-[10rem]" />
                                </div>
                                <p className="sansita select-text"><span className="text-main-gray-text ">Slip Gaji Nazea Mart </span></p>
                            </div>
                            <div className="p-[2rem] flex flex-col gap-[1rem]">
                                <div id="staff" className="flex flex-col">
                                    <div className="bg-main-hover px-[1rem] py-[.5rem] text-white font-[600]">
                                        <p>Staff</p>
                                    </div>
                                    <div className="grid grid-cols-3 border border-b-0 border-main-gray-border">
                                        <div id="title" className="col-span-1 px-[1rem] py-[.2rem] font-[600] border-b border-main-gray-border">
                                            <p>Nama</p>
                                        </div>
                                        <div id="field" className="col-span-2 px-[1rem] py-[.2rem] border-l border-b border-main-gray-border">
                                            <p className="break-words">{printData.Employee.name}</p>
                                        </div>

                                        <div id="title" className="col-span-1 px-[1rem] py-[.2rem] font-[600] border-b border-main-gray-border">
                                            <p>Member</p>
                                        </div>
                                        <div id="field" className="col-span-2 px-[1rem] py-[.2rem] border-l border-b border-main-gray-border">
                                            <p className="break-words">{printData.member}</p>
                                        </div>

                                        <div id="title" className="col-span-1 px-[1rem] py-[.2rem] font-[600] border-b border-main-gray-border">
                                            <p>Alamat</p>
                                        </div>
                                        <div id="field" className="col-span-2 px-[1rem] py-[.2rem] border-l border-b border-main-gray-border">
                                            <p className="break-words">...</p>
                                        </div>
                                    </div>
                                </div>
                                <div id="detail" className="flex flex-col">
                                    <div className="bg-main-hover px-[1rem] py-[.5rem] text-white font-[600]">
                                        <p>{getDateString(printData.start_date)} - {getDateString(printData.end_date)}</p>
                                    </div>

                                    <div className="grid grid-cols-3 border border-b-0 border-main-gray-border">
                                        <div id="title" className="px-[1rem] py-[.2rem] bg-main-gray-border font-[600]">
                                            <p>Attendance</p>
                                        </div>
                                        <div id="field" className="px-[1rem] py-[.2rem] bg-main-gray-border font-[600]">
                                            <p>Permit</p>
                                        </div>
                                        <div id="field" className="px-[1rem] py-[.2rem] bg-main-gray-border font-[600]">
                                            <p>Overtime</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 border border-b-0 border-main-gray-border">
                                        <div id="title" className="px-[1rem] py-[.2rem] border-l border-b border-main-gray-border font-[600]">
                                            <div className="grid grid-cols-2">
                                                <p>{printData.attendance}</p>
                                            </div>
                                        </div>
                                        <div id="field" className="px-[1rem] py-[.2rem] border-l border-b border-main-gray-border font-[600]">
                                            <p>
                                                {printData.permit}{" "}
                                                {printData.permit_data.length > 0 && (
                                                    <span>({printData.permit_data})</span>
                                                )}

                                            </p>
                                        </div>
                                        <div id="field" className="px-[1rem] py-[.2rem] border-l border-b border-r border-main-gray-border font-[600]">
                                            <p>
                                                {printData.overtime}{" "}
                                                {printData.overtime_data.length > 0 && (
                                                    <span>({printData.overtime_data})</span>
                                                )}

                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 border border-b-0 border-main-gray-border">
                                        <div id="title" className="px-[1rem] py-[.2rem] bg-main-gray-border font-[600]">
                                            <p>Type</p>
                                        </div>
                                        <div id="field" className="px-[1rem] py-[.2rem] bg-main-gray-border font-[600]">
                                            <p>Calculasi</p>
                                        </div>
                                        <div id="field" className="px-[1rem] py-[.2rem] bg-main-gray-border font-[600]">
                                            <p>Total</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 border border-b-0 border-main-gray-border">
                                        <div id="title" className="px-[1rem] py-[.2rem] border-l border-b border-main-gray-border font-[600]">
                                            <div className="grid grid-cols-2">
                                                <p>Overtime</p>
                                            </div>
                                        </div>
                                        <div id="field" className="px-[1rem] py-[.2rem] border-l border-b border-main-gray-border font-[600]">
                                            <p>{printData.overtime}x Rp. {overtimeSalary.toLocaleString("id-ID", { style: "decimal" })}</p>
                                        </div>
                                        <div id="field" className="px-[1rem] py-[.2rem] border-l border-b border-r border-main-gray-border font-[600]">
                                            <p>Rp {printData.overtime_salary.toLocaleString("id-ID", { style: "decimal" })}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 border border-b-0 border-main-gray-border">
                                        <div id="title" className="px-[1rem] py-[.2rem] border-l border-b border-main-gray-border font-[600]">
                                            <div className="grid grid-cols-2">
                                                <p>Attendance</p>
                                            </div>
                                        </div>
                                        <div id="field" className="px-[1rem] py-[.2rem] border-l border-b border-main-gray-border font-[600]">
                                            <p>{printData.attendance}x Rp. {printData.salary_per_day.toLocaleString("id-ID", { style: "decimal" })}</p>
                                        </div>
                                        <div id="field" className="px-[1rem] py-[.2rem] border-l border-b border-r border-main-gray-border font-[600]">
                                            <p>Rp {(printData.attendance * printData.salary_per_day).toLocaleString("id-ID", { style: "decimal" })}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 border border-b-0 border-main-gray-border">
                                        <div id="title" className="px-[1rem] py-[.2rem] border-l border-b border-main-gray-border font-[600]">
                                            <div className="grid grid-cols-2">
                                                <p>Member</p>
                                            </div>
                                        </div>
                                        <div id="field" className="px-[1rem] py-[.2rem] border-l border-b border-main-gray-border font-[600]">
                                            <p>{printData.member}x Rp. {memberSalary.toLocaleString("id-ID", { style: "decimal" })}</p>
                                        </div>
                                        <div id="field" className="px-[1rem] py-[.2rem] border-l border-b border-r border-main-gray-border font-[600]">
                                            <p>Rp {(printData.member * memberSalary).toLocaleString("id-ID", { style: "decimal" })}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 border-main-gray-border relative">
                                        <div className="absolute top-[100%] left-0 font-[500]">
                                            Terbilang : {numberToWords(printData.total_salary)} Rupiah
                                        </div>
                                        <div id="field" className="col-span-2 px-[1rem] py-[.2rem] border-l border-b border-main-gray-border bg-main-gray-border2 font-[600]">
                                            <p className="break-words text-center">Total</p>
                                        </div>
                                        <div id="field" className="col-span-1 px-[1rem] py-[.2rem] border-l border-b border-r border-main-gray-border bg-main-gray-border2 font-[600]">
                                            <p className="break-words">
                                                {printData.total_salary.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div className="w-full flex justify-end px-[2rem] pb-[2rem]">
                                <div className="flex justify-center items-center font-[500] flex-col gap-[5rem]">
                                    <p>Padang, {getDateString(new Date())}</p>
                                    <div className="text-center">
                                        <p className="underline">{printData.Employee.name}</p>
                                        <p className="font-[400]">Karyawan</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-main-gray-border p-[1rem] text-[1.2rem] font-[500] flex justify-between">
                                <p className="sansita text-main-gray-text">Best Market - Nazea Mart</p>
                                <p className="sansita text-main-gray-text">Jl. Dr. Sutomo No.151 B</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

