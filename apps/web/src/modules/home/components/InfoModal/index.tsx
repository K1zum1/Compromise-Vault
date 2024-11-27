import './IM.css';

type InfoModalProps = {
	onClose: () => void;
};

const InfoModal = ({ onClose }: InfoModalProps) => {
	return (
		<div className="info-modal-overlay" onClick={onClose}>
			<div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
				<h2>About This Website</h2>
				<p>
					Please be aware that the following data will be collected
					automatically upon successful submission. These are collected for
					security measures to ensure proper use.
				</p>
				<ul>
					<li>IP Address</li>
					<li>User Agent</li>
					<li>Submission Time/Date</li>
					<li>Referer Tags</li>
				</ul>
				<button onClick={onClose}>Acknowledge</button>
			</div>
		</div>
	);
};

export default InfoModal;
