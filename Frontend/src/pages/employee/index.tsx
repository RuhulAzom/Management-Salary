import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL } from "@/env";
import { cn, getDateForInput, getDateString, toastError, token } from "@/lib/utils";
import ModalDelete, { ModalDeleteProps } from "@/components/_sub-components/modal-delete";
import LoadingPageWithText from "@/components/loading/loading-page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EditEmployee from "./edit-employee";

export interface EmployeeProps {
    id: string,
    member: number,
    name: string,
    first_enter: string,
    attendance: number,
    permit: number,
    overtime: number,
    pay_day_data: {
        month: number,
        attendance: number,
        permit: number,
        overtime: number,
        salary: number
    }[],
    total_salary: number,
    createdAt: string,
    updatedAt: string
}

export interface EditEmployeeProps {
    value: boolean,
    data: EmployeeProps | null
}

type Filter = {
    active: boolean,
    show: boolean,
    startDate: string,
    endDate: string
}



export default function Employee() {

    const [filter, setFilter] = useState<Filter>({
        active: false,
        show: false,
        startDate: "",
        endDate: ""
    })

    const [triggerFilter, setTriggerFilter] = useState<number>(0)

    const [data, setData] = useState<EmployeeProps[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [modalDelete, setModalDelete] = useState<ModalDeleteProps>({
        id: "",
        title: "",
        show: false
    })
    const [edit, setEdit] = useState<EditEmployeeProps>({
        value: false,
        data: null
    })

    const [searchValue, setSearchValue] = useState<string>("")
    const [typeSearch, setTypeSearch] = useState<"name" | "member">("name")
    const [page, setPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)

    const getEmployee = async (page: number) => {
        try {
            let res;
            if (filter.active) {
                res = await axios.get(`${API_URL}/employee?start_date=${getDateForInput(filter.startDate)}&end_date=${getDateForInput(filter.endDate)}&page=${page}`, {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                })
            } else {
                res = await axios.get(`${API_URL}/employee?page=${page}`, {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                })
            }

            console.log(res)
            setTotalPages(res.data.total_page)
            setData([...res.data.data])
            return;
        } catch (error: any) {
            console.log("Failed get customer:", error)
            toastError({ error, message: "Failed Get customer" })
            return error
        }
    }

    const searchByType = async ({ page, type }: { page: number, type: "member" | "name" }) => {
        try {
            let res
            if (filter.active) {
                res = await axios.get(`${API_URL}/employee/search?${type}=${searchValue}&start_date=${getDateForInput(filter.startDate)}&end_date=${getDateForInput(filter.endDate)}&page=${page}`, {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                })
            } else {
                res = await axios.get(`${API_URL}/employee/search?${type}=${searchValue}&page=${page}`, {
                    headers: {
                        Authorization: `bearer ${token}`
                    }
                })
            }

            setTotalPages(res.data.total_page)
            setData([...res.data.data])
            return;
        } catch (error) {
            console.log("Failed Search Employee:", error)
            toastError({ error, message: "Failed Search Employee" })
            setData([])
            return error
        }
    }

    useEffect(() => {
        if (searchValue.length === 0) {
            getEmployee(page)
        } else {
            searchByType({ page, type: typeSearch })
        }
    }, [page])

    useEffect(() => {
        if (searchValue.length === 0) {
            getEmployee(page)
        }
    }, [searchValue])

    useEffect(() => {
        getEmployee(1)
    }, [filter.active, triggerFilter])

    const deleteEmployee = async (id: string) => {
        setLoading(true)
        try {
            const res = await axios.delete(`${API_URL}/employee/delete?id=${id}`, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            setLoading(false)
            console.log(res)
            toast.success("Succes To Delete Employee")
            setModalDelete((prev) => ({ ...prev, show: false, id: "" }))
        } catch (error) {
            console.log("Failed delete Employee:", error)
            setLoading(false)
            toast.error("Failed To Delete Employee")
            setModalDelete((prev) => ({ ...prev, show: false, id: "" }))
            return error
        }
    }
    const handleDelete = async () => {
        setModalDelete((prev) => ({ ...prev, show: false }))
        await deleteEmployee(modalDelete.id)
        await getEmployee(page)
    }

    const refresh = async () => {
        setPage(1)
        await getEmployee(1)
    }

    const getDetailHref = (id: string, first_enter?: string): string => {
        if (filter.active) {
            return `/employee/detail/${id}?startDate=${filter.startDate}&endDate=${filter.endDate}`;
        } else if (first_enter) {
            const firstDate = getDateForInput(`${new Date(first_enter)}`);
            const currentDate = getDateForInput(`${new Date()}`)
            return `/employee/detail/${id}?startDate=${firstDate}&endDate=${currentDate}`
        }
        return `undefined`
    }

    return (
        <div className="py-[2rem] px-[1rem] md:px-[4rem] flex flex-col gap-[2rem] bg-body">

            <ModalDelete data={modalDelete} setDelete={setModalDelete} onClick={handleDelete} />
            <LoadingPageWithText heading={`Deleting "${modalDelete.title}"`} loading={loading} />

            {edit.value &&
                <EditEmployee data={edit.data} setEdit={setEdit} refresh={refresh} />
            }

            <div className="flex items-center justify-between w-full">
                <p className="text-[1.5rem] font-[500] text-main-heading-text">
                    Employee
                </p>
                <Link to={"/employee/add"} className="md:hidden shrink-0 bg-main-purple text-main font-[500] px-[1.5rem] py-[.8rem] rounded-[1rem] hover:bg-main-purple-hover active:bg-main-purple duration-200 shadow-table-black">
                    Add Employee
                </Link>
            </div>

            <div className="flex w-full items-center justify-between gap-[1rem]">
                <div className="flex items-center gap-[2rem]">
                    <form className="w-full xl:w-fit relative flex items-center text-main-gray-text" onSubmit={(e) => {
                        e.preventDefault();
                        if (searchValue.length === 0) {
                            toast("Masukan Value Search", { icon: "ℹ️" })
                            return;
                        }

                        setPage(1)
                        searchByType({ page: 1, type: typeSearch })
                    }}>
                        <button className="absolute left-[1rem] text-[1.5rem] hover:scale-125 cursor-pointer active:scale-110 duration-300 flex justify-center items-center">
                            <i className='bx bx-search' />
                        </button>
                        <input type="text" placeholder="Search Items" className="w-full xl:w-[400px] shadow-table-black outline-none bg-white  h-[42px] px-[3rem] rounded-[.8rem] border border-white focus:border-main-gray-border hover:border-main-gray-border duration-300" onChange={(e) => {
                            setSearchValue(e.target.value);
                        }} value={searchValue} />
                        {searchValue.length > 0 &&
                            <i className='bx bx-x absolute right-4 text-[1.5rem] duration-300 hover:bg-main-gray-border rounded-[50%]' onClick={() => { setSearchValue(""); setPage(1) }} />
                        }
                    </form>
                    <Select value={typeSearch} onValueChange={(value) => value && setTypeSearch(value as "member" | "name")}>
                        <SelectTrigger className="flex shrink-0 ml-[-1rem] items-center gap-[.5rem] bg-white w-fit h-[42px] px-[1rem] rounded-[.8rem] shadow-table-black text-main-gray-text cursor-pointer border border-white hover:border-main-gray-border active:border-white duration-300 outline-none select-none">
                            <SelectValue placeholder="Search" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">
                                By Name
                            </SelectItem>
                            <SelectItem value="member">
                                By Member
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="relative">
                        <div className={cn("shadow-table-black outline-none bg-white flex justify-center items-center h-[42px] px-[1.5rem] rounded-[.8rem] border border-white focus:border-main-gray-border hover:border-main-gray-border duration-300 text-main-gray-text cursor-pointer",
                            filter.active && "bg-green-100 text-green-600"
                        )}
                            onClick={() => {
                                setFilter(prev => ({ ...prev, show: true }))
                            }}
                        >
                            Filter
                        </div>
                        {filter.show && (
                            <form className={cn("absolute z-[10] bg-white top-[100%] left-0 shadow-default-black p-[1rem] rounded-[.5rem] flex flex-col gap-[1rem]")} onSubmit={(e) => {
                                e.preventDefault()
                                setFilter(prev => ({ ...prev, active: true }))
                                setTriggerFilter(prev => prev + 1)
                            }}>
                                <div className="flex justify-between gap-[.5rem]">
                                    <div className="input-poster flex flex-col gap-[.5rem]">
                                        <p>
                                            First Date
                                        </p>
                                        <input type="date" className="px-[1rem] py-[.7rem] rounded-[.5rem] outline-none border border-main-gray-border w-full"
                                            value={filter.startDate}
                                            onChange={(e) => {
                                                setFilter(prev => ({ ...prev, startDate: e.target.value }))
                                            }}
                                            required
                                            max={new Date().toISOString().split("T")[0]}
                                        />
                                    </div>
                                    <div className="w-[10px] h-[2px] bg-black my-auto mt-[3.2rem]" />
                                    <div className="input-poster flex flex-col gap-[.5rem]">
                                        <p>
                                            End Date
                                        </p>
                                        <input type="date" className="px-[1rem] py-[.7rem] rounded-[.5rem] outline-none border border-main-gray-border w-full"
                                            value={filter.endDate}
                                            onChange={(e) => {
                                                setFilter(prev => ({ ...prev, endDate: e.target.value }))
                                            }}
                                            required
                                            min={filter.startDate.length > 0 ? filter.startDate : undefined}
                                            max={new Date().toISOString().split("T")[0]}
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex justify-end gap-[1rem]">
                                    <div className={cn("bg-main-purple text-main font-[500] px-[1.5rem] py-[.8rem] rounded-[1rem] hover:bg-main-purple-hover active:bg-main-purple duration-200 shadow-table-black cursor-pointer",
                                        filter.startDate.length === 0 && "bg-main-gray-border2 text-main-gray-text/50 cursor-not-allowed hover:bg-main-gray-border2 active:bg-main-gray-border2",
                                        filter.endDate.length === 0 && "bg-main-gray-border2 text-main-gray-text/50 cursor-not-allowed hover:bg-main-gray-border2 active:bg-main-gray-border2"
                                    )}
                                        onClick={() => {
                                            setFilter({
                                                active: false,
                                                endDate: "",
                                                startDate: "",
                                                show: false
                                            })
                                            setTriggerFilter(prev => prev + 1)
                                        }}
                                    >
                                        Clear
                                    </div>
                                    <button className={cn("bg-main-purple text-main font-[500] px-[1.5rem] py-[.8rem] rounded-[1rem] hover:bg-main-purple-hover active:bg-main-purple duration-200 shadow-table-black",
                                        filter.startDate.length === 0 && "bg-main-gray-border2 text-main-gray-text/50 cursor-not-allowed hover:bg-main-gray-border2 active:bg-main-gray-border2",
                                        filter.endDate.length === 0 && "bg-main-gray-border2 text-main-gray-text/50 cursor-not-allowed hover:bg-main-gray-border2 active:bg-main-gray-border2"
                                    )}>
                                        Submit
                                    </button>
                                </div>
                            </form>
                        )}
                        {filter.show && (
                            <div className="fixed z-[5] bg-transparent w-full h-full top-0 left-0"
                                onClick={() => {
                                    setFilter(prev => ({ ...prev, show: false }))
                                }}
                            />
                        )}
                    </div>
                </div>

                <Link to={"/employee/add"} className="hidden md:block shrink-0 bg-main-purple text-main font-[500] px-[1.5rem] py-[.8rem] rounded-[1rem] hover:bg-main-purple-hover active:bg-main-purple duration-200 shadow-table-black">
                    Add Employee
                </Link>
            </div>


            <div className="bg-body w-full select-none overflow-x-auto text-[75%] md:text-[unset] rounded-[.8rem] overflow-hidden md:rounded-none md:overflow-auto">
                <table className="w-full shadow-table-black rounded-[.8rem]">
                    <thead>
                        <tr className="border-b border-main-gray-border">
                            <th className={`select-text text-center rounded-tl-[.8rem] bg-white p-[1rem] font-[500] md:text-[1rem]`}>
                                No
                            </th>
                            <th className={`select-text text-center bg-white p-[1rem] font-[500] md:text-[1rem]`}>
                                Nama
                            </th>
                            <th className={`select-text text-center bg-white p-[1rem] font-[500] md:text-[1rem]`}>
                                Member
                            </th>
                            <th className={`select-text text-center bg-white p-[1rem] font-[500] md:text-[1rem]`}>
                                First Enter
                            </th>
                            <th className={`select-text text-center bg-white p-[1rem] font-[500] md:text-[1rem]`}>
                                Attendace
                            </th>
                            <th className={`select-text text-center bg-white p-[1rem] font-[500] md:text-[1rem]`}>
                                Permit
                            </th>
                            <th className={`select-text text-center bg-white p-[1rem] font-[500] md:text-[1rem]`}>
                                Overtime
                            </th>
                            <th className={`select-text text-center bg-white p-[1rem] font-[500] md:text-[1rem]`}>
                                Pay Day Salary
                            </th>
                            <th className={`select-text text-center bg-white p-[1rem] font-[500] md:text-[1rem]`}>
                                Total Salary
                            </th>
                            <th className={`select-text text-center rounded-tr-[.8rem] bg-white p-[1rem] font-[500] md:text-[1rem]`}>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item, i: number) => (
                            <tr key={i} className={`border-b ${i === data.length - 1 && "border-none"} border-main-gray-border`}>
                                <td className={`select-text text-center ${i === (data.length - 1) && "rounded-bl-[.8rem]"} bg-white p-[1rem] md:text-[.9rem] font-[400] text-main-gray-text`}>
                                    {(page * 10) + (i + 1) - 10}
                                </td>
                                <td className={`select-text text-center bg-white p-[1rem] md:text-[.9rem] font-[400] text-main-gray-text`}>
                                    {item.name}
                                </td>
                                <td className={`select-text text-center bg-white p-[1rem] md:text-[.9rem] font-[400] text-main-gray-text`}>
                                    {item.member}
                                </td>
                                <td className={`select-text text-center bg-white p-[1rem] md:text-[.9rem] font-[400] text-main-gray-text`}>
                                    {getDateString(item.first_enter)}
                                </td>
                                <td className={`select-text text-center bg-white p-[1rem] md:text-[.9rem] font-[400] text-main-gray-text`}>
                                    {item.attendance}
                                </td>
                                <td className={`select-text text-center bg-white p-[1rem] md:text-[.9rem] font-[400] text-main-gray-text`}>
                                    {item.permit}
                                </td>
                                <td className={`select-text text-center bg-white p-[1rem] md:text-[.9rem] font-[400] text-main-gray-text`}>
                                    {item.overtime}
                                </td>
                                <td className={`select-text text-center bg-white p-[1rem] md:text-[.9rem] font-[400] text-main-gray-text`}>
                                    {item.pay_day_data.length}
                                </td>
                                <td className={`select-text text-center bg-white p-[1rem] md:text-[.9rem] font-[400] text-main-gray-text`}>
                                    {`Rp. ${item.total_salary.toLocaleString("id-ID", { style: "decimal" })}`}
                                </td>
                                <td className={`text-center ${i === (data.length - 1) && "rounded-br-[.8rem]"} bg-white p-[1rem] md:text-[.9rem] font-[400] text-main-gray-text`}>
                                    <div className="flex gap-2 w-full justify-center">
                                        <button className="bg-blue-100 text-blue-600 py-[.8rem] px-[1.5rem] font-[600] rounded-[1rem] hover:bg-blue-200 active:bg-blue-100"
                                            onClick={() => { setEdit({ value: true, data: { ...item } }) }}
                                        >
                                            Edit
                                        </button>
                                        <button className="bg-main-pink text-main-red py-[.8rem] px-[1rem] font-[600] rounded-[1rem] hover:bg-main-pink-hover active:bg-main-pink"
                                            onClick={() => { setModalDelete((prev) => ({ ...prev, title: item.name, show: true, id: item.id })) }}
                                        >
                                            Delete
                                        </button>
                                        <Link to={getDetailHref(item.id, item.first_enter)} className="bg-main-pink text-main-red py-[.8rem] px-[1rem] font-[600] rounded-[1rem] hover:bg-main-pink-hover active:bg-main-pink"
                                            onClick={() => { setModalDelete((prev) => ({ ...prev, title: item.name, show: true, id: item.id })) }}
                                        >
                                            Detail
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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

        </div>
    )
}