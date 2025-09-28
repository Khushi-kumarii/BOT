import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/chat';

export const sendMessage = async (sessionId, message) => {
  console.log('[API] Sending POST request:', message);
  try {
    const res = await axios.post(
      BASE_URL,
      { sessionId, message },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('[API] POST response:', res.data);
    return res.data;
  } catch (err) {
    console.error('[API] POST error:', err.response?.data || err.message);
    return { reply: 'HF API request failed. Echo: ' + message, saved: true };
  }
};

export const getChatHistory = async (sessionId) => {
  try {
    const res = await axios.get(`${BASE_URL}/history/${sessionId}`);
    return res.data.messages;
  } catch (err) {
    console.error('[API] GET error:', err.response?.data || err.message);
    return [];
  }
};
