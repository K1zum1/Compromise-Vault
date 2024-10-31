// routes/validateRsa.js
const express = require('express');
const { Key } = require('sshpk');
const router = express.Router();
const { pool } = require('../server');

function validateRSAKey(privKey, pubKey) {
  try {
    const parsedPrivKey = Key.parse(privKey, 'pem');
    const parsedPubKey = Key.parse(pubKey, 'ssh');
    if (parsedPrivKey.type !== 'rsa' || parsedPubKey.type !== 'rsa') {
      console.error('Key type mismatch: Expected RSA keys.');
      return false;
    }
    const publicFromPrivate = parsedPrivKey.toPublic();
    const privKeyFingerprint = publicFromPrivate.fingerprint('sha256').toString();
    const pubKeyFingerprint = parsedPubKey.fingerprint('sha256').toString();
    if (privKeyFingerprint !== pubKeyFingerprint) {
      console.error('Fingerprint mismatch between private and public keys.');
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error parsing RSA keys:', err);
    return false;
  }
}


router.post('/', async (req, res) => {
  const { privKey, pubKey } = req.body;
  if (!privKey || !pubKey) {
    return res.status(400).json({ error: 'Private and public keys are required' });
  }
  if (!validateRSAKey(privKey, pubKey)) {
    return res.status(400).json({ error: 'Invalid RSA key pair' });
  }
  try {
    const result = await pool.query(
      'SELECT * FROM rsa_keys WHERE key = $1',
      [pubKey]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error validating RSA key:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
