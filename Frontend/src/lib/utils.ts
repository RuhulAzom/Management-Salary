import { clsx, type ClassValue } from "clsx"
import toast from "react-hot-toast"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const Logout = () => {
  localStorage.removeItem("token")
  window.location.reload()
}

export const toastError = ({ error, message }: { error: any, message: string }) => {
  if (error?.response?.data.message) {
    toast.error(`${error?.response?.data.message}`, { duration: 3000 })
  } else {
    toast.error(`${message}`, { duration: 3000 })
  }
}

export const token = localStorage.getItem("token")

export const getDateString = (date: any) => {
  const createDate = new Date(date)
  const day = createDate.getDate();
  const month = createDate.getMonth();
  const year = createDate.getFullYear();

  const MonthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  return `${day.toString().padStart(2, "0")} ${MonthNames[month]} ${year}`

}

export const getDateForInput = (date: any) => {
  const createDate = new Date(date)
  const day = createDate.getDate();
  const month = createDate.getMonth() + 1;
  const year = createDate.getFullYear();

  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`

}

export const getDateGroup = (dates: string[]) => {
  const datas = dates.map((item) => {
    return item.split("T")[0]
  })

  const object = datas.reduce((acc: { [key: string]: string[] }, item) => {
    const key = item.split("-")[1];
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {})

  const sendData = Object.keys(object).map((item) => {
    const data = object[item]
    const createDate = new Date(data[0])
    const month = createDate.getMonth();
    const MonthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]
    const days = data.map((item) => {
      const createDate = new Date(item)
      return `${createDate.getDate()}`
    })
    const finalData = {
      value: days.join(","),
      month: MonthNames[month],
    }

    return Object.values(finalData).join("")


  })

  console.log({ object, sendData })
  return sendData.join(",")

}

export const getHours = (date: any) => {
  const Dates = new Date(date);
  const hours = Dates.getHours();
  const minute = Dates.getMinutes();
  return `${hours.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
};

export const firstSalary = 40000
export const secondSalary = 50000
export const normalSalary = 60000
export const overtimeSalary = 50000
export const member = 2000