import React, { useState, useContext } from 'react'
import { auth } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Login = () => {
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { user, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  // Redirect home if already logged in
  if (!loading && user) {
    navigate('/')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (mode === 'login') {
        // LOGIN
        await signInWithEmailAndPassword(auth, email, password)
        toast.success('Logged in successfully!')
      } else {
        // SIGN UP
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await sendEmailVerification(result.user)
        toast.info('Verification email sent! Check your inbox.')
        setMode('login')
      }
      // after auth action, go home
      navigate('/')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          {mode === 'login' ? 'Log In' : 'Sign Up'}
        </h2>

        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input
            type="email"
            className="mt-1 p-2 w-full border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            type="password"
            className="mt-1 p-2 w-full border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded mb-4 hover:bg-blue-700 transition"
        >
          {mode === 'login' ? 'Log In' : 'Create Account'}
        </button>

        <p className="text-center text-sm">
          {mode === 'login'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-blue-600 hover:underline"
          >
            {mode === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login
