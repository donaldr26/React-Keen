import React from 'react'

const NotImplemented = (props) => <div>
	<p>
		{kst('This feature is not implemented yet. Coming soon...')}
	</p>
	<div className="m_top_35">
		<button
			className="btn-s sm bggray"
			onClick={props.onButtonClick}>
			Close
		</button>
	</div>
</div>

export default NotImplemented
