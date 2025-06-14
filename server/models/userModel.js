import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  creditBalance: { type: Number, default: 0 }
});

export default mongoose.model('User', UserSchema);
