import { Link, useLocation } from "react-router-dom";
import logo from "@/_assets/logo.png"
import { ArrowLeft } from "lucide-react"
import { Logout } from "@/lib/utils";


export default function Sidebar({ setShowSidebar }: { setShowSidebar: React.Dispatch<React.SetStateAction<boolean>> }) {

    const { pathname } = useLocation()

    return (
        <div className="flex flex-col h-full gap-[4rem] relative">
            <div className="absolute top-4 right-4 md:hidden"
                onClick={() => setShowSidebar(false)}
            >
                <ArrowLeft />
            </div>
            <div className="w-full flex flex-col justify-center gap-[.5rem] items-center">
                <div className="w-full mt-[2rem]">
                    <img src={logo} alt="" />
                </div>
                {/* <p className="font-[700] text-[1.5rem] sansitaReal text-main-gray-text mb-[-1.8rem] text-center leading-6 mt-[1rem]">
                    <span className="text-[2rem]">Mediatama Web </span> <br /> <span className="text-[1rem]">Best Software House</span>
                </p> */}
            </div>
            <div className="flex flex-col gap-[.5rem]">
                <Link to={"/"} className={`flex items-center gap-[1rem] py-[.8rem] px-[1rem] rounded-[.8rem] ${pathname === "/" ? "bg-main-purple text-main" : "text-main-gray-text hover:bg-main-hover hover:text-white duration-300 active:bg-main"}`}
                    onClick={() => { setShowSidebar(false) }}
                >
                    <i className='bx bxs-dashboard text-[1.5rem]' />
                    <p>
                        Dashboard
                    </p>
                </Link>
                <Link to={"/employee"} className={`flex items-center gap-[1rem] py-[.8rem] px-[1rem] rounded-[.8rem] ${pathname === "/employee" ? "bg-main-purple text-main" : "text-main-gray-text hover:bg-main-hover hover:text-white duration-300 active:bg-main"}`}
                    onClick={() => { setShowSidebar(false) }}
                >
                    <i className='bx bx-transfer-alt text-[1.5rem]' />
                    <p>
                        Employee
                    </p>
                </Link>
                {/* <Link to={"/employee-backup"} className={`flex items-center gap-[1rem] py-[.8rem] px-[1rem] rounded-[.8rem] ${pathname.includes("/employee-backup") ? "bg-main-purple text-main" : "text-main-gray-text hover:bg-main-hover hover:text-white duration-300 active:bg-main"}`}
                    onClick={() => { setShowSidebar(false) }}
                >
                    <i className='bx bx-transfer-alt text-[1.5rem]' />
                    <p>
                        Employee Backup
                    </p>
                </Link> */}
                {/* <Link to={"/attendance"} className={`flex items-center gap-[1rem] py-[.8rem] px-[1rem] rounded-[.8rem] ${pathname.includes("/attendance") ? "bg-main-purple text-main" : "text-main-gray-text hover:bg-main-hover hover:text-white duration-300 active:bg-main"}`}
                    onClick={() => { setShowSidebar(false) }}
                >
                    <i className='bx bx-check-double text-[1.5rem]'></i>
                    <p>
                        Attendance
                    </p>
                </Link>
                <Link to={"/salary"} className={`flex items-center gap-[1rem] py-[.8rem] px-[1rem] rounded-[.8rem] ${pathname.includes("/salary") ? "bg-main-purple text-main" : "text-main-gray-text hover:bg-main-hover hover:text-white duration-300 active:bg-main"}`}
                    onClick={() => { setShowSidebar(false) }}
                >
                    <i className='bx bx-transfer-alt text-[1.5rem]' />
                    <p>
                        Salary
                    </p>
                </Link> */}
            </div>

            <div className={`flex items-center gap-[1rem] px-[1rem] rounded-[.8rem] text-main-gray-text hover:text-main duration-300 active:bg-main absolute bottom-8 md:bottom-0 left-0 w-fit h-fit cursor-pointer`}
                onClick={() => Logout()}
            >
                <i className='bx bx-log-out-circle text-[1.5rem]' />
                <p>
                    Sign Out
                </p>
            </div>
        </div>
    )
}