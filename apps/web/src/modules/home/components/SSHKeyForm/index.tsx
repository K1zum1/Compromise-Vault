// apps/web/src/modules/home/components/SSHKeyForm/index.tsx

import { useEffect, useState } from 'react';
import { http } from '@utils/axios';
import './index.css';

type SSHKeyFormProps = {
    onSubmit: any;
    externalError: any;
};

const SSHKeyForm = ({ onSubmit, externalError }: SSHKeyFormProps) => {
    const [sshPrivKey, setSSHPrivKey] = useState('');
    const [sshPubKey, setSSHPubKey] = useState('');
    const [fingerprint, setFingerprint] = useState(''); // New state for fingerprint
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (externalError) {
            setError(externalError);
            clearError();
        }
    }, [externalError]);

    useEffect(() => {
        const fetchFingerprint = async () => {
            if (sshPubKey.trim()) {
                try {
                    const response = await http.post(`/keys/fingerprint`, {
                        pubKey: sshPubKey,
                    });
                    setFingerprint(response.data?.fingerprint || 'Error computing fingerprint');
                } catch (error) {
                    console.error('Error fetching fingerprint:', error);
                    setFingerprint('Error computing fingerprint');
                }
            } else {
                setFingerprint('');
            }
        };

        fetchFingerprint();
    }, [sshPubKey]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setStatus('Checking SSH key formatting...');

        setTimeout(async () => {
            if (!sshPrivKey.trim() || !sshPubKey.trim()) {
                setError('Please fill out all fields.');
                setStatus('');
                return;
            }

            try {
                setStatus('Comparing fingerprints...');
                const response = await http.post(`/keys/validate`, {
                    privKey: sshPrivKey,
                    pubKey: sshPubKey,
                });

                if (response.data?.data?.valid) {
                    onSubmit({
                        sshPrivKey,
                        sshPubKey,
                        keyType: 'Some key type',
                        fingerprintValidated: response.data?.data?.fingerprintValidated,
                    });
                    setSSHPrivKey('');
                    setSSHPubKey('');
                    clearStatus();
                    clearError();
                } else {
                    setError(response.data?.message);
                    setStatus('');
                    clearStatus();
                }
            } catch (error: any) {
                console.error('Error handling form submission:', error);
                if (error.response) {
                    console.error('Server response:', error.response.data);
                }
                setError('Failed to submit SSH keys. Please try again.');
                setStatus('');
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
                        rows={10}
                        cols={60}
                        placeholder="-----BEGIN TYPE"
                    />
                </div>
                <div className="form-group">
                    <label>Public Key:</label>
                    <textarea
                        value={sshPubKey}
                        onChange={(e) => setSSHPubKey(e.target.value)}
                        required
                        rows={4}
                        cols={60}
                        placeholder="ssh-type"
                    />
                </div>
                <div className="form-group">
                    <label>Fingerprint:</label>
                    <input
                        type="text"
                        value={fingerprint}
                        readOnly
                        placeholder="Fingerprint will be displayed here"
                    />
                </div>
                <button type="submit" className="submitButton">
                    Submit
                </button>
            </form>
            {status && !error && <p className="status">{status}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default SSHKeyForm;