// routes/validateEcdsa.js
const express = require('express');
const { Key } = require('sshpk');
const router = express.Router();
const { pool } = require('../server');

function validateECDSAKey(privKey, pubKey) {
  try {
    const parsedPrivKey = Key.parse(privKey, 'pem');
    const parsedPubKey = Key.parse(pubKey, 'ssh');
    if (parsedPrivKey.type !== 'ecdsa' || parsedPubKey.type !== 'ecdsa') return false;
    const publicFromPrivate = parsedPrivKey.toPublic();
    const privKeyFingerprint = publicFromPrivate.fingerprint('sha256').toString();
    const pubKeyFingerprint = parsedPubKey.fingerprint('sha256').toString();
    return privKeyFingerprint === pubKeyFingerprint;
  } catch (err) {
    return false;
  }
}

router.post('/', async (req, res) => {
  const { privKey, pubKey } = req.body;
  if (!privKey || !pubKey) {
    return res.status(400).json({ error: 'Private and public keys are required' });
  }
  if (!validateECDSAKey(privKey, pubKey)) {
    return res.status(400).json({ error: 'Invalid ECDSA key pair' });
  }
  try {
    const result = await pool.query(
      'SELECT * FROM ecdsa_keys WHERE key = $1',
      [pubKey]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error validating ECDSA key:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
