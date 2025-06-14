// client/src/components/Login.jsx
import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'

const Login = () => {
  const [mode, setMode] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { backendUrl, setShowLogin, setToken, setUser } = useContext(AppContext)

  const onSubmit = async e => {
    e.preventDefault()
    try {
      if (mode === 'Login') {
        const { data } = await axios.post(
          `${backendUrl}/api/user/login`,
          { email, password }
        )
        if (data.success) {
          setToken(data.token)
          setUser(data.user)
          localStorage.setItem('token', data.token)
          setShowLogin(false)
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(
          `${backendUrl}/api/user/register`,
          { name, email, password }
        )
        if (data.success) {
          setToken(data.token)
          setUser(data.user)
          localStorage.setItem('token', data.token)
          setShowLogin(false)
        } else {
          toast.error(data.message)
        }
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="overlay">
      <motion.form
        onSubmit={onSubmit}
        className="login-card"
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h1>{mode}</h1>
        {mode !== 'Login' && (
          <input
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          {mode === 'Login' ? 'Log In' : 'Create Account'}
        </button>
        <p onClick={() => setMode(m => (m === 'Login' ? 'Sign Up' : 'Login'))}>
          {mode === 'Login'
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Login'}
        </p>
        <button
          type="button"
          className="close-btn"
          onClick={() => setShowLogin(false)}
        >
          ×
        </button>
      </motion.form>
    </div>
  )
}

export default Login
