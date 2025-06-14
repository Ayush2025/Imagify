import User from '../models/userModel.js';
import Transaction from '../models/transactionModel.js';
import Razorpay from 'razorpay';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name||!email||!password) return res.json({ success:false,message:'Missing' });
  const hash = await bcrypt.hash(password,10);
  const u = await User.create({ name, email, password: hash });
  const token = jwt.sign({ id:u._id }, process.env.JWT_SECRET);
  res.json({ success:true, token, user:{ name:u.name } });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u) return res.json({ success:false,message:'No user' });
  if (!await bcrypt.compare(password,u.password))
    return res.json({ success:false,message:'Bad creds' });
  const token = jwt.sign({ id:u._id }, process.env.JWT_SECRET);
  res.json({ success:true, token, user:{ name:u.name } });
};

export const userCredits = async (req, res) => {
  const u = await User.findById(req.userId);
  res.json({ success:true, credits:u.creditBalance, user:{ name:u.name } });
};

export const paymentRazorpay = async (req, res) => {
  const { planId } = req.body;
  const mapping = {
    Basic: { credits:5, amount:10 },
    Advanced: { credits:25, amount:49 },
    Business: { credits:120, amount:249 }
  };
  const p = mapping[planId];
  if (!p) return res.json({ success:false,message:'Bad plan' });
  const t = await Transaction.create({
    userId:req.userId,
    plan:planId, amount:p.amount, credits:p.credits, date:Date.now()
  });
  razor.orders.create({
    amount: p.amount*100,
    currency: process.env.CURRENCY,
    receipt: t._id.toString()
  }, (err, order) => {
    if (err) return res.json({ success:false,message:err });
    res.json({ success:true, order });
  });
};

export const verifyRazorpay = async (req, res) => {
  const { razorpay_order_id } = req.body;
  const ord = await razor.orders.fetch(razorpay_order_id);
  if (ord.status==='paid') {
    const t = await Transaction.findById(ord.receipt);
    if (!t.payment) {
      await User.findByIdAndUpdate(t.userId, { $inc:{ creditBalance:t.credits } });
      await t.updateOne({ payment:true });
    }
    return res.json({ success:true });
  }
  res.json({ success:false,message:'Not paid' });
};

export const paymentStripe = async (req, res) => {
  const { planId } = req.body;
  const mapping = {
    Basic: { credits:5, amount:10 },
    Advanced: { credits:25, amount:49 },
    Business: { credits:120, amount:249 }
  };
  const p = mapping[planId];
  if (!p) return res.json({ success:false,message:'Bad plan' });
  const t = await Transaction.create({
    userId:req.userId,
    plan:planId, amount:p.amount, credits:p.credits, date:Date.now()
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    line_items:[{
      price_data:{
        currency:process.env.CURRENCY.toLowerCase(),
        unit_amount:p.amount*100,
        product_data:{ name:'Imagify Credits' }
      },
      quantity:1
    }],
    mode:'payment',
    success_url:`${req.headers.origin}/verify?success=true&tx=${t._id}`,
    cancel_url:`${req.headers.origin}/verify?success=false&tx=${t._id}`
  });
  res.json({ success:true, session_url:session.url });
};

export const verifyStripe = async (req, res) => {
  const { success, tx } = req.body;
  if (success!=='true') return res.json({ success:false,message:'Failed' });
  const t = await Transaction.findById(tx);
  if (!t.payment) {
    await User.findByIdAndUpdate(t.userId, { $inc:{ creditBalance:t.credits } });
    await t.updateOne({ payment:true });
  }
  res.json({ success:true });
};
