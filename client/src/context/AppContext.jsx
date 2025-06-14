// client/src/context/AppContext.jsx
import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

// only one export of AppContext here:
export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false)
  const [token, setToken]       = useState(localStorage.getItem('token') || '')
  const [user, setUser]         = useState(null)
  const [credit, setCredit]     = useState(0)

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const navigate   = useNavigate()

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

  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt },
        { headers: { token } }
      )
      if (data.success) {
        await loadCreditsData()
        return data.resultImage
      } else {
        toast.error(data.message)
        if (data.creditBalance === 0) navigate('/buy')
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
  }

  useEffect(() => {
    if (token) loadCreditsData()
  }, [token])

  return (
    <AppContext.Provider
      value={{
        showLogin, setShowLogin,
        token,      setToken,
        user,       setUser,
        credit,     setCredit,
        loadCreditsData,
        generateImage,
        logout,
        backendUrl
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
