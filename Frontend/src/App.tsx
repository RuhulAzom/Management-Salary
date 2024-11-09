import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import LoginPage from '@/pages/auth/login'
import Dashboard from './pages/dashboard'
import RegisterPage from './pages/auth/register'
import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from './env'
import Layout from './components/Layout'
import Employee from './pages/employee-backup'
import AddEmploye from './pages/employee-backup/add-employee'
import Attendance from './pages/attendace'
import DetailSalaryEmployee from './pages/employee-backup/detail-salary-employee'
import Employee2 from './pages/employee'
import Salary from './pages/salary'
import DetailEmployee from './pages/employee/detail-employee'

interface UserProps {
  username: string,
  email: string,
  role: string,
}

export const AppContext = createContext<any>(null)

function App() {

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [userData, setUserData] = useState<UserProps | null>(null)

  const checkToken = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${API_URL}/auth/token`, {
        headers: {
          Authorization: `bearer ${token}`
        }
      })
      console.log("CheckToken :", res)
      setUserData({
        email: res.data.data.email,
        username: res.data.data.username,
        role: res.data.data.role
      })

      if (pathname === "/auth/login" || pathname === "/auth/register") navigate("/")

    } catch (error: any) {
      console.log("Error in CheckLogin : ", error)
      if (error.status == 401) {
        if (pathname !== "/auth/login" && pathname !== "/auth/register") navigate("/auth/login")
      }
      return
    }
  }
  useEffect(() => {
    checkToken()
  }, [])

  if (!userData && pathname !== "/auth/login" && pathname !== "/auth/register") return <div>Loading...</div>

  return (
    <AppContext.Provider value={{ userData }}>
      <div>
        <Layout>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path='/employee-backup' element={<Employee />} />
            <Route path='/employee-backup/add' element={<AddEmploye />} />
            <Route path='/employee-backup/detail/:id' element={<DetailSalaryEmployee />} />
            <Route path='/employee' element={<Employee2 />} />
            <Route path='/employee/add' element={<AddEmploye />} />
            <Route path='/employee/detail' element={<DetailEmployee />} />
            <Route path='/attendance' element={<Attendance />} />
            <Route path='/salary' element={<Salary />} />
            {!userData && (
              <>
                <Route path='/auth/login' element={<LoginPage />} />
                <Route path='/auth/register' element={<RegisterPage />} />
              </>
            )}

          </Routes>
        </Layout>
      </div>
    </AppContext.Provider>

  )
}

export default App
