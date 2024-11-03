
import { useContext } from "react"
import contoh from "@/_assets/user.png"
import { Menu } from 'lucide-react';
import { AppContext } from "@/App";

export default function Header({ setShowSidebar }: { setShowSidebar: React.Dispatch<React.SetStateAction<boolean>> }) {

    const { userData } = useContext(AppContext)

    return (
        <div className="flex items-center h-full px-[1.5rem] md:px-[1rem] justify-between">
            <p className="hidden md:block font-[500] text-main-heading-text text-[1.5rem] sansita tracking-wide">
                Mediatama Web
            </p>
            <div className="md:hidden" onClick={() => { setShowSidebar((prev) => !prev) }}>
                <Menu />
            </div>
            <div className="flex gap-[1rem] md:pr-[3rem] items-center">
                <div className="text-end">
                    <p className="text-[.9rem]">
                        {userData?.username}
                    </p>
                    <p className="text-[.7rem] text-main-gray-text">
                        {userData?.role}
                    </p>
                </div>
                <div className="w-[3rem] h-[3rem] border border-main-gray-border overflow-hidden rounded-[50%]">
                    <img src={contoh} alt="" className="w-full" />
                </div>
            </div>
        </div>
    )
}