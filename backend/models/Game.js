const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  boardSize: Number,       // ขนาดกระดาน (3x3, 4x4, ...)
  moves: [String],         // ลำดับการเล่น (X:0,0, O:1,2)
  winner: String,          // X, O หรือ Draw
  playedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);
