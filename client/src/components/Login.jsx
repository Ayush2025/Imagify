import React, { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import { toast } from "react-toastify"
import { motion } from "framer-motion"

const Login = () => {
  const [mode, setMode] = useState("login") // "login" or "signup"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const {
    setShowLogin,
    loginWithEmail,
    registerWithEmail
  } = useContext(AppContext)

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (mode === "login") {
        await loginWithEmail(email, password)
        toast.success("Logged in!")
      } else {
        await registerWithEmail(email, password)
        toast.success("Account created!")
      }
      setShowLogin(false)
    } catch (err) {
      toast.error(err.message)
    }
  }

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl text-gray-700 w-80 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl mb-4 text-center">
          {mode === "login" ? "Log In" : "Sign Up"}
        </h2>

        <div className="mb-3">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded mb-2"
        >
          {mode === "login" ? "Log In" : "Create Account"}
        </button>

        <p className="text-center text-sm">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() =>
              setMode(mode === "login" ? "signup" : "login")
            }
          >
            {mode === "login" ? "Sign Up" : "Log In"}
          </span>
        </p>

        <button
          type="button"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={() => setShowLogin(false)}
        >
          ✕
        </button>
      </motion.form>
    </div>
  )
}

export default Login
