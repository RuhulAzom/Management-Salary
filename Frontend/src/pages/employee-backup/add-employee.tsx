import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { API_URL } from "@/env"
import { toastError, token } from "@/lib/utils"
import InputText from "@/components/_sub-components/input-text"
import InputNumber from "@/components/_sub-components/input-number"
import LoadingPageWithText from "@/components/loading/loading-page"

interface InputDataProps {
    name: string;
    member: string;
    firstEnter: string;
    loading: boolean;
}

export default function AddEmploye() {

    // const [name, setName] = useState<string>("")
    // const [member, setMember] = useState<string>("")
    // const [firtEnter, setFirstEnter] = useState<string>("")

    // const [loading, setLoading] = useState<boolean>(false)

    const [inputData, setInputData] = useState<InputDataProps>({
        name: "",
        member: "",
        firstEnter: "",
        loading: false
    })

    const AddEmploye = async () => {
        setInputData(prev => ({ ...prev, loading: true }))
        try {
            const res = await axios.post(`${API_URL}/employee/add`, {
                name: inputData.name, member: parseInt(inputData.member), first_enter: inputData.firstEnter
            }, {
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            console.log(res)
            toast.success(`Succes To Add ${inputData.name} as Employee`, { duration: 3000 })
            setInputData({
                name: "",
                member: "",
                firstEnter: "",
                loading: false
            })
        } catch (error) {
            console.log("Failed to add Member :", error)
            setInputData(prev => ({ ...prev, loading: false }))
            toastError({ error, message: "Failed To Add Employee" })
            return error;
        }
    }

    return (
        <div className="px-[1rem] md:px-[4rem] py-[2rem] bg-body">
            <LoadingPageWithText heading="Adding Employee...." loading={inputData.loading} />
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
                                Insert Employee
                            </h3>
                        </div>
                    </div>
                </div>
                <form className="flex flex-col gap-[1.5rem] p-[1.5rem]"
                    onSubmit={(e) => { AddEmploye(); e.preventDefault() }}
                >
                    <div>
                        <InputText
                            heading="Name"
                            placeholder="Input Name..."
                            value={inputData.name}
                            required
                            onChange={(e) => {
                                setInputData(prev => ({ ...prev, name: e.target.value }))
                            }}
                        />
                    </div>
                    <div>
                        <InputNumber
                            heading="Member"
                            placeholder="Input Member..."
                            value={inputData.member}
                            required
                            onChange={(e) => {
                                setInputData(prev => ({ ...prev, member: e.target.value }))
                            }}
                        />
                    </div>
                    <div>
                        <div className="input-poster flex flex-col gap-[.5rem]">
                            <p>
                                First Enter
                            </p>
                            <input type="date" className="px-[1rem] py-[.7rem] rounded-[.5rem] outline-none border border-main-gray-border w-full"
                                value={inputData.firstEnter}
                                onChange={(e) => {
                                    setInputData(prev => ({ ...prev, firstEnter: e.target.value }))
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end p-4">
                        <button
                            type='submit'
                            className="bg-main-purple font-[500] hover:bg-main-hover hover:text-white duration-200 text-main py-[.8rem] px-[1rem] rounded-[.8rem]"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

