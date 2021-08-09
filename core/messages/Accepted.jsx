import React from 'react'

const AcceptedMessage = (props) => <div>
	<p>
		You've accepted a job successfully. You will need to assign staff to the job before work begins, or subcontract the job.
	</p>
	<p>
		Select the job and select Assign Staff to nominate staff members for the job, or select View & Respond to subcontract the job.
	</p>
	<div className="margin_20_0 text-right">
		<button
			className="btn-s party-btn1 bgyellow"
			onClick={props.onButtonClick}>
			Continue
		</button>
	</div>
</div>

export default AcceptedMessage
