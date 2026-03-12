import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Intent from '../models/Intent.js';
import Question from '../models/Question.js';
import Agent from '../models/Agent.js';
import AgentProfile from '../models/AgentProfile.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Intent.deleteMany({});
    await Question.deleteMany({});
    await Agent.deleteMany({});
    await AgentProfile.deleteMany({});

    // Seed users
    const users = [
      { email: 'sales@cultureholidays.com', name: 'Sales User', role: 'sales', password: 'Sales@123' },
      { email: 'marketing@cultureholidays.com', name: 'Marketing User', role: 'marketing', password: 'Marketing@123' },
      { email: 'admin@cultureholidays.com', name: 'Admin User', role: 'admin', password: 'Admin@123' }
    ];

    for (const user of users) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      await User.create({ ...user, passwordHash, password: undefined });
    }
    console.log('Users seeded');

    // Seed intents
    const intents = [
      { intentName: 'Bookings - All', description: 'Show all bookings' },
      { intentName: 'Bookings - Recent', description: 'Show recent bookings' },
      { intentName: 'Bookings - Status', description: 'Booking status summary' },
      { intentName: 'Bookings - First/Last', description: 'First or last bookings' },
      { intentName: 'Bookings - Top', description: 'Top bookings by value' },
      { intentName: 'Payments - All', description: 'Show all payments' },
      { intentName: 'Payments - Recent', description: 'Show recent payments' },
      { intentName: 'Payments - Status', description: 'Payment status summary' },
      { intentName: 'Profile', description: 'Profile information' },
      { intentName: 'Login History', description: 'Login history and details' },
      { intentName: 'Sessions', description: 'Session information' }
    ];

    const createdIntents = await Intent.insertMany(intents);
    console.log('Intents seeded');

    // Map intent names to IDs
    const intentMap = {};
    createdIntents.forEach(intent => {
      intentMap[intent.intentName] = intent._id;
    });

    // Seed questions
    const questions = [
      { text: 'show me all bookings', intent: 'Bookings - All' },
      { text: 'list all my bookings', intent: 'Bookings - All' },
      { text: 'view all bookings', intent: 'Bookings - All' },
      { text: 'get all bookings', intent: 'Bookings - All' },
      { text: 'display bookings', intent: 'Bookings - All' },
      { text: 'all bookings', intent: 'Bookings - All' },
      { text: 'show recent bookings', intent: 'Bookings - Recent' },
      { text: 'latest bookings', intent: 'Bookings - Recent' },
      { text: 'recent bookings', intent: 'Bookings - Recent' },
      { text: 'last 5 bookings', intent: 'Bookings - Recent' },
      { text: 'newest bookings', intent: 'Bookings - Recent' },
      { text: 'what are my recent bookings', intent: 'Bookings - Recent' },
      { text: 'booking status', intent: 'Bookings - Status' },
      { text: 'status summary bookings', intent: 'Bookings - Status' },
      { text: 'bookings by status', intent: 'Bookings - Status' },
      { text: 'booking status summary', intent: 'Bookings - Status' },
      { text: 'how many bookings by status', intent: 'Bookings - Status' },
      { text: 'booking breakdown', intent: 'Bookings - Status' },
      { text: 'first booking', intent: 'Bookings - First/Last' },
      { text: 'oldest booking', intent: 'Bookings - First/Last' },
      { text: 'my first booking', intent: 'Bookings - First/Last' },
      { text: 'earliest booking', intent: 'Bookings - First/Last' },
      { text: 'last booking', intent: 'Bookings - First/Last' },
      { text: 'most recent booking', intent: 'Bookings - First/Last' },
      { text: 'latest booking', intent: 'Bookings - First/Last' },
      { text: 'newest booking', intent: 'Bookings - First/Last' },
      { text: 'my latest booking', intent: 'Bookings - First/Last' },
      { text: 'first 2 bookings', intent: 'Bookings - First/Last' },
      { text: 'first two bookings', intent: 'Bookings - First/Last' },
      { text: 'oldest 2 bookings', intent: 'Bookings - First/Last' },
      { text: 'earliest bookings', intent: 'Bookings - First/Last' },
      { text: 'last 2 bookings', intent: 'Bookings - First/Last' },
      { text: 'last two bookings', intent: 'Bookings - First/Last' },
      { text: 'most recent 2 bookings', intent: 'Bookings - First/Last' },
      { text: 'latest 2 bookings', intent: 'Bookings - First/Last' },
      { text: 'top 3 bookings', intent: 'Bookings - Top' },
      { text: 'top 3 bookings by price', intent: 'Bookings - Top' },
      { text: 'highest value bookings', intent: 'Bookings - Top' },
      { text: 'most expensive bookings', intent: 'Bookings - Top' },
      { text: 'show all payments', intent: 'Payments - All' },
      { text: 'list payments', intent: 'Payments - All' },
      { text: 'view payments', intent: 'Payments - All' },
      { text: 'get all payments', intent: 'Payments - All' },
      { text: 'display payments', intent: 'Payments - All' },
      { text: 'all payments', intent: 'Payments - All' },
      { text: 'recent payments', intent: 'Payments - Recent' },
      { text: 'latest payments', intent: 'Payments - Recent' },
      { text: 'last payments', intent: 'Payments - Recent' },
      { text: 'newest payments', intent: 'Payments - Recent' },
      { text: 'show recent payments', intent: 'Payments - Recent' },
      { text: 'what are my recent payments', intent: 'Payments - Recent' },
      { text: 'payment status', intent: 'Payments - Status' },
      { text: 'payments by status', intent: 'Payments - Status' },
      { text: 'payment status summary', intent: 'Payments - Status' },
      { text: 'status of payments', intent: 'Payments - Status' },
      { text: 'payment summary', intent: 'Payments - Status' },
      { text: 'payment breakdown', intent: 'Payments - Status' },
      { text: 'show my profile', intent: 'Profile' },
      { text: 'view profile', intent: 'Profile' },
      { text: 'my profile', intent: 'Profile' },
      { text: 'profile info', intent: 'Profile' },
      { text: 'show profile', intent: 'Profile' },
      { text: 'profile details', intent: 'Profile' },
      { text: 'detailed profile', intent: 'Profile' },
      { text: 'full profile', intent: 'Profile' },
      { text: 'profile information', intent: 'Profile' },
      { text: 'more profile details', intent: 'Profile' },
      { text: 'login history', intent: 'Login History' },
      { text: 'show login history', intent: 'Login History' },
      { text: 'view login history', intent: 'Login History' },
      { text: 'login records', intent: 'Login History' },
      { text: 'all logins', intent: 'Login History' },
      { text: 'my login history', intent: 'Login History' },
      { text: 'show my logins', intent: 'Login History' },
      { text: 'view my logins', intent: 'Login History' },
      { text: 'last login', intent: 'Login History' },
      { text: 'most recent login', intent: 'Login History' },
      { text: 'latest login', intent: 'Login History' },
      { text: 'when did i last login', intent: 'Login History' },
      { text: 'last login details', intent: 'Login History' },
      { text: 'my last login', intent: 'Login History' },
      { text: 'last login time', intent: 'Login History' },
      { text: 'login summary', intent: 'Login History' },
      { text: 'total logins', intent: 'Login History' },
      { text: 'login count', intent: 'Login History' },
      { text: 'login statistics', intent: 'Login History' },
      { text: 'login overview', intent: 'Login History' },
      { text: 'how many logins', intent: 'Login History' },
      { text: 'active sessions', intent: 'Sessions' },
      { text: 'show active sessions', intent: 'Sessions' },
      { text: 'current sessions', intent: 'Sessions' },
      { text: 'active user sessions', intent: 'Sessions' },
      { text: 'running sessions', intent: 'Sessions' },
      { text: 'view active sessions', intent: 'Sessions' },
      { text: 'session history', intent: 'Sessions' },
      { text: 'all sessions', intent: 'Sessions' },
      { text: 'view sessions', intent: 'Sessions' },
      { text: 'session records', intent: 'Sessions' },
      { text: 'past sessions', intent: 'Sessions' },
      { text: 'my sessions', intent: 'Sessions' },
      { text: 'show sessions', intent: 'Sessions' },
      { text: 'recent sessions', intent: 'Sessions' },
      { text: 'session summary', intent: 'Sessions' },
      { text: 'total sessions', intent: 'Sessions' },
      { text: 'session count', intent: 'Sessions' },
      { text: 'session statistics', intent: 'Sessions' },
      { text: 'session overview', intent: 'Sessions' },
      { text: 'how many sessions', intent: 'Sessions' }
    ];

    const questionDocs = questions.map(q => ({
      questionText: q.text,
      intentId: intentMap[q.intent]
    }));

    await Question.insertMany(questionDocs);
    console.log(`${questionDocs.length} questions seeded`);

    // Import agents if JSON file exists
    try {
      const agentsPath = join(__dirname, '../../agents.json');
      const agentsData = JSON.parse(readFileSync(agentsPath, 'utf-8'));
      if (Array.isArray(agentsData) && agentsData.length > 0) {
        await Agent.insertMany(agentsData);
        console.log(`${agentsData.length} agents imported`);
      }
    } catch (err) {
      console.log('No agents.json file found or error importing:', err.message);
    }

    // Import agent profiles if JSON file exists
    try {
      const profilesPath = join(__dirname, '../../agent_profiles.json');
      const profilesData = JSON.parse(readFileSync(profilesPath, 'utf-8'));
      if (Array.isArray(profilesData) && profilesData.length > 0) {
        await AgentProfile.insertMany(profilesData);
        console.log(`${profilesData.length} agent profiles imported`);
      }
    } catch (err) {
      console.log('No agent_profiles.json file found or error importing:', err.message);
    }

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
