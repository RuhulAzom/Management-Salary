import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import logo from "@/_assets/logo.png"
import toast from "react-hot-toast"
import { API_URL } from "@/env"
import { cn, getDateGroup, getDateString, member, overtimeSalary, token } from "@/lib/utils"
import LoadingPageWithText from "@/components/loading/loading-page"

interface DataProps {
    id: string,
    name: string
    first_enter: string,
    member: number,
    createdAt: string,
    updatedAt: string,
    attendance: number,
    permit: number,
    permit_data: string[],
    overtime: number,
    overtime_data: string[],
    overtime_salary: number,
    pay_day_data: {
        month: string,
        date: string,
        attendance: number,
        permit: number,
        permit_data: string[],
        overtime: number,
        overtime_data: string[],
        salary: number
    }[],
    total_salary: number,
    first_second_salary: number
}

type Filter = {
    active: boolean,
    show: boolean,
    startDate: string,
    endDate: string
}



export default function DetailSalaryEmployee() {
    const { id } = useParams()
    const [searchParams, setSearchParams] = useSearchParams();

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const [data, setData] = useState<DataProps | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const [filter, setFilter] = useState<Filter>({
        active: false,
        show: false,
        startDate: "",
        endDate: ""
    })


    const getDetailTransaction = async () => {
        if (!startDate || !endDate) return
        setLoading(true)
        try {
            const res = await axios.get(`${API_URL}/employee/detail/${id}?start_date=${startDate}&end_date=${endDate}`, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            console.log(res)
            setData({ ...res.data.data })
            setLoading(false)
            return;
        } catch (error) {
            console.log("Failed get Detail Transactions:", error)
            setLoading(false)
            return error
        }
    }

    useEffect(() => {
        if (startDate && endDate) {
            const startDateMonth = `${startDate.split("-")[0]}-${(parseInt(startDate.split("-")[1]) + 1).toString().padStart(2, "0")}`
            const endDateMonth = `${endDate.split("-")[0]}-${endDate.split("-")[1].padStart(2, "0")}`
            setFilter(prev => ({ ...prev, startDate: startDateMonth, endDate: endDateMonth }))
        }
        getDetailTransaction()
    }, [])

    console.log({ filter })

    const handleFilter = () => {
        if (!data) {
            toast.error("Error, Try again..")
            return
        }
        const payDate = new Date(data.first_enter).getDate().toString().padStart(2, "0")
        const newParams = new URLSearchParams(searchParams)
        const year = filter.startDate.split("-")[0]
        const month = (parseInt(filter.startDate.split("-")[1]) - 1).toString().padStart(2, "0")
        newParams.set("startDate", `${year}-${month}-${payDate}`)
        newParams.set("endDate", `${filter.endDate}-${payDate}`)
        setSearchParams(newParams)
    }

    useEffect(() => {
        getDetailTransaction()
    }, [searchParams])

    console.log({ id, startDate, endDate, data })

    const handlePrint = () => {
        const print = document.getElementById("printDiv") as HTMLDivElement;
        const content = document.getElementById("content") as HTMLDivElement;
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

    if (!data) return <div>loading...</div>
    return (
        <div className="px-[1rem] md:px-[4rem] py-[2rem] flex flex-col items-center bg-body">
            <LoadingPageWithText heading="Loading...." loading={loading} />
            <div className="w-full flex mb-[1rem] justify-between">
                <Link to={"/employee"} className="flex gap-[1rem] justify-start items-center hover:bg-main-gray-border cursor-pointer select-none w-fit px-[.8rem] rounded-[1rem] duration-300">
                    <i className='bx bx-arrow-back text-[1.5rem]' />
                    <p className="text-[1.5rem]">
                        Back
                    </p>
                </Link>
                <div className="flex items-center gap-[1rem]">
                    <div className="relative">
                        <div className={cn("shadow-table-black outline-none bg-white flex justify-center items-center gap-[.5rem] h-[42px] px-[1.5rem] rounded-[.8rem] border border-white focus:border-main-gray-border hover:border-main-gray-border duration-300 text-main-gray-text cursor-pointer",
                            filter.active && "bg-green-100 text-green-600"
                        )}
                            onClick={() => {
                                setFilter(prev => ({ ...prev, show: true }))
                            }}
                        >
                            <i className='bx bx-filter text-[1.5rem]'></i>
                            <p>Filter Salary</p>
                        </div>
                        {filter.show && (
                            <form className={cn("absolute z-[10] bg-white top-[100%] right-0 shadow-default-black p-[1rem] rounded-[.5rem] flex flex-col gap-[1rem]")} onSubmit={(e) => {
                                e.preventDefault()
                                setFilter(prev => ({ ...prev, active: true }))
                                handleFilter()
                            }}>
                                <div className="flex justify-between gap-[.5rem]">
                                    <div className="input-poster flex flex-col gap-[.5rem]">
                                        <p>
                                            First Month
                                        </p>
                                        <input type="month" className="px-[1rem] py-[.7rem] rounded-[.5rem] outline-none border border-main-gray-border w-full"
                                            value={filter.startDate}
                                            onChange={(e) => {
                                                setFilter(prev => ({ ...prev, startDate: e.target.value }))
                                            }}
                                            required
                                            min={`${data.first_enter.split("-")[0]}-${data.first_enter.split("-")[1]}`}
                                        />
                                    </div>
                                    <div className="w-[10px] h-[2px] bg-black my-auto mt-[3.2rem]" />
                                    <div className="input-poster flex flex-col gap-[.5rem]">
                                        <p>
                                            End Month
                                        </p>
                                        <input type="month" className="px-[1rem] py-[.7rem] rounded-[.5rem] outline-none border border-main-gray-border w-full"
                                            value={filter.endDate}
                                            onChange={(e) => {
                                                setFilter(prev => ({ ...prev, endDate: e.target.value }))
                                            }}
                                            required
                                            min={`${data.first_enter.split("-")[0]}-${data.first_enter.split("-")[1]}`}
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex justify-end gap-[1rem]">
                                    <div className={cn("bg-main-purple text-main font-[500] px-[1.5rem] py-[.8rem] rounded-[1rem] hover:bg-main-purple-hover active:bg-main-purple duration-200 shadow-table-black cursor-pointer",
                                        filter.startDate.length === 0 && "bg-main-gray-border2 text-main-gray-text/50 cursor-not-allowed hover:bg-main-gray-border2 active:bg-main-gray-border2",
                                        filter.endDate.length === 0 && "bg-main-gray-border2 text-main-gray-text/50 cursor-not-allowed hover:bg-main-gray-border2 active:bg-main-gray-border2"
                                    )}
                                        onClick={() => {
                                            const firstEnter = data.first_enter
                                            const now = new Date().toISOString().split("T")[0]
                                            const startDateMonth = `${firstEnter.split("-")[0]}-${firstEnter.split("-")[1].padStart(2, "0")}`
                                            const endDateMonth = `${now.split("-")[0]}-${now.split("-")[1].padStart(2, "0")}`
                                            setFilter({
                                                active: false,
                                                endDate: endDateMonth,
                                                startDate: startDateMonth,
                                                show: false
                                            })
                                            handleFilter()
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
                    <button className="flex items-center gap-[.5rem] bg-main-hover px-[1.5rem] py-[.8rem] rounded-[2rem] font-[500] text-white duration-300 hover:bg-[#5d5fef9d]" onClick={() => { handlePrint() }}>
                        <i className='bx bx-printer text-[1.5rem]'></i>
                        Print
                    </button>
                </div>
            </div>
            <div id="printDiv" className="w-full max-w-[800px]">
                <div id="content" className="rounded-sm bg-white shadow-xl w-full">
                    <div className="flex p-[1rem] items-center justify-between text-[1.2rem] font-[500] border-b border-main-gray-border select-none">
                        <div className="flex gap-[.5rem] items-center">
                            <img src={logo} alt="" className="w-[10rem]" />
                        </div>
                        <p className="sansita select-text"><span className="text-main-gray-text ">Slip Gaji Mediatama </span></p>
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
                                    <p className="break-words">{data?.name}</p>
                                </div>

                                <div id="title" className="col-span-1 px-[1rem] py-[.2rem] font-[600] border-b border-main-gray-border">
                                    <p>Member</p>
                                </div>
                                <div id="field" className="col-span-2 px-[1rem] py-[.2rem] border-l border-b border-main-gray-border">
                                    <p className="break-words">{data.member}</p>
                                </div>

                                <div id="title" className="col-span-1 px-[1rem] py-[.2rem] font-[600] border-b border-main-gray-border">
                                    <p>Alamat</p>
                                </div>
                                <div id="field" className="col-span-2 px-[1rem] py-[.2rem] border-l border-b border-main-gray-border">
                                    <p className="break-words">...</p>
                                </div>
                            </div>
                        </div>
                        {/* <div id="customer" className="flex flex-col">
                            <div className="bg-main-hover px-[1rem] py-[.5rem] text-white font-[600]">
                                <p>Customer</p>
                            </div>
                            <div className="grid grid-cols-3 border border-b-0 border-main-gray-border">
                                <div id="title" className="col-span-1 px-[1rem] py-[.2rem] font-[600] border-b border-main-gray-border">
                                    <p>Nama</p>
                                </div>
                                <div id="field" className="col-span-2 px-[1rem] py-[.2rem] border-l border-b border-main-gray-border">
                                    <p className="break-words"></p>
                                </div>

                                <div id="title" className="col-span-1 px-[1rem] py-[.2rem] font-[600] border-b border-main-gray-border">
                                    <p>Nomor Telp</p>
                                </div>
                                <div id="field" className="col-span-2 px-[1rem] py-[.2rem] border-l border-b border-main-gray-border">
                                    <p className="break-words"></p>
                                </div>

                                <div id="title" className="col-span-1 px-[1rem] py-[.2rem] font-[600] border-b border-main-gray-border">
                                    <p>Alamat</p>
                                </div>
                                <div id="field" className="col-span-2 px-[1rem] py-[.2rem] border-l border-b border-main-gray-border">
                                    <p className="break-words"></p>
                                </div>

                                <div id="title" className="col-span-1 px-[1rem] py-[.2rem] font-[600] border-b border-main-gray-border">
                                    <p>Tanggal Masuk</p>
                                </div>
                                <div id="field" className="col-span-2 px-[1rem] py-[.2rem] border-l border-b border-main-gray-border">
                                    <p className="break-words">

                                    </p>
                                </div>

                                <div id="title" className="col-span-1 px-[1rem] py-[.2rem] font-[600] border-b border-main-gray-border">
                                    <p>Tanggal Keluar</p>
                                </div>
                                <div id="field" className="col-span-2 px-[1rem] py-[.2rem] border-l border-b border-main-gray-border">
                                    <p className="break-words"></p>
                                </div>
                                <div id="title" className="col-span-1 px-[1rem] py-[.2rem] font-[600] border-b border-main-gray-border">
                                    <p>Status</p>
                                </div>
                                <div id="field" className="col-span-2 px-[1rem] py-[.2rem] border-l border-b border-main-gray-border">
                                    <p className="break-words"></p>
                                </div>
                            </div>
                        </div> */}
                        {data.pay_day_data.map((item, index) => (
                            <div key={index} id="detail" className="flex flex-col">
                                <div className="bg-main-hover px-[1rem] py-[.5rem] text-white font-[600]">
                                    <p>{getDateString(item.date)}</p>
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
                                            <p>{item.attendance}</p>
                                        </div>
                                    </div>
                                    <div id="field" className="px-[1rem] py-[.2rem] border-l border-b border-main-gray-border font-[600]">
                                        <p>
                                            {item.permit}{" "}
                                            {item.permit_data.length > 0 && (
                                                <>(<span>{getDateGroup(item.permit_data)}</span>)</>
                                            )}
                                        </p>
                                    </div>
                                    <div id="field" className="px-[1rem] py-[.2rem] border-l border-b border-r border-main-gray-border font-[600]">
                                        <p>
                                            {item.overtime}{" "}
                                            {item.overtime_data.length > 0 && (
                                                <> (<span>{getDateGroup(item.overtime_data)}</span>)</>
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
                                        <p>{item.overtime}x Rp. {overtimeSalary.toLocaleString("id-ID", { style: "decimal" })}</p>
                                    </div>
                                    <div id="field" className="px-[1rem] py-[.2rem] border-l border-b border-r border-main-gray-border font-[600]">
                                        <p>Rp {(item.overtime * overtimeSalary).toLocaleString("id-ID", { style: "decimal" })}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 border border-b-0 border-main-gray-border">
                                    <div id="title" className="px-[1rem] py-[.2rem] border-l border-b border-main-gray-border font-[600]">
                                        <div className="grid grid-cols-2">
                                            <p>Attendance</p>
                                        </div>
                                    </div>
                                    <div id="field" className="px-[1rem] py-[.2rem] border-l border-b border-main-gray-border font-[600]">
                                        <p>{item.attendance}x Rp. {item.salary.toLocaleString("id-ID", { style: "decimal" })}</p>
                                    </div>
                                    <div id="field" className="px-[1rem] py-[.2rem] border-l border-b border-r border-main-gray-border font-[600]">
                                        <p>Rp {(item.attendance * item.salary).toLocaleString("id-ID", { style: "decimal" })}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 border border-b-0 border-main-gray-border">
                                    <div id="title" className="px-[1rem] py-[.2rem] border-l border-b border-main-gray-border font-[600]">
                                        <div className="grid grid-cols-2">
                                            <p>Member</p>
                                        </div>
                                    </div>
                                    <div id="field" className="px-[1rem] py-[.2rem] border-l border-b border-main-gray-border font-[600]">
                                        <p>{data.member}x Rp. {member.toLocaleString("id-ID", { style: "decimal" })}</p>
                                    </div>
                                    <div id="field" className="px-[1rem] py-[.2rem] border-l border-b border-r border-main-gray-border font-[600]">
                                        <p>Rp {(data.member * member).toLocaleString("id-ID", { style: "decimal" })}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 border-main-gray-border">
                                    <div id="field" className="col-span-2 px-[1rem] py-[.2rem] border-l border-b border-main-gray-border bg-main-gray-border2 font-[600]">
                                        <p className="break-words text-center">Total</p>
                                    </div>
                                    <div id="field" className="col-span-1 px-[1rem] py-[.2rem] border-l border-b border-r border-main-gray-border bg-main-gray-border2 font-[600]">
                                        <p className="break-words">
                                            {((item.attendance * item.salary) + (item.overtime * overtimeSalary) + (data.member * member)).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        ))}

                    </div>
                    <div className="border-t border-main-gray-border p-[1rem] text-[1.2rem] font-[500] flex justify-between">
                        <p className="sansita text-main-gray-text">Best Software House - Mediatama Web</p>
                        <p className="sansita text-main-gray-text">Jl. Dr. Sutomo No.151 B</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
