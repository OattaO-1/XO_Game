const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// บันทึกเกม XO
router.post('/save', async (req, res) => {
  try {
    const { boardSize, moves, winner } = req.body;
    const newGame = new Game({ boardSize, moves, winner });
    await newGame.save();
    res.json({ message: '✅ Game saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ดึงประวัติการเล่นทั้งหมด
router.get('/history', async (req, res) => {
  const games = await Game.find().sort({ playedAt: -1 });
  res.json(games);
});

// ดึง replay ตาม ID เกม
router.get('/replay/:id', async (req, res) => {
  const game = await Game.findById(req.params.id);
  res.json(game);
});
// ✅ ลบประวัติการเล่นทั้งหมด
router.delete('/history', async (req, res) => {
  try {
    const result = await Game.deleteMany({});
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่มีประวัติการเล่นที่จะลบ'
      });
    }
    res.json({
      success: true,
      message: `✅ ลบประวัติการเล่นสำเร็จ ${result.deletedCount} รายการ`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบประวัติ',
      error: err.message
    });
  }
});

const saveGame = async (moves, winner) => {
  await axios.post('http://localhost:5000/api/game/save', { boardSize, moves, winner });
  onSave();
};

module.exports = router;
