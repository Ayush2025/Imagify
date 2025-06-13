import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { motion } from 'framer-motion'

const BuyCredit = () => {
  const { backendUrl, loadCreditsData, user, token, setShowLogin } = useContext(AppContext)
  const navigate = useNavigate()

  const initPay = async (order) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK not loaded")
      return
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Credits Payment',
      description: "Credits Payment",
      order_id: order.id,
      handler: async (response) => {
        try {
          // include userId in verify call
          const payload = { ...response, userId: user._id }
          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-razor`,
            payload,
            { headers: { token } }
          )
          if (data.success) {
            await loadCreditsData()
            navigate('/')
            toast.success('Credits Added!')
          } else {
            toast.error(data.message || 'Verification failed')
          }
        } catch (err) {
          toast.error(err.message)
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const paymentRazorpay = async (planId) => {
    if (!user) {
      setShowLogin(true)
      return
    }

    try {
      // include userId in create-order call
      const { data } = await axios.post(
        `${backendUrl}/api/user/pay-razor`,
        { planId, userId: user._id },
        { headers: { token } }
      )

      if (data.success) {
        initPay(data.order)
      } else {
        toast.error(data.message || 'Could not create order')
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const paymentStripe = async (planId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/pay-stripe`,
        { planId, userId: user?._id },
        { headers: { token } }
      )
      if (data.success) {
        window.location.replace(data.session_url)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <motion.div
      className="min-h-[80vh] text-center pt-14 mb-10"
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">
        Our Plans
      </button>
      <h1 className="text-3xl font-medium mb-6 sm:mb-10">Choose a plan</h1>

      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((plan, i) => (
          <div
            key={i}
            className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500"
          >
            <img width={40} src={assets.logo_icon} alt="" />
            <p className="mt-3 mb-1 font-semibold">{plan.id}</p>
            <p className="text-sm">{plan.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">₹{plan.price}</span> /{' '}
              {plan.credits} credits
            </p>
            <div className="flex flex-col mt-4">
              <button
                onClick={() => paymentRazorpay(plan.id)}
                className="w-full flex justify-center gap-2 border border-gray-400 mt-2 text-sm rounded-md py-2.5 hover:bg-blue-50 hover:border-blue-400"
              >
                <img className="h-4" src={assets.razorpay_logo} alt="" />
                Pay with Razorpay
              </button>
              <button
                onClick={() => paymentStripe(plan.id)}
                className="w-full flex justify-center gap-2 border border-gray-400 mt-2 text-sm rounded-md py-2.5 hover:bg-blue-50 hover:border-blue-400"
              >
                <img className="h-4" src={assets.stripe_logo} alt="" />
                Pay with Stripe
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default BuyCredit
