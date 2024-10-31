require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express(); 
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const addKeyRoute = require('./api/add-key');
const validateKeyRoute = require('./api/validate-key');
const validateDssRouter = require('./api/validate-dss');
const validateRsaRouter = require('./api/validate-rsa');
const validateEcdsaRouter = require('./api/validate-ecdsa');
const validateEdRouter = require('./api/validate-ed');

app.use('/api/add-key', addKeyRoute);
app.use('/api/validate-key', validateKeyRoute);
app.use('/api/validate-dss', validateDssRouter);
app.use('/api/validate-rsa', validateRsaRouter);
app.use('/api/validate-ecdsa', validateEcdsaRouter);
app.use('/api/validate-ed', validateEdRouter);


app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Database connection error' });
  }
});
