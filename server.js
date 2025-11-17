const path = require("path");
app.use(express.static(path.join(__dirname, "frontend")));




/**
 * Miranda-like Option B - Node.js backend
 * - Uses MongoDB (MONGODB_URI env)
 * - JWT auth (SECRET env)
 * - Endpoints: auth, teacher create student, save project, submit, get project list
 */
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const auth = require('./auth');
const api = require('./api');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

// middleware
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.static(__dirname + '/frontend'));

// DB connect
const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/miranda_optb';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log('MongoDB connected'))
  .catch(err=>console.error('MongoDB error', err));

// socket handlers
io.on('connection', socket => {
  console.log('socket connected', socket.id);
  socket.on('join_room', room => { socket.join(room); });
  socket.on('robot_command', data => {
    // broadcast to room
    if(data.room) io.to(data.room).emit('robot_command', data);
  });
});

// expose io to api
app.set('io', io);

// routes
app.use('/api/auth', auth);
app.use('/api', api);

// fallback to index
app.get('/', (req,res) => res.sendFile(__dirname + '/frontend/index.html'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>console.log('Server running on', PORT));
