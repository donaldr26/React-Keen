import React from 'react'

const AssociateSent = (props) => <div>
	<p>
		Your work invitation has now been sent to <strong>{props.email}</strong>.
	</p>
	<p>
		You will be notified via email when the contractor accepts or rejects your invitation.
	</p>
	<div className="m_top_35">
		<button
			className="btn-s sm bggray"
			onClick={props.onButtonClick}>
			Close
		</button>
	</div>
</div>

export default AssociateSent
