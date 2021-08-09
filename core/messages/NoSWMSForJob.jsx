import React from 'react'

const NoSWMSForJob = (props) => <div>
	<p>
		SWMS doesn't exist for the Job
	</p>
	<div className="m_top_35">
		<button
			className="btn-s sm bggray"
			onClick={props.onButtonClick}>
			Close
		</button>
	</div>
</div>

export default NoSWMSForJob
