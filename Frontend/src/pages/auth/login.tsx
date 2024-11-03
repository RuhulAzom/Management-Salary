import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn, toastError } from "@/lib/utils";
import { useState } from "react";
import { Loader2 } from "lucide-react"
import axios from "axios";
import { API_URL } from "@/env";


interface Login {
    email: string;
    password: string;
    loading: boolean
}

const LoginPage = () => {

    const [data, setData] = useState<Login>({ email: "", password: "", loading: false })

    const handleLogin = async (e: any) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: data.email,
                password: data.password
            })
            console.log(res)
            if (res.status == 200) {
                localStorage.setItem("token", res.data.token)
                window.location.pathname = "/"
            }

        } catch (error) {
            console.log("Error in handleLogin : ", error)
            toastError({ error, message: "Login Failed, Try again!" })
            return
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
            <Card className="w-full max-w-[400px]">
                <CardHeader>
                    <CardTitle>Login Page</CardTitle>
                    <CardDescription>Masukan Akunmu!</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-[.5rem]"
                        onSubmit={(e) => handleLogin(e)}
                    >
                        <div className="flex flex-col gap-[.5rem]">
                            <h1 className="font-[500]">Email</h1>
                            <Input
                                placeholder="Email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-[.5rem]">
                            <h1 className="font-[500]">Password</h1>
                            <Input
                                placeholder="Password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
                            />
                        </div>
                        <button disabled={data.loading} className={cn("bg-black text-white w-full h-[45px] px-[1rem] rounded-[.5rem] mt-[1rem]",
                            data.loading && "bg-black/50"
                        )}>
                            {data.loading ?
                                <div className="w-full flex justify-center items-center h-full">
                                    <Loader2 className="animate-spin h-4 w-4" />
                                </div>
                                : "Login"}
                        </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginPage;