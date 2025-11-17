const express = require('express');
const router = express.Router();
const User = require('./models').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// register (teacher initial or normal register) - limited use
router.post('/register', async (req,res) => {
  const { email, name, password, role } = req.body;
  if(!email || !password) return res.status(400).json({error:'email+password required'});
  if(await User.findOne({email})) return res.status(400).json({error:'email exists'});
  const hash = await bcrypt.hash(password, 10);
  const user = new User({email, name, password:hash, role: role||'student'});
  await user.save();
  res.json({ok:true, id:user._id});
});

// login returns JWT
router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const u = await User.findOne({email});
  if(!u) return res.status(401).json({error:'invalid'});
  const ok = await bcrypt.compare(password, u.password);
  if(!ok) return res.status(401).json({error:'invalid'});
  const token = jwt.sign({id:u._id, role:u.role, name:u.name, email:u.email}, JWT_SECRET, {expiresIn:'12h'});
  res.json({token, role:u.role, name:u.name, email:u.email});
});

// middleware to protect routes
router.use((req,res,next)=>{
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({error:'no token'});
  const token = authHeader.split(' ')[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch(e){ return res.status(401).json({error:'token invalid'}); }
});

module.exports = router;
