# Culture Holidays - FAQ Management System
## Project Documentation

A full-stack FAQ Management System for sales/marketing staff to curate chatbot FAQs by intent category.

## Tech Stack

- **Frontend**: React 18, React Router v6, Axios, React Hot Toast
- **Backend**: Node.js, Express.js (ES6 modules)
- **Database**: MongoDB (local)
- **Authentication**: JWT with bcryptjs

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally on port 27017)
- npm or yarn

## Installation

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Configure Environment Variables

**Backend Environment (.env in server folder):**

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/culture_holidays
JWT_SECRET=culture_holidays_secret_key_2024
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend Environment (.env in client folder):**

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Culture Holidays FAQ System
```

### 4. Seed the Database

Make sure MongoDB is running, then seed the database:

```bash
cd server
npm run seed
```

This will create:
- 3 test users (sales, marketing, admin)
- 8 intent categories
- Import agents and agent_profiles if JSON files exist

## Running the Application

### Development Mode

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Test Access

Simply enter any name and email to access the system. The system will:
- Create a new user if the email doesn't exist
- Update the name if the email already exists
- All new users are assigned the "sales" role by default

### Pre-seeded Admin User
If you want admin access, use:
- Email: `admin@cultureholidays.com`
- Name: Any name (e.g., "Admin User")

## Features

### Sales/Marketing Dashboard (`/dashboard`)

1. **Intent Sidebar**: Browse all FAQ intent categories
2. **Question Management**:
   - View all questions for selected intent
   - Add new questions
   - Edit question text (saves as edited version)
   - Approve/Reject questions with toggle functionality
3. **Feedback System**: Track your approvals and rejections

### Admin Dashboard (`/admin`)

1. **Feedback Report**: View all user feedbacks
2. **Filters**:
   - Filter by User
   - Filter by Intent
   - Filter by Decision (Approved/Rejected)
3. **Export**: Download filtered data as CSV
4. **Pagination**: 20 records per page

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Intents
- `GET /api/intents` - Get all intents

### Questions
- `GET /api/questions?intentId=xxx` - Get questions by intent
- `POST /api/questions` - Add new question

### Feedbacks
- `GET /api/feedbacks/my` - Get current user's feedbacks
- `POST /api/feedbacks` - Submit feedback
- `PUT /api/feedbacks/:id` - Update feedback
- `DELETE /api/feedbacks/:id` - Remove feedback

### Admin
- `GET /api/admin/users` - Get all sales/marketing users
- `GET /api/admin/feedbacks` - Get all feedbacks with filters

## Database Collections

1. **users** - Sales/marketing/admin users
2. **intents** - FAQ intent categories
3. **questions** - FAQ questions
4. **feedbacks** - User feedback on questions
5. **agents** - Agent data (optional import)
6. **agent_profiles** - Agent profile data (optional import)

## Project Structure

```
IntentQuestionList/
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── QuestionPanel.jsx
│   │   │   ├── QuestionRow.jsx
│   │   │   ├── AddQuestionModal.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminTable.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Intent.js
│   │   ├── Question.js
│   │   ├── Feedback.js
│   │   ├── Agent.js
│   │   └── AgentProfile.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── intents.js
│   │   ├── questions.js
│   │   ├── feedbacks.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── verifyToken.js
│   │   └── isAdmin.js
│   ├── seed/
│   │   └── seedData.js
│   ├── server.js
│   ├── .env
│   └── package.json
└── README.md
```

## Security Features

- All passwords are hashed using bcryptjs
- JWT tokens expire after 24 hours
- CORS is enabled for localhost:3000
- MongoDB must be running before starting the server
- Feedback is unique per user per question (enforced by compound index)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or start MongoDB service
- Check if port 27017 is available

### Port Already in Use
- Backend: Change `PORT` in `server/.env`
- Frontend: Change `VITE_API_BASE_URL` in `client/.env` if backend port changes

### CORS Issues
- Verify `CLIENT_URL` in `server/.env` matches your frontend port
- Update `VITE_API_BASE_URL` in `client/.env` if backend URL changes