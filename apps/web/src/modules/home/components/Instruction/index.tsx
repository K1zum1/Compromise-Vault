import './I.css';

type DownloadInstructionsModalProps = {
	onClose: () => void;
};

const DownloadInstructionsModal = ({ onClose }: DownloadInstructionsModalProps) => {
	return (
		<div className="instructions-modal-overlay" onClick={onClose}>
			<div className="instructions-modal-content" onClick={(e) => e.stopPropagation()}>
				<h2>Next Steps</h2>
				<p>
					You have successfully downloaded the OpenSSH Key Revocation List.
				</p>
                <p>Follow these steps to apply the revocation list to your SSHD server:</p>
				<ol>
					<li>Place the KRL file in the appropriate directory, typically <code>/etc/ssh/</code> or the folder where your SSH keys are stored.</li>
					<li>Update your SSH configuration to reference the KRL file. Add or modify the line <code>RevokedKeys /path/to/krl</code> in your <code>sshd_config</code> file.</li>
					<li>Restart the SSH service to apply the changes by running <code>sudo systemctl restart sshd</code>.</li>
					<li>Verify that the revocation list is applied by attempting to connect with a revoked key. You should receive a connection error.</li>
				</ol>
				<button onClick={onClose}>Close</button>
			</div>
		</div>
	);
};

export default DownloadInstructionsModal;
