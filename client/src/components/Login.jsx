import React, { useState, useContext } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

export default function Login() {
  const [mode, setMode] = useState('Login') // or 'SignUp'
  const [name,  setName]  = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { backendUrl, setShowLogin, login } = useContext(AppContext)

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const url = `${backendUrl}/api/user/${ mode === 'Login' ? 'login' : 'register' }`
      const body = mode === 'Login'
        ? { email, password }
        : { name, email, password }

      const { data } = await axios.post(url, body)

      if (data.success) {
        login(data.token, data.user)
        setShowLogin(false)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
        {mode === 'Login' ? 'Log In' : 'Sign Up'}
      </button>
      <p onClick={() => setMode(m => m === 'Login' ? 'SignUp' : 'Login')}>
        {mode === 'Login'
          ? "Don't have an account? Sign Up"
          : 'Already have one? Log In'}
      </p>
    </form>
  )
}
