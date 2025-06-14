import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [credit, setCredit] = useState(0)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { token }
      })
      if (data.success) {
        setCredit(data.credits)
        setUser(data.user)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    if (token) loadCreditsData()
  }, [token])

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AppContext.Provider
      value={{
        showLogin,
        setShowLogin,
        token,
        setToken,
        user,
        setUser,
        credit,
        loadCreditsData,
        backendUrl,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  )
}


export default AppContextProvider
export { AppContext }

