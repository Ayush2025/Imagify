// client/src/pages/Login.jsx
import React, { useState, useEffect, useContext } from 'react'
import { auth } from '../firebase'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'

const Login = () => {
  const [mode, setMode] = useState('Login') // or 'Sign Up'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setShowLogin, setToken, setUser } = useContext(AppContext)

  // auto-close once the user is fully logged-in (and email verified)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user && user.emailVerified) {
        // you could exchange the firebase ID token for your backend JWT here
        user.getIdToken().then(idToken => {
          localStorage.setItem('token', idToken)
          setToken(idToken)
          setUser({ name: user.displayName || email })
          setShowLogin(false)
        })
      }
    })
    return unsubscribe
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (mode === 'Sign Up') {
        // create, then send verification
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        await sendEmailVerification(cred.user)
        toast.success('Verification e-mail sent. Please check your inbox.')
        // optionally force user to click a button after verifying
      } else {
        // Login
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        if (!user.emailVerified) {
          toast.error('Please verify your e-mail before signing in.')
          await auth.signOut()
        }
        // onAuthStateChanged will pick up successful login+verified
      }
    } catch (err) {
      toast.error(err.message.replace('Firebase:', '').trim())
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl relative text-gray-700 w-80"
        initial={{ opacity: 0.2, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-medium text-center">{mode}</h2>

        {mode === 'Sign Up' && (
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full Name"
            className="mt-4 w-full px-3 py-2 border rounded"
            required
          />
        )}
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="mt-4 w-full px-3 py-2 border rounded"
          required
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="mt-4 w-full px-3 py-2 border rounded"
          required
        />

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
        >
          {mode === 'Login' ? 'Log In' : 'Create Account'}
        </button>

        <p
          className="mt-4 text-center text-sm text-blue-600 cursor-pointer"
          onClick={() => setMode(mode === 'Login' ? 'Sign Up' : 'Login')}
        >
          {mode === 'Login'
            ? "Don't have an account? Sign up"
            : 'Already have one? Log in'}
        </p>

        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </motion.form>
    </div>
  )
}

export default Login
