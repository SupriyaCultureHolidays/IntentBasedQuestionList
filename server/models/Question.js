import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  intentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intent', required: true },
  questionText: { type: String, required: true },
  addedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model('Question', questionSchema);
