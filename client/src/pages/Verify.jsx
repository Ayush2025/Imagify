import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Verify = () => {
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success')
  const transactionId = searchParams.get('transactionId')

  const { backendUrl, loadCreditsData, token } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    // Don't try to verify until we have everything
    if (!token) return
    if (!transactionId || success === null) {
      toast.error('Invalid verification link.')
      return navigate('/')
    }

    const verifyStripe = async () => {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/user/verify-stripe`,
          { success, transactionId },
          { headers: { token } }
        )

        if (data.success) {
          toast.success(data.message)
          await loadCreditsData()
        } else {
          toast.error(data.message)
        }
      } catch (err) {
        console.error(err)
        toast.error('Verification failed. Please try again.')
      } finally {
        // Give the user a moment to see the toast
        setTimeout(() => navigate('/'), 1500)
      }
    }

    verifyStripe()
  }, [token, transactionId, success, backendUrl, loadCreditsData, navigate])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin" />
    </div>
  )
}

export default Verify
