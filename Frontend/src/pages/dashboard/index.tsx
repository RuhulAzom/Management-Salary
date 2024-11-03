import { AppContext } from "@/App";
import { Logout } from "@/lib/utils";
import { useContext } from "react";


const Dashboard = () => {

    const { userData } = useContext(AppContext)

    return (
        <div className="">
            {JSON.stringify(userData)}
            <button onClick={Logout}>
                Logout
            </button>
        </div>
    )
}

export default Dashboard;