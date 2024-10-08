import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/SSHKeyForm.css';

const SSHKeyForm = ({ onSubmit, externalError }) => {
  const [sshPrivKey, setSSHPrivKey] = useState('');
  const [sshPubKey, setSSHPubKey] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (externalError) {
      setError(externalError);
      clearError();
    }
  }, [externalError]);

  const keyTypeMap = new Map([
    ['ssh-rsa', 'RSA'],
    ['ssh-dss', 'DSA'],
    ['ssh-ed25519', 'ED25519'],
    ['ecdsa-sha2-nistp256', 'ECDSA 256'],
    ['ecdsa-sha2-nistp384', 'ECDSA 384'],
    ['ecdsa-sha2-nistp521', 'ECDSA 521']
  ]);

  const extractKeyType = (pubKey) => {
    for (const [key, value] of keyTypeMap) {
      if (pubKey.startsWith(key)) {
        return value;
      }
    }
    return 'UNKNOWN INVALID KEY';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('Checking SSH key formatting...');

    setTimeout(async () => {
      if (!sshPrivKey.trim() || !sshPubKey.trim()) {
        setError('Please fill out all fields.');
        setStatus('');
        clearError();
        clearStatus();
        return;
      }

      const isPrivKeyEncrypted = isPassphraseProtected(sshPrivKey);

      if (isPrivKeyEncrypted) {
        setError('SSH private key is passphrase-protected. Please enter only non-passphrase protected keys.');
        setStatus('');
        clearError();
        clearStatus();
      } else {
        try {
          const keyType = extractKeyType(sshPubKey);
          setStatus('Comparing fingerprints...');
          const response = await axios.post('/api/validate-key', {
            privateKey: sshPrivKey,
            publicKey: sshPubKey
          });
                 

          console.log('Fingerprint Calculation Response:', response.data);

          if (response.data.valid) {
            onSubmit({ sshPrivKey, sshPubKey, keyType, fingerprintValidated: response.data.fingerprintValidated, setError });
            setSSHPrivKey('');
            setSSHPubKey('');
            clearStatus();
            clearError();
          } else {
            setError('The private and public keys do not match.');
            setStatus('');
            clearError();
            clearStatus();
          }
        } catch (error) {
          console.error('Error handling form submission:', error);
          setError('Failed to submit SSH keys. Please try again.');
          setStatus('');
          clearError();
          clearStatus();
        }
      }
    }, 1000);
  };

  const isPassphraseProtected = (privKey) => {
    return privKey.includes('Proc-Type: 4,ENCRYPTED') && privKey.includes('DEK-Info');
  };

  const clearError = () => {
    setTimeout(() => setError(''), 2000);
  };

  const clearStatus = () => {
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="message-placeholder">
        {status && !error && <p className="status">{status}</p>}
        {error && <p className="error">{error}</p>}
      </div>
      <textarea
        value={sshPrivKey}
        onChange={(e) => setSSHPrivKey(e.target.value)}
        placeholder="Enter your SSH Private Key..."
        rows="4"
        cols="50"
        autoComplete="on"
      />
      <textarea
        value={sshPubKey}
        onChange={(e) => setSSHPubKey(e.target.value)}
        placeholder="Enter your SSH Public Key..."
        rows="4"
        cols="50"
        autoComplete="on"
      />
      <button type="submit" className='submitButton'>SUBMIT</button>
    </form>
  );
};

export default SSHKeyForm;
