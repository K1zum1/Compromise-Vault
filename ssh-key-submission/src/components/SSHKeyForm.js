import React, { useState } from 'react';
import '../style/SSHKeyForm.css';

const SSHKeyForm = () => {
  const [privKey, setPrivKey] = useState('');
  const [pubKey, setPubKey] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      privKey,
      pubKey,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/add-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage('SSH key added successfully!');
      } else {
        setResponseMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setResponseMessage('Failed to add SSH key. Please try again later.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="ssh-key-form">
      <h2>Submit SSH Key</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Private Key:</label>
          <textarea
            value={privKey}
            onChange={(e) => setPrivKey(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Public Key:</label>
          <textarea
            value={pubKey}
            onChange={(e) => setPubKey(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default SSHKeyForm;
