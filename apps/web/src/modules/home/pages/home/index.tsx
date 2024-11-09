/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react';

import { http } from '@utils/axios';

import InfoModal from '../../components/InfoModal';
import SSHKeyForm from '../../components/SSHKeyForm';

// dotStream.register();

export const Page = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [showModal, setShowModal] = useState(true);

	const handleCloseModal = () => {
		setShowModal(false);
	};

	useEffect(() => {
		setShowModal(true);
	}, []);

	const handleFormSubmit = async ({
		sshPrivKey,
		sshPubKey,
		fingerprintValidated,
	}: any) => {
		setIsLoading(true);
		setSuccess('');
		try {
			const response = await http.post('/keys', {
				privKey: sshPrivKey,
				pubKey: sshPubKey,
				fingerprintValidated,
			});

			if (response.status === 409) {
				throw new Error(
					'This private or public key has already been submitted.',
				);
			}

			if (response.status !== 200) {
				throw new Error('Failed to submit SSH key.');
			}

			console.log('Submitted SSH key successfully:', response.data);
			setSuccess('Submission successful');
			clearSuccess();
		} catch (error: any) {
			console.error('Error:', error);
			setError(error.message);
			clearError();
		} finally {
			setTimeout(() => setIsLoading(false), 1000);
		}
	};

	const handleDownloadJSON = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/api/generatefullData`,
			);
			if (!response.ok) {
				throw new Error('Failed to generate JSON.');
			}
			const data = await response.json();
			const blob = new Blob([JSON.stringify(data, null, 2)], {
				type: 'application/json',
			});
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			a.download = 'revocation-list.json';
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading JSON file:', error);
			setError('Failed to download JSON file.');
			clearError();
		}
	};

	const handleDownloadPubKeys = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/api/generatepubKey`,
			);
			if (!response.ok) {
				throw new Error('Failed to generate public keys.');
			}
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			a.download = 'public-keys.json';
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading public keys file:', error);
			setError('Failed to download public keys file.');
			clearError();
		}
	};

	const clearError = () => {
		setTimeout(() => setError(''), 3000);
	};

	const clearSuccess = () => {
		setTimeout(() => setSuccess(''), 3000);
	};

	return (
		<div>
			<h1 className="titleText" data-text="SSH Key Aggregator">
				SSH Key Aggregator
			</h1>
			<div className="app-container">
				{showModal && <InfoModal onClose={handleCloseModal} />}
				<SSHKeyForm onSubmit={handleFormSubmit} externalError={error} />
			</div>
			{isLoading && (
				<div className="loading-container">
					<p className="loading-text">Submitting your key</p>
				</div>
			)}
			{!isLoading && success && (
				<div className="success-container">
					<p className="success-message">{success}</p>
				</div>
			)}
			<div className="button-container">
				<button onClick={handleDownloadJSON} className="appButton">
					Download Full Data
				</button>
				<button onClick={handleDownloadPubKeys} className="appButton">
					Download Public Keys
				</button>
			</div>
		</div>
	);
};

export default Page;
