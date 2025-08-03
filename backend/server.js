const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
app.use(cors()); 
app.use(express.json()); 


mongoose.connect('mongodb://127.0.0.1:27017/xo_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log('❌ MongoDB error:', err));
app.use('/api/game', gameRoutes);
app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));

