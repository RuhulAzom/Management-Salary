import React, { SetStateAction } from "react"


export interface ModalDeleteProps {
    id: string,
    title: string,
    show: boolean
}

interface Props {
    data: ModalDeleteProps,
    setDelete: React.Dispatch<SetStateAction<ModalDeleteProps>>,
    onClick: () => void
}


export default function ModalDelete({ data, setDelete, onClick }: Props) {
    return (
        <>
            {data.show &&
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-[200] bg-[#ffffff52] backdrop-blur-[6px]">
                    <div className="bg-white p-[2rem] rounded-[.8rem] flex flex-col gap-[.5rem] shadow-default-black w-[90%] md:w-fit">
                        <p>Apakah anda yakin ingin menghapus "{data.title}" ?</p>
                        <div className="flex items-center gap-[.5rem]">
                            <button className="bg-red-600 hover:bg-red-500 text-white py-[.4rem] px-[1rem] rounded-[1.5rem]"
                                onClick={() => { onClick() }}
                            >
                                Yes
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-500 text-white py-[.4rem] px-[1rem] rounded-[1.5rem]"
                                onClick={() => { setDelete((prev: any) => ({ ...prev, title: "", show: false, id: "" })) }}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}