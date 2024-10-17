// routes/validateKeyTypes.js
const express = require('express');
const { validateRSAKey } = require('./validateRsa');
const { validateDSSKey } = require('./validateDss');
const { validateECDSAKey } = require('./validateEcdsa');
const { validateEdKey } = require('./validateEd');
const router = express.Router();

const extractKeyType = (pubKey) => {
  const keyTypePatterns = {
    'ssh-rsa': 'RSA',
    'ssh-dss': 'DSA',
    'ssh-ed25519': 'ED25519',
    'ecdsa-sha2-nistp256': 'ECDSA',
    'ecdsa-sha2-nistp384': 'ECDSA',
    'ecdsa-sha2-nistp521': 'ECDSA'
  };

  for (const pattern in keyTypePatterns) {
    if (pubKey.startsWith(pattern)) {
      return keyTypePatterns[pattern];
    }
  }

  return 'UNKNOWN';
};

router.post('/', (req, res) => {
  const { privateKey, publicKey } = req.body;

  if (!privateKey || !publicKey) {
    return res.status(400).json({ valid: false, error: 'Private and public keys are required.' });
  }

  const keyType = extractKeyType(publicKey);

  let isValid = false;
  let error = '';

  switch (keyType) {
    case 'RSA':
      isValid = validateRSAKey(privateKey, publicKey);
      break;
    case 'DSA':
      isValid = validateDSSKey(privateKey, publicKey);
      break;
    case 'ECDSA':
      isValid = validateECDSAKey(privateKey, publicKey);
      break;
    case 'ED25519':
      isValid = validateEdKey(privateKey, publicKey);
      break;
    default:
      error = 'Unsupported or invalid key type';
  }

  if (!isValid) {
    return res.status(400).json({ valid: false, error: error || `Invalid ${keyType} key.` });
  }

  return res.status(200).json({ valid: true, fingerprintValidated: true });
});

module.exports = router;