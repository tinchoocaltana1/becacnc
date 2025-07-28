const bcrypt = require('bcrypt');
const pool = require('../db');

async function createUser(username, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
        [username, hashedPassword]
    );

    console.log(`User created with ID: ${result.rows[0].id}`);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

createUser('admin', 'admin123');