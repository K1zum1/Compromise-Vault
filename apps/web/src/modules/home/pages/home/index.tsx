/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react';

import { http } from '@utils/axios';

import InfoModal from '../../components/InfoModal';
import SSHKeyForm from '../../components/SSHKeyForm';
import DownloadInstructionsModal from '../../components/Instruction';


export const Page = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [showModal, setShowModal] = useState(true);
	const [showDownloadModal, setShowDownloadModal] = useState(false); 

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
			setSuccess('Your keys have been submitted');
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
			const response = await http.get(`/keys/krl`, {
				responseType: 'blob',
			});
	
			if (response.status === 400) {
				setError('Error when generating the KRL file');
				clearError();
				return;
			}
	
			const file = new Blob([response.data], {
				type: 'application/x-mspublisher',
			});
	
			const link = document.createElement('a');
			link.href = URL.createObjectURL(file);
			link.download = 'krl_combined.krl.pub';
			link.click();
	
			setShowDownloadModal(true);
		} catch (error) {
			console.error('Error when generating the KRL file:', error);
			setError('Error when generating the KRL file');
			clearError();
		}
	};

	const clearError = () => {
		setTimeout(() => setError(''), 5000);
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
				{showDownloadModal && <DownloadInstructionsModal onClose={() => setShowDownloadModal(false)} />}
				<SSHKeyForm onSubmit={handleFormSubmit} externalError={error} />
			</div>
			{!isLoading && success && (
				<div className="success-container">
					<p className="success-message">{success}</p>
				</div>
			)}
			<div className="button-container">
				<button onClick={handleDownloadJSON} className="appButton">
					Download OpenSSH KRL
				</button>
			</div>
		</div>
	);
}
export default Page;
