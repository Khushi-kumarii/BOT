const express = require('express');
const axios = require('axios');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Helper function to call Gemini with retries
async function callGeminiAPI(message, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { temperature: 0.7 }
        }
      );
      return response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (err) {
      const status = err.response?.status;
      if (status === 503 && attempt < retries) {
        console.warn(`Gemini API unavailable (attempt ${attempt}), retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
  return null; // all retries failed
}

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ error: 'sessionId and message required' });
    }

    // Save user message
    await ChatMessage.create({ sessionId, role: 'user', content: message });

    let aiText = `Echo: ${message}`; // fallback

    try {
      const geminiResponse = await callGeminiAPI(message);
      if (geminiResponse) aiText = geminiResponse;
    } catch (err) {
      console.error("Gemini API failed after retries:", err.response?.data || err.message);
    }

    // Save AI response
    await ChatMessage.create({ sessionId, role: 'ai', content: aiText });

    res.json({ reply: aiText, saved: true });
  } catch (err) {
    console.error('Error in /api/chat POST:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET /api/chat/history/:sessionId
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 }).lean();
    return res.json({ sessionId, messages });
  } catch (err) {
    console.error('Error in /api/chat/history:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
