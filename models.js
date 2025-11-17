const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  name: String,
  password: String,
  role: { type: String, default: 'student' }, // teacher or student
  createdAt: { type: Date, default: Date.now }
});

const ProjectSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  json: String,
  submitted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Project: mongoose.model('Project', ProjectSchema)
};
