import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import LoginPage from '@/pages/auth/login'
import Dashboard from './pages/dashboard'
import RegisterPage from './pages/auth/register'
import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from './env'
import Layout from './components/Layout'
import Employee from './pages/employee'
import AddEmploye from './pages/employee/add-employee'
import Attendance from './pages/attendace'
import DetailSalaryEmployee from './pages/employee/detail-salary-employee'

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
            <Route path='/employee' element={<Employee />} />
            <Route path='/employee/add' element={<AddEmploye />} />
            <Route path='/employee/detail/:id' element={<DetailSalaryEmployee />} />
            <Route path='/attendance' element={<Attendance />} />
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
