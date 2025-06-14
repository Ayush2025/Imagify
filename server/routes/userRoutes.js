// server/routes/userRoutes.js
import express from 'express';
import {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorpay,
  verifyRazorpay,
  paymentStripe,
  verifyStripe,
} from '../controllers/UserController.js';
import authUser from '../middlewares/auth.js'

const userRouter = express.Router();

// Public
userRouter.post('/register', registerUser);
userRouter.post('/login',    loginUser);

// Protected
userRouter.get(  '/credits',      authUser, userCredits);
userRouter.post( '/pay-razor',    authUser, paymentRazorpay);
userRouter.post( '/verify-razor', authUser, verifyRazorpay);
userRouter.post( '/pay-stripe',   authUser, paymentStripe);
userRouter.post( '/verify-stripe',authUser, verifyStripe);

export default userRouter;
