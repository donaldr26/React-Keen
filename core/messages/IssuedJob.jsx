import React from 'react'

const IssuedJobMessage = (props) => <div>
	<p>
		You've issued a job successfully, however, this job still needs to be accepted before work can begin.
	</p>
	<p>
		Go to the Accept a Job tab in the menu to accept a job.
	</p>
	<div className="margin_20_0 text-right">
		<button
			className="btn-s party-btn1 bgyellow"
			onClick={props.onButtonClick}>
			Continue
		</button>
	</div>
</div>

export default IssuedJobMessage
