const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/me', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.sub;
        let result = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
        
        // ถ้ายังไม่มี profile ให้สร้างให้อัตโนมัติ
        if (result.rows.length === 0) {
            const newProfile = await pool.query(
                'INSERT INTO user_profiles (user_id, username, email, role) VALUES ($1, $2, $3, $4) RETURNING *',
                [userId, req.user.username, req.user.email, req.user.role]
            );
            return res.json(newProfile.rows[0]);
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/me', authenticateToken, async (req, res) => {
    try {
        const { display_name, bio, avatar_url } = req.body;
        const result = await pool.query(
            'UPDATE user_profiles SET display_name = $1, bio = $2, avatar_url = $3, updated_at = NOW() WHERE user_id = $4 RETURNING *',
            [display_name, bio, avatar_url, req.user.sub]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    try {
        const result = await pool.query('SELECT * FROM user_profiles');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;