require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chatRoutes = require('./routes/chat');

const app = express();

// CORS setup
app.use(cors({ origin: 'http://localhost:3000' })); // React dev server
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('Chatbot backend running ✅'));

// Routes
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err);
});
