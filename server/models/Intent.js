import mongoose from 'mongoose';

const intentSchema = new mongoose.Schema({
  intentName: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Intent', intentSchema);
