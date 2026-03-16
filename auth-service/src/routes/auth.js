// ─────────────────────────────────────────────
// POST /api/auth/register (เพิ่มตามข้อกำหนด Set 2)
// ─────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const ip = req.headers['x-real-ip'] || req.ip;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน (username, email, password)' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    // 1. ตรวจสอบว่ามีผู้ใช้นี้อยู่แล้วหรือไม่
    const checkUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2', 
      [normalizedEmail, username]
    );
    
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email หรือ Username นี้มีในระบบแล้ว' });
    }

    // 2. แฮชรหัสผ่านและบันทึกผู้ใช้ใหม่
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, normalizedEmail, passwordHash, 'member']
    );

    const newUser = result.rows[0];

    // 3. บันทึก Log ผ่าน Helper Function ของคุณ
    await logEvent({
      level: 'INFO',
      event: 'REGISTER_SUCCESS',
      userId: newUser.id,
      ip,
      method: 'POST',
      path: '/api/auth/register',
      statusCode: 201,
      message: `User ${newUser.username} registered successfully`,
      meta: { email: newUser.email }
    });

    // 🌟 ข้อควรระวัง: ตามโครงสร้าง Database-per-Service ใน README 
    // ตาราง auth-db ควรจะมีตาราง logs เป็นของตัวเองด้วย 
    // หากต้องการบันทึกลง auth-db โดยตรงตามสเปคของ Set 2 สามารถใช้คำสั่งนี้เพิ่มได้:
    await pool.query(
      'INSERT INTO logs (level, event, user_id, message) VALUES ($1, $2, $3, $4)', 
      ['INFO', 'REGISTER_SUCCESS', newUser.id, `User ${newUser.username} registered`]
    );

    res.status(201).json(newUser);

  } catch (err) {
    console.error('[AUTH] Register error:', err.message);

    await logEvent({
      level: 'ERROR',
      event: 'REGISTER_ERROR',
      ip,
      method: 'POST',
      path: '/api/auth/register',
      statusCode: 500,
      message: err.message,
      meta: { email: normalizedEmail }
    });

    res.status(500).json({ error: 'Server error' });
  }
});