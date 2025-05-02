import mongoose from 'mongoose';

const tipSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  amount: { type: String, required: true },
  memo: { type: String },
  timestamp: { type: String, required: true }
});

export default mongoose.model('Tip', tipSchema);
