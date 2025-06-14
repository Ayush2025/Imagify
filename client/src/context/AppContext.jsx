import React, { createContext, useState, useEffect } from 'react'
import { auth } from '../firebase'
import {
  onAuthStateChanged,
  signOut as fbSignOut
} from 'firebase/auth'

export const AuthContext = createContext({
  user: null,
  loading: true,
  logout: () => {}
})

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)       // { uid, email, token } or null
  const [loading, setLoading] = useState(true) // while we check auth status

  useEffect(() => {
    // subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // fetch fresh ID token
        const token = await fbUser.getIdToken()
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          token
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = () => {
    // sign out from Firebase
    fbSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
