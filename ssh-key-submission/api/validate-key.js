// routes/validateKeyTypes.js
const express = require('express');
const validateRSAKey = require('./validate-rsa');
const validateDSSKey = require('./validate-dss');
const validateECDSAKey = require('./validate-ecdsa');
const validateEdKey = require('./validate-ed');
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
    console.error('Validation error: Private and public keys are required.');
    return res.status(400).json({ valid: false, error: 'Private and public keys are required.' });
  }

  const keyType = extractKeyType(publicKey);
  console.log(`Extracted key type: ${keyType}`);

  let isValid = false;
  let error = '';

  try {
    switch (keyType) {
      case 'RSA':
        console.log('Validating RSA key...');
        isValid = validateRSAKey(privateKey, publicKey);
        break;
      case 'DSA':
        console.log('Validating DSA key...');
        isValid = validateDSSKey(privateKey, publicKey);
        break;
      case 'ECDSA':
        console.log('Validating ECDSA key...');
        isValid = validateECDSAKey(privateKey, publicKey);
        break;
      case 'ED25519':
        console.log('Validating ED25519 key...');
        isValid = validateEdKey(privateKey, publicKey);
        break;
      default:
        error = 'Unsupported or invalid key type';
        console.error(`Validation error: ${error}`);
    }
  } catch (validationError) {
    console.error('Error during key validation:', validationError);
    return res.status(500).json({ valid: false, error: 'An error occurred during key validation.', details: validationError.message });
  }

  if (!isValid) {
    console.error(`Key validation failed: ${error || `Invalid ${keyType} key.`}`);
    return res.status(400).json({ valid: false, error: error || `Invalid ${keyType} key.` });
  }

  console.log('Key validation successful.');
  return res.status(200).json({ valid: true, fingerprintValidated: true });
});

module.exports = router;
