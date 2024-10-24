import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/SSHKeyForm.css';

const SSHKeyForm = ({ onSubmit, externalError }) => {
  const [sshPrivKey, setSSHPrivKey] = useState('');
  const [sshPubKey, setSSHPubKey] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const API_BASE_URL = 'http://localhost:3001';

  useEffect(() => {
    if (externalError) {
      setError(externalError);
      clearError();
    }
  }, [externalError]);

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

      try {
        setStatus('Comparing fingerprints...');
        const response = await axios.post(`${API_BASE_URL}/api/validate-key`, {
          privateKey: sshPrivKey,
          publicKey: sshPubKey
        });

        console.log('Fingerprint Calculation Response:', response.data);

        if (response.data.valid) {
          onSubmit({ sshPrivKey, sshPubKey, keyType: 'Some key type', fingerprintValidated: response.data.fingerprintValidated });
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
        if (error.response) {
          console.error('Server response:', error.response.data);
        }
        setError('Failed to submit SSH keys. Please try again.');
        setStatus('');
        clearError();
        clearStatus();
      }
    }, 1000);
  };

  const clearError = () => {
    setTimeout(() => setError(''), 2000);
  };

  const clearStatus = () => {
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <div className="ssh-key-form"> 
      <form onSubmit={handleSubmit}>
        <div className="form-group"> 
          <label>Private Key:</label>
          <textarea
            value={sshPrivKey}
            onChange={(e) => setSSHPrivKey(e.target.value)}
            required
            rows="4"
            cols="50"
          />
        </div>
        <div className="form-group">
          <label>Public Key:</label>
          <textarea
            value={sshPubKey}
            onChange={(e) => setSSHPubKey(e.target.value)}
            required
            rows="4"
            cols="50"
          />
        </div>
        <button type="submit" className="submitButton">Submit</button>
      </form>
      {status && !error && <p className="status">{status}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SSHKeyForm;
