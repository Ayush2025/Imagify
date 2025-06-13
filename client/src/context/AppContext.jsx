import React, { createContext, useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut
} from "firebase/auth"

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false)
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const [user, setUser] = useState(null)
  const [credit, setCredit] = useState(0)

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async fbUser => {
      if (fbUser) {
        const idToken = await fbUser.getIdToken()
        setToken(idToken)
        localStorage.setItem("token", idToken)
        setUser({ name: fbUser.email }) // or fbUser.displayName if you set it
      } else {
        setToken("")
        localStorage.removeItem("token")
        setUser(null)
      }
    })
    return () => unsub()
  }, [])

  // Load user credits from your backend
  const loadCreditsData = async () => {
    if (!token) return
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

  // Firebase-powered auth methods
  const loginWithEmail = (email, pw) =>
    signInWithEmailAndPassword(auth, email, pw)

  const registerWithEmail = (email, pw) =>
    createUserWithEmailAndPassword(auth, email, pw)

  const logout = () => fbSignOut(auth)

  return (
    <AppContext.Provider
      value={{
        showLogin,
        setShowLogin,
        token,
        user,
        credit,
        loadCreditsData,
        backendUrl,
        loginWithEmail,
        registerWithEmail,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
