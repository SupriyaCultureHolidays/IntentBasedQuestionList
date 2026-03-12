import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        email,
        name,
        role: 'sales',
        passwordHash: 'not_required'
      });
    } else if (user.name !== name) {
      user.name = name;
      await user.save();
    }

    const token = jwt.sign(
      { email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: { token, user: { email: user.email, name: user.name, role: user.role } },
      message: 'Welcome!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
