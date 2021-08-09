import React from 'react'
import PropTypes from 'prop-types'

import Lightbox from 'react-image-lightbox'

import MapStatic from '../components/core/MapStatic'
import AudioPlayer from '../components/core/AudioPlayer'

import { tFormat } from '../lib/helper'

export default class TaskDetails extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			lbImage: false
		}

		this.imageTitles = {}
		this.images = []

		this.prepareLbImages = this.prepareLbImages.bind(this)

		this.moveNext = this.moveNext.bind(this)
		this.movePrev = this.movePrev.bind(this)
	}

	componentDidMount() {
		this.prepareLbImages(this.props)
	}

	componentWillReceiveProps(nextProps) {
		this.prepareLbImages(nextProps)
	}

	prepareLbImages(props) {
		const data = props.data

		this.imageTitles = {}
		this.images = []

		if (data.in_issue_files) {
			data.in_issue_files.forEach(file => {
				this.images.push(file.uri)
				this.imageTitles[file.uri] = 'Photo of the issue'
			})
		}

		if (data.fix_photo_file) {
			this.images.push(data.fix_photo_file.file_uri)
			this.imageTitles[data.fix_photo_file.file_uri] = 'Photo of the fix'
		}
		if (data.clean_photo_file) {
			this.images.push(data.clean_photo_file.file_uri)
			this.imageTitles[data.clean_photo_file.file_uri] = 'Photo of rubbish removed'
		}
	}

	moveNext() {
		const lbImageIndex = this.images.indexOf(this.state.lbImage)
		const index = (lbImageIndex + 1) % this.images.length
		this.setState({ lbImage: this.images[index] });
	}

	movePrev() {
		const lbImageIndex = this.images.indexOf(this.state.lbImage)
		const index = (lbImageIndex + this.images.length - 1) % this.images.length
		this.setState({ lbImage: this.images[index] });
	}

	render() {
		const data = this.props.data
		const lbImageIndex = this.images.indexOf(this.state.lbImage)

		return (<div className="contact-form">
			{
				!this.state.lbImage
					|| <Lightbox
						onMovePrevRequest={this.movePrev}
						onMoveNextRequest={this.moveNext}
						mainSrc={this.images[lbImageIndex]}
						nextSrc={this.images[(lbImageIndex + 1) % this.images.length]}
						prevSrc={this.images[(lbImageIndex + this.images.length - 1) % this.images.length]}
						imageTitle={this.imageTitles[this.state.lbImage]}
						onCloseRequest={() => this.setState({ lbImage: false })}
					/>
			}
			<h2>{kst('Staff Details')}</h2>
			<div className="form-group">
				<span className="headerspan">{kst('Submitted_by:')}</span>
				<span className="block margin_0_15">{data.user_name}</span>
			</div>
			<div className="form-group">
				<span className="headerspan">{kst('Date submitted:')}</span>
				<span className="block margin_0_15">{tFormat(data.created_on)}</span>
			</div>
			{
				!data.geo_lat || !data.geo_lng ||
				<div className="form-group">
					<span className="headerspan">{kst('GPS Location:')}</span>
					<span className="block margin_0_15">
						<MapStatic
							zoom={13}
							center={`${data.geo_lat},${data.geo_lng}`}
							markers={[{
								geo: { lat: data.geo_lat, lng: data.geo_lng },
								color: 'red'
							}]}
						/>
					</span>
				</div>
			}

			<h2>{kst('Location Details:')}</h2>
			<div className="form-group">
				<span className="headerspan">{kst('Site Name:')}</span>
				<span className="block margin_0_15">{data.site_name}</span>
			</div>
			<div className="form-group">
				<span className="headerspan">{kst('Site Address:')}</span>
				<span className="block margin_0_15">{data.site_address}</span>
			</div>
			<div className="form-group">
				<span className="headerspan">{kst('Location of the issue:')}</span>
				<span className="block margin_0_15">{data.location}</span>
			</div>

			<h2>{kst('Job Details:')}</h2>
			<div className="form-group">
				<span className="headerspan">{kst('Description of the issue:')}</span>
				<span className="block margin_0_15">{data.teaser}</span>
			</div>
			<div className="form-group">
				<span className="headerspan">{kst('Photo of the issue:')}</span>
				<span className="block margin_0_15">
					{
						(data.in_issue_files || []).map(file => <img
							key={file.id}
							src={file.uri}
							width={600}
							onClick={() => this.setState({ lbImage: file.uri })}
						/>)
					}
					{ Boolean(data.in_issue_files.length) || 'No photo taken' }
				</span>
			</div>
			<div className="form-group">
				<span className="headerspan">{kst('Details of the work required:')}</span>
				{
					!data.issue_audio_file
						|| <span className="block margin_0_15"><AudioPlayer uri={data.issue_audio_file.file_uri}/></span>
				}
				{
					!data.issue_text
						|| <span className="block margin_0_15">{data.issue_text}</span>
				}
			</div>
			{
				!data.fix_photo_file ||
				<div className="form-group">
					<span className="headerspan">{kst('Photo of the fix:')}</span>
					<span className="block margin_0_15">
						{
							data.fix_photo_file
								? <img
									src={data.fix_photo_file.file_uri}
									width={600}
									onClick={() => this.setState({ lbImage: data.fix_photo_file.file_uri })}
								/>
							: 'No photo taken'
						}
					</span>
				</div>
			}
			{
				!data.clean_photo_file ||
				<div className="form-group">
					<span className="headerspan">{kst('Photo of the rubbish removed:')}</span>
					<span className="block margin_0_15">
						{
							data.clean_photo_file
								? <img
									src={data.clean_photo_file.file_uri}
									width={600}
									onClick={() => this.setState({ lbImage: data.clean_photo_file.file_uri })}
								/>
							: 'No photo taken'
						}
					</span>
				</div>
			}

			<h2>{kst('Actions recorded:')}</h2>
			{
				(data.activities || []).length
					? (data.activities || []).map(activity => {
						let text = {
							issue: 'Job notification issued',
							assign: 'Assigned to staff',
							start: 'Started Job',
							intermediate: activity.description_text,
							complete: 'Completed'
						}[activity.type] || 'Unknown activity type'

						if (activity.type === 'assign' && typeof activity.assigned_user_id !== 'undefined') {
							const assignee = [activity.assigned_user_first_name, activity.assigned_user_last_name].join(' ')
							text = `Assigned to ${assignee}`
						}

						return <div id={activity.id} key={activity.id} className="form-group">
							<span className="headerspan">
								<strong>{activity.user_name}</strong>
								<small> [{tFormat(activity.created_on)}]</small>
							</span>
							<span className="block margin_0_15">{text}</span>
							{
								activity.type !== 'complete' ||
								<span className="block margin_0_15"><cite>"{data.fix_text}"</cite></span>
							}
						</div>
					})
					: <p>{kst('No activities recorded so far.')}</p>
			}

		</div>)
	}
}

TaskDetails.propTypes = {
	data: PropTypes.object.isRequired
}
