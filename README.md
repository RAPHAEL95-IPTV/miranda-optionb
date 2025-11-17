Miranda-like Option B - Delivered ZIP
====================================

Contents:
- server.js : Node.js backend (Express + Socket.IO)
- auth.js, api.js, models.js : backend modules (JWT auth, API)
- frontend/ : static frontend pages (login, teacher, student, editor, sim)
- package.json : dependencies

Quickstart (local):
1) Install Node.js 18+
2) In project root:
   npm install
3) Set environment variables (optional):
   export MONGODB_URI="your_mongo_here"
   export JWT_SECRET="choose_a_secret"
4) Start:
   node server.js
5) Open http://localhost:3000/frontend/login.html

Notes:
- Register a teacher account via POST /api/auth/register or create initial docs in DB.
- This project is a functional MVP demonstrating multi-robot sim, Blockly editor,
  teacher/student accounts, save/submit projects. For production, secure JWT storage,
  HTTPS, password reset via email, rate-limiting and input sanitization are required.
