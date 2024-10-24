const express = require('express');
const { Key } = require('sshpk');
const router = express.Router();
const { pool } = require('../server');

function validateDSSKey(privKey, pubKey) {
  try {
    const parsedPrivKey = Key.parse(privKey, 'pem');
    const parsedPubKey = Key.parse(pubKey, 'ssh');
    if (parsedPrivKey.type !== 'dss' || parsedPubKey.type !== 'dss') return false;
    const publicFromPrivate = parsedPrivKey.toPublic();
    const privKeyFingerprint = publicFromPrivate.fingerprint('sha256').toString();
    const pubKeyFingerprint = parsedPubKey.fingerprint('sha256').toString();
    return privKeyFingerprint === pubKeyFingerprint;
  } catch (err) {
    console.error('Error during key validation:', err); 
    return false;
  }
}

router.post('/', async (req, res) => {
  const { privKey, pubKey } = req.body;
  if (!privKey || !pubKey) {
    return res.status(400).json({ error: 'Private and public keys are required' });
  }
  if (!validateDSSKey(privKey, pubKey)) {
    return res.status(400).json({ error: 'Invalid DSS key pair' });
  }
  try {
    const result = await pool.query(
      'SELECT * FROM dss_keys WHERE key = $1',
      [pubKey]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error validating DSS key:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
