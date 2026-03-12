import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const { intentId } = req.query;
    const dataPath = path.join(__dirname, '../data/data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const allQuestions = JSON.parse(rawData);
    
    let questions = allQuestions;
    if (intentId) {
      questions = allQuestions.filter(q => q.intent === intentId);
    }
    
    const formattedQuestions = questions.map((q, index) => ({
      _id: `${q.intent}_${index}`,
      intentId: q.intent,
      questionText: q.text,
      isActive: true,
      addedBy: 'system',
      createdAt: new Date()
    }));
    
    res.json({ success: true, data: formattedQuestions, message: 'Questions fetched' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { intentId, questionText } = req.body;
    const dataPath = path.join(__dirname, '../data/data.json');
    
    // Read existing data
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const allQuestions = JSON.parse(rawData);
    
    // Add new question
    const newQuestion = {
      text: questionText,
      intent: intentId
    };
    allQuestions.push(newQuestion);
    
    // Write back to file
    fs.writeFileSync(dataPath, JSON.stringify(allQuestions, null, 2));
    
    const question = {
      _id: `${intentId}_${Date.now()}`,
      intentId,
      questionText,
      isActive: true,
      addedBy: req.user.email,
      createdAt: new Date()
    };
    
    res.json({ success: true, data: question, message: 'Question added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
