import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const Verify = () => {
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success')
  const transactionId = searchParams.get('transactionId')
  const navigate = useNavigate()

  useEffect(() => {
    // only run when we have both params
    if (!transactionId || success === null) {
      toast.error('Invalid verification link.')
      return navigate('/')
    }

    const verifyStripe = async () => {
      try {
        console.log('Verifying stripe payment...', { success, transactionId })
        const { data } = await axios.post(
          '/api/user/verify-stripe',             // <-- make sure this matches your server route
          { success, transactionId }
        )
        console.log('Stripe verify response:', data)

        if (data.success) {
          toast.success(data.message)
        } else {
          toast.error(data.message)
        }
      } catch (err) {
        console.error('Verify call failed:', err)
        toast.error('Verification failed. Check console for details.')
      } finally {
        setTimeout(() => navigate('/'), 1500)
      }
    }

    verifyStripe()
  }, [transactionId, success, navigate])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin" />
    </div>
  )
}

export default Verify
