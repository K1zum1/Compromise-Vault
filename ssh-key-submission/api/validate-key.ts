import { NowRequest, NowResponse } from '@vercel/node';
import { validateRSAKey } from '../api/validate-rsa';
import { validateDSSKey } from '../api/validate-dss';
import { validateECDSAKey } from '../api/validate-ecdsa';
import { validateEd25519Key } from '../api/validate-ed';


const extractKeyType = (pubKey: string): string => {
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

export default (req: NowRequest, res: NowResponse) => {
  const { privateKey, publicKey } = req.body;

  if (!privateKey || !publicKey) {
    return res.status(400).json({ valid: false, error: 'Private and public keys are required.' });
  }

  // Extract key type using regex
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
      isValid = validateEd25519Key(privateKey, publicKey);
      break;
    default:
      error = 'Unsupported or invalid key type';
  }

  if (!isValid) {
    return res.status(400).json({ valid: false, error: error || `Invalid ${keyType} key.` });
  }

  return res.status(200).json({ valid: true, fingerprintValidated: true });
};
