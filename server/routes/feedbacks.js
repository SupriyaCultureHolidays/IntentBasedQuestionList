import express from 'express';
import Feedback from '../models/Feedback.js';
import QuestionClick from '../models/QuestionClick.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/my', verifyToken, async (req, res) => {
  try {
    const { questionId } = req.query;
    const filter = { userId: req.user.email };
    if (questionId) filter.questionId = questionId;

    const feedbacks = await Feedback.find(filter);
    res.json({ success: true, data: feedbacks, message: 'Feedbacks fetched' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { questionId, decision } = req.body;
    
    // Get question details from request or find it
    const questionText = req.body.questionText || '';
    const intentId = req.body.intentId || '';
    
    // Track click in QuestionClick collection
    const click = new QuestionClick({
      questionId,
      questionText,
      intentId,
      userId: req.user.email,
      decision
    });
    await click.save();
    
    // Update or create feedback
    const feedback = await Feedback.findOneAndUpdate(
      { questionId, userId: req.user.email },
      { decision, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: feedback, message: 'Feedback saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
