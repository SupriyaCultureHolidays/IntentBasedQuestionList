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

// Most Common Questions with consensus scoring
router.get('/common-questions', verifyToken, isAdmin, async (req, res) => {
  try {
    const clicks = await QuestionClick.find().sort({ clickedAt: -1 });
    
    const analytics = {};
    clicks.forEach(click => {
      const key = click.questionId;
      if (!analytics[key]) {
        analytics[key] = {
          questionId: click.questionId,
          questionText: click.questionText,
          intentId: click.intentId,
          totalVotes: 0,
          approvedCount: 0,
          rejectedCount: 0,
          users: new Set()
        };
      }
      analytics[key].totalVotes++;
      if (click.decision === 'approved') analytics[key].approvedCount++;
      if (click.decision === 'rejected') analytics[key].rejectedCount++;
      analytics[key].users.add(click.userId);
    });
    
    const result = Object.values(analytics)
      .map(a => {
        const approvalRate = a.totalVotes > 0 ? (a.approvedCount / a.totalVotes) * 100 : 0;
        let status = 'Needs Review';
        if (a.totalVotes >= 3 && approvalRate >= 80) status = 'Ready for Chatbot';
        else if (approvalRate >= 70) status = 'Good Consensus';
        else if (Math.abs(a.approvedCount - a.rejectedCount) <= 1) status = 'Conflict ⚠️';
        
        return {
          questionId: a.questionId,
          questionText: a.questionText,
          intentId: a.intentId,
          totalVotes: a.totalVotes,
          approvedCount: a.approvedCount,
          rejectedCount: a.rejectedCount,
          approvalRate: Math.round(approvalRate),
          status,
          uniqueUsers: a.users.size
        };
      })
      .sort((a, b) => b.totalVotes - a.totalVotes);
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Dashboard summary stats
router.get('/dashboard-stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const clicks = await QuestionClick.find();
    const users = await User.find({ role: { $in: ['sales', 'marketing'] } });
    
    const analytics = {};
    clicks.forEach(click => {
      const key = click.questionId;
      if (!analytics[key]) {
        analytics[key] = { totalVotes: 0, approvedCount: 0, users: new Set() };
      }
      analytics[key].totalVotes++;
      if (click.decision === 'approved') analytics[key].approvedCount++;
      analytics[key].users.add(click.userId);
    });
    
    const questions = Object.values(analytics);
    const totalQuestions = questions.length;
    const chatbotReady = questions.filter(q => q.totalVotes >= 3 && (q.approvedCount / q.totalVotes) >= 0.7).length;
    const overallApprovalRate = clicks.length > 0 ? Math.round((clicks.filter(c => c.decision === 'approved').length / clicks.length) * 100) : 0;
    const pendingReview = questions.filter(q => q.totalVotes < 3).length;
    
    // User activity (users who haven't voted in last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentClicks = clicks.filter(c => new Date(c.clickedAt) > weekAgo);
    const activeUsers = new Set(recentClicks.map(c => c.userId));
    const inactiveUsers = users.filter(u => !activeUsers.has(u.email));
    
    res.json({ 
      success: true, 
      data: {
        totalQuestions,
        chatbotReady,
        overallApprovalRate,
        pendingReview,
        inactiveUsers: inactiveUsers.map(u => ({ name: u.name, email: u.email }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Intent-wise leaderboard
router.get('/intent-leaderboard', verifyToken, isAdmin, async (req, res) => {
  try {
    const clicks = await QuestionClick.find();
    const dataPath = path.join(__dirname, '../data/data.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const uniqueIntents = [...new Set(jsonData.map(q => q.intent))];
    
    const intentStats = {};
    uniqueIntents.forEach(intent => {
      intentStats[intent] = { intentName: intent, questions: {}, totalVotes: 0 };
    });
    
    clicks.forEach(click => {
      if (intentStats[click.intentId]) {
        const key = click.questionId;
        if (!intentStats[click.intentId].questions[key]) {
          intentStats[click.intentId].questions[key] = {
            questionText: click.questionText,
            totalVotes: 0,
            approvedCount: 0
          };
        }
        intentStats[click.intentId].questions[key].totalVotes++;
        intentStats[click.intentId].totalVotes++;
        if (click.decision === 'approved') {
          intentStats[click.intentId].questions[key].approvedCount++;
        }
      }
    });
    
    const result = Object.values(intentStats).map(intent => ({
      intentName: intent.intentName,
      totalVotes: intent.totalVotes,
      topQuestions: Object.values(intent.questions)
        .map(q => ({
          ...q,
          approvalRate: q.totalVotes > 0 ? Math.round((q.approvedCount / q.totalVotes) * 100) : 0
        }))
        .sort((a, b) => b.totalVotes - a.totalVotes)
        .slice(0, 3)
    })).sort((a, b) => b.totalVotes - a.totalVotes);
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Export chatbot-ready questions
router.get('/export-chatbot-ready', verifyToken, isAdmin, async (req, res) => {
  try {
    const clicks = await QuestionClick.find();
    
    const analytics = {};
    clicks.forEach(click => {
      const key = click.questionId;
      if (!analytics[key]) {
        analytics[key] = {
          questionText: click.questionText,
          intentId: click.intentId,
          totalVotes: 0,
          approvedCount: 0
        };
      }
      analytics[key].totalVotes++;
      if (click.decision === 'approved') analytics[key].approvedCount++;
    });
    
    const chatbotReady = Object.values(analytics)
      .filter(q => q.totalVotes >= 3 && (q.approvedCount / q.totalVotes) >= 0.7)
      .map(q => ({
        question: q.questionText,
        intent: q.intentId,
        approvalRate: Math.round((q.approvedCount / q.totalVotes) * 100),
        totalVotes: q.totalVotes
      }))
      .sort((a, b) => b.approvalRate - a.approvalRate);
    
    res.json({ success: true, data: chatbotReady });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
