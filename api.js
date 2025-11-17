const express = require('express');
const router = express.Router();
const Models = require('./models');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// middleware to check token for API routes
router.use((req,res,next)=>{
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error:'no token'});
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch(e){ return res.status(401).json({error:'token invalid'}); }
});

// teacher: create student
router.post('/teacher/create_student', async (req,res)=>{
  if(req.user.role !== 'teacher') return res.status(403).json({error:'forbidden'});
  const {email,name,password} = req.body;
  const bcrypt = require('bcrypt');
  const hash = await bcrypt.hash(password||'student', 10);
  const u = new Models.User({email,name,password:hash,role:'student'});
  await u.save();
  res.json({ok:true, id:u._id});
});

// reset password
router.post('/teacher/reset_password', async (req,res)=>{
  if(req.user.role !== 'teacher') return res.status(403).json({error:'forbidden'});
  const { userId, newPassword } = req.body;
  const bcrypt = require('bcrypt');
  const u = await Models.User.findById(userId);
  if(!u) return res.status(404).json({error:'not found'});
  u.password = await bcrypt.hash(newPassword||'student', 10);
  await u.save();
  res.json({ok:true});
});

// save project
router.post('/project/save', async (req,res)=>{
  const { name, json } = req.body;
  const p = new Models.Project({ ownerId: req.user.id, name, json });
  await p.save();
  res.json({ok:true, id:p._id});
});

// submit project
router.post('/project/submit/:id', async (req,res)=>{
  const pid = req.params.id;
  const p = await Models.Project.findById(pid);
  if(!p) return res.status(404).json({error:'not found'});
  if(p.ownerId.toString() !== req.user.id) return res.status(403).json({error:'cant submit'});
  p.submitted = true;
  await p.save();
  // notify teacher via socket (if available)
  const io = req.app.get('io');
  if(io) io.emit('submission', { projectId: p._id, ownerId: p.ownerId });
  res.json({ok:true});
});

// list projects (teacher sees all, student sees own)
router.get('/projects', async (req,res)=>{
  if(req.user.role === 'teacher'){
    const all = await Models.Project.find().populate('ownerId','name email').sort({createdAt:-1});
    return res.json({ok:true, projects: all});
  } else {
    const mine = await Models.Project.find({ ownerId: req.user.id }).sort({createdAt:-1});
    return res.json({ok:true, projects: mine});
  }
});

// get project
router.get('/project/:id', async (req,res)=>{
  const p = await Models.Project.findById(req.params.id);
  if(!p) return res.status(404).json({error:'not found'});
  if(req.user.role !== 'teacher' && p.ownerId.toString() !== req.user.id) return res.status(403).json({error:'forbidden'});
  res.json({ok:true, project:p});
});

module.exports = router;
