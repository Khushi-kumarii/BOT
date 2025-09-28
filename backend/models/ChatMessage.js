const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  role: { type: String, enum: ['user', 'ai'], required: true },
  content: { type: String, required: true },
  meta: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
