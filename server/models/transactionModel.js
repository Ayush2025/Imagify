import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: String,
  plan: String,
  amount: Number,
  credits: Number,
  date: Date,
  payment: { type: Boolean, default: false }
});

export default mongoose.model('Transaction', TransactionSchema);
