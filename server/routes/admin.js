import express from 'express';
import Feedback from '../models/Feedback.js';
import QuestionClick from '../models/QuestionClick.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { isAdmin } from '../middleware/isAdmin.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['sales', 'marketing'] } })
      .select('email name role')
      .sort({ name: 1 });
    res.json({ success: true, data: users, message: 'Users fetched' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/feedbacks', verifyToken, isAdmin, async (req, res) => {
  try {
    const clicks = await QuestionClick.find()
      .sort({ clickedAt: -1 })
      .lean();

    const result = clicks.map(c => ({
      _id: c._id,
      userName: c.userId.split('@')[0],
      userEmail: c.userId,
      questionId: c.questionId,
      questionText: c.questionText,
      intent: c.intentId,
      decision: c.decision,
      submittedAt: c.clickedAt
    }));

    res.json({ success: true, data: result, message: 'Feedbacks fetched' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/intents', verifyToken, isAdmin, async (req, res) => {
  try {
    const dataPath = path.join(__dirname, '../data/data.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    const uniqueIntents = [...new Set(jsonData.map(q => q.intent))];
    const intents = uniqueIntents.map((intent, index) => ({
      _id: intent,
      intentName: intent
    }));
    
    res.json({ success: true, data: intents, message: 'Intents fetched' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/question-analytics', verifyToken, isAdmin, async (req, res) => {
  try {
    const { intentId, decision } = req.query;
    
    const filter = {};
    if (intentId) filter.intentId = intentId;
    if (decision) filter.decision = decision;
    
    const clicks = await QuestionClick.find(filter).sort({ clickedAt: -1 });
    
    // Aggregate clicks by question
    const analytics = {};
    clicks.forEach(click => {
      const key = click.questionId;
      if (!analytics[key]) {
        analytics[key] = {
          questionId: click.questionId,
          questionText: click.questionText,
          intentId: click.intentId,
          totalClicks: 0,
          approvedCount: 0,
          rejectedCount: 0,
          users: new Set()
        };
      }
      analytics[key].totalClicks++;
      if (click.decision === 'approved') analytics[key].approvedCount++;
      if (click.decision === 'rejected') analytics[key].rejectedCount++;
      analytics[key].users.add(click.userId);
    });
    
    const result = Object.values(analytics)
      .map(a => ({
        ...a,
        uniqueUsers: a.users.size,
        users: undefined
      }))
      .sort((a, b) => b.totalClicks - a.totalClicks);
    
    res.json({ success: true, data: result, message: 'Analytics fetched' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
