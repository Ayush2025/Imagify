import express from 'express';
import {
  registerUser, loginUser, userCredits,
  paymentRazorpay, verifyRazorpay,
  paymentStripe, verifyStripe
} from '../controllers/UserController.js';
import auth from '../middlewares/auth.js';

const r = express.Router();
r.post('/register', registerUser);
r.post('/login',    loginUser);
r.get( '/credits',  auth, userCredits);
r.post('/pay-razor',auth, paymentRazorpay);
r.post('/verify-razor', verifyRazorpay);
r.post('/pay-stripe', auth, paymentStripe);
r.post('/verify-stripe', auth, verifyStripe);
export default r;
