import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  userId: { type: String, required: true },
  decision: { type: String, enum: ['approved', 'rejected'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

feedbackSchema.index({ questionId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Feedback', feedbackSchema);
