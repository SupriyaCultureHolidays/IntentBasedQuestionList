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
    const dataPath = path.join(__dirname, '../data/data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const questions = JSON.parse(rawData);
    
    const intents = [...new Set(questions.map(q => q.intent))]
      .sort()
      .map(intent => ({
        _id: intent,
        intentName: intent.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      }));
    
    res.json({ success: true, data: intents, message: 'Intents fetched' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
