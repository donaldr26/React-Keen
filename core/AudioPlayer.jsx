import React from 'react'
import PropTypes from 'prop-types'
import Sound from 'react-sound'

export default class AudioPlayer extends React.Component {
	constructor(props) {
		super(props)

		this.captions = {
			[Sound.status.PLAYING]: 'Pause',
			[Sound.status.STOPPED]: 'Play',
			[Sound.status.PAUSED]: 'Continue'
		}
		this.icons = {
			[Sound.status.PLAYING]: 'pause',
			[Sound.status.STOPPED]: 'play-circle',
			[Sound.status.PAUSED]: 'play-circle'
		}
		this.statuses = {
			[Sound.status.PLAYING]: Sound.status.PAUSED,
			[Sound.status.STOPPED]: Sound.status.PLAYING,
			[Sound.status.PAUSED]: Sound.status.PLAYING
		}

		const playStatus = props.playStatus || Sound.status.STOPPED
		this.state = {
			uri: props.uri,
			playStatus
		}

		this.changePlaying = this.changePlaying.bind(this)
	}

	changePlaying(e, status) {
		if (e) e.preventDefault()

		const playStatus = status || this.statuses[this.state.playStatus]
		this.setState({ playStatus })
	}

	render() {
		return (<a href="#" className="btn btn-default" onClick={(e) => this.changePlaying(e)}>
			<span className={`glyphicon glyphicon-${this.icons[this.state.playStatus]}`}/> {this.captions[this.state.playStatus]}
			<Sound
				url={this.state.uri}
				playStatus={this.state.playStatus}
				onFinishedPlaying={() => this.changePlaying(null, Sound.status.STOPPED)}
			/>
		</a>)
	}
}

AudioPlayer.propTypes = {
	playStatus: PropTypes.string,
	uri: PropTypes.string.isRequired
}
