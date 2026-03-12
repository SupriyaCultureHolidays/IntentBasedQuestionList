import mongoose from 'mongoose';

const questionClickSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  intentId: { type: String, required: true },
  userId: { type: String, required: true },
  decision: { type: String, enum: ['approved', 'rejected'], required: true },
  clickedAt: { type: Date, default: Date.now }
});

questionClickSchema.index({ questionId: 1, userId: 1, decision: 1 });

export default mongoose.model('QuestionClick', questionClickSchema);
