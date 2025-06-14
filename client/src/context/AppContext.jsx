import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export const AppContext = createContext()

export default function AppContextProvider({ children }) {
  const [showLogin, setShowLogin] = useState(false)
  const [token,     setToken]     = useState(localStorage.getItem('token') || '')
  const [user,      setUser]      = useState(null)
  const [credit,    setCredit]    = useState(0)

  // 1) Grab the raw and strip any trailing slash
  const rawBase   = import.meta.env.VITE_BACKEND_URL || ''
  const backendUrl = rawBase.replace(/\/$/, '')

  const navigate = useNavigate()

  // 2) Health‐check on mount
  useEffect(() => {
    console.log('👉 BACKEND URL:', backendUrl)
    fetch(`${backendUrl}/api/health`)
      .then(r => r.json())
      .then(d => console.log('🔋 Health:', d))
      .catch(e => console.error('Health-check failed', e))
  }, [backendUrl])

  // 3) Load credits, etc.
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

  const login = (tok, usr) => {
    localStorage.setItem('token', tok)
    setToken(tok)
    setUser(usr)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
  }

  return (
    <AppContext.Provider
      value={{
        showLogin, setShowLogin,
        token,      setToken,
        user,       setUser,
        credit,     setCredit,
        backendUrl,
        loadCreditsData,
        login,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
