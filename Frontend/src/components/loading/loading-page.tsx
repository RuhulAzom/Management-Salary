import { Loader2 } from "lucide-react";

export default function LoadingPageWithText({ heading, loading }: { heading: string, loading: boolean }) {
    return (
        <>
            {loading &&
                <div className="fixed top-0 left-0 w-full h-full z-[201] flex justify-center items-center bg-[#ffffff52] backdrop-blur-[6px] select-none">
                    <div className="flex flex-col gap-[.5rem] items-center text-center">
                        <Loader2 className="animate-spin h-[4rem] w-[4rem] text-main-heading-text" />
                        <p className="text-[1.3rem] text-main-heading-text">
                            {heading}
                        </p>

                    </div>
                </div>
            }
        </>
    )
}