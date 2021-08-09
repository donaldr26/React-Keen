import React from 'react'
import PropTypes from 'prop-types'

import Lightbox from 'react-image-lightbox'

import MapStatic from '../components/core/MapStatic'
import AudioPlayer from '../components/core/AudioPlayer'

import { tFormat } from '../lib/helper'

export default class MakeSafeJobDetails extends React.Component {
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

		if (data.photo_file_uri) {
			this.images.push(data.photo_file_uri)
			this.imageTitles[data.photo_file_uri] = 'Photo'
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
			{
				!data.site_name || <div className="form-group">
					<span className="headerspan">{kst('Site Name:')}</span>
					<span className="block margin_0_15">{data.site_name}</span>
				</div>
			}
			{
				!data.site_address || <div className="form-group">
					<span className="headerspan">{kst('Site Address:')}</span>
					<span className="block margin_0_15">{data.site_address}</span>
				</div>
			}
			<div className="form-group">
				<span className="headerspan">{kst('Location of the issue:')}</span>
				<span className="block margin_0_15">{data.location}</span>
			</div>

			<h2>{kst('Job Details:')}</h2>
			<div className="form-group">
				<span className="headerspan">{kst('Description of the work:')}</span>
				<span className="block margin_0_15">{data.short_description}</span>
			</div>
			<div className="form-group">
				<span className="headerspan">{kst('Photo of the work:')}</span>
				<span className="block margin_0_15">
					<img
						key={data.photo_file_id}
						src={data.photo_file_uri}
						width={600}
						onClick={() => this.setState({ lbImage: data.photo_file_uri })}
					/>
				</span>
			</div>
			<div className="form-group">
				<span className="headerspan">{kst('Details of the work:')}</span>
				{
					!data.audio_file_uri
						|| <span className="block margin_0_15"><AudioPlayer uri={data.audio_file_uri}/></span>
				}
				{
					!data.work_description
						|| <span className="block margin_0_15">{data.work_description}</span>
				}
			</div>
			<div className="form-group">
				<span className="headerspan">{kst('Job Notification Issued:')}</span>
				<span className="block margin_0_15">{Number(data.job_notification) ? 'Yes' : 'No'}</span>
			</div>

			<h2>{kst('Actions Recorded:')}</h2>
			<div className="form-group">
				<span className="headerspan">
					<strong>{data.user_name}</strong>
					<small> [{tFormat(data.created_on)}]</small>
				</span>
				<span className="block margin_0_15">Completed</span>
			</div>
		</div>)
	}
}

MakeSafeJobDetails.propTypes = {
	data: PropTypes.object.isRequired
}
