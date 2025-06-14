// client/src/context/AppContext.jsx

import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

export const AppContext = createContext()

export default function AppContextProvider({ children }) {
  const [token, setToken]       = useState(localStorage.getItem('token'))
  const [user, setUser]         = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [credit, setCredit]     = useState(0)

  // Your own backend base URL 
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Sync with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async fbUser => {
      if (fbUser && fbUser.emailVerified) {
        // Grab the Firebase ID token and save it
        const idToken = await fbUser.getIdToken()
        localStorage.setItem('token', idToken)
        setToken(idToken)
        setUser({ name: fbUser.displayName || fbUser.email })

        // Fetch current credit balance
        loadCreditsData(idToken)
      } else {
        // Signed out or not verified
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setCredit(0)
      }
    })

    return () => unsubscribe()
  }, [])

  // Load credit balance from your backend
  const loadCreditsData = async (jwt = token) => {
    if (!jwt) return
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/credits`,
        { headers: { token: jwt } }
      )
      if (data.success) {
        setCredit(data.credits)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  // Generate an image (and auto-refresh credit balance)
  const generateImage = async prompt => {
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
        if (data.creditBalance === 0) {
          // e.g. navigate('/buy')
        }
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  // Sign out via Firebase
  const logout = () => {
    auth.signOut()
  }

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        showLogin,
        setShowLogin,
        credit,
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
