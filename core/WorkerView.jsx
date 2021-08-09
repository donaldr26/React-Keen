import _ from 'lodash'

import React from 'react'
import PropTypes from 'prop-types'

import Lightbox from 'react-image-lightbox'

import { countryName } from '../../lib/helper'

export default class WorkerView extends React.Component {
	constructor(props) {
		super(props)

		this.groupName = ''

		this.state = {
			lbImage: false
		}

		this.imageTitles = {}
		this.images = []

		this.prepareLbImages = this.prepareLbImages.bind(this)

		this.moveNext = this.moveNext.bind(this)
		this.movePrev = this.movePrev.bind(this)
	}

	componentWillMount() {
		this.prepareLbImages(this.props)
	}

	componentWillReceiveProps(nextProps) {
		this.prepareLbImages(nextProps)
	}

	prepareLbImages(props) {
		const data = props.worker

		if (props.worker.group_name) {
			this.groupName = props.worker.group_name.toLowerCase()

			this.entityName = {
				pah: kst('Contractor'),
				sah: kst('Employee'),
				nah: kst('Notification Employee')
			}[this.groupName] || kst('Worker')
		}

		this.imageTitles = {}
		this.images = []

		if (data.photo_file_id) {
			this.images.push(data.photo_file_uri)
			this.imageTitles[data.photo_file_uri] = `Photo of ${this.entityName}`
		}

		if (data.driver_license_file_id) {
			this.images.push(data.driver_license_file_uri)
			this.imageTitles[data.driver_license_file_uri] = kst('Photographic ID (Driver License)')
		}

		if (data.licenses && data.licenses.length) {
			data.licenses.forEach(license => {
				this.images.push(license.file_uri)
				this.imageTitles[license.file_uri] = kst('License') + ': ' + license.qualification
			})
		}

		if (data.insurances && data.insurances.length) {
			data.insurances.forEach(insurance => {
				this.images.push(insurance.file_uri)
				this.imageTitles[insurance.file_uri] = kst('Insurance') + ': ' + insurance.qualification
			})
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
		const data = this.props.worker
		const { showPhone } = this.props || false

		const lbImageIndex = this.images.indexOf(this.state.lbImage)

		return (<form>
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
			<div className="contact-form">
				<h3>{kst('Personal details:')}</h3>
				<div className="form-group">
					<span className="headerspan">{kst('Full name:')}</span>
					<span className="block margin_0_15">{[data.first_name, data.last_name].join(' ')}</span>
				</div>
				{
					!showPhone || <div className="form-group">
						<span className="headerspan">{kst('Contact number:')}</span>
						<span className="block margin_0_15">{data.phone}</span>
					</div>
				}
				<div className="form-group">
					<span className="headerspan">{kst('Email address:')}</span>
					<span className="block margin_0_15">{data.email}</span>
				</div>
				<div className="form-group">
					<span className="headerspan">{kst('Address:')}</span>
					<span className="block margin_0_15">{data.address_1}</span>
					<span className="block margin_0_15">{data.address_2}</span>
					<span className="block margin_0_15">{data.suburb} <span className="condet-right">{data.state}</span>, {countryName(data.country)}</span>
					<span className="block margin_0_15">{data.postcode}</span>
				</div>

				<div className="form-group">
					<span className="headerspan">{kst('Emergency contact name:')}</span>
					<span className="block margin_0_15">{data.emergency_contact_name}</span>
				</div>

				<div className="form-group">
					<span className="headerspan">{kst('Emergency contact number:')}</span>
					<span className="block margin_0_15">{data.emergency_contact_number}</span>
				</div>

				{
					!data.photo_file_id
						|| <div className="form-group">
							<span className="headerspan">{`Photo of ${this.entityName}:`}</span>
							<span className="block margin_0_15">
								<input
									type="text"
									placeholder={data.photo_file_name}
									className="form-control bg-image-form"
									onClick={() => this.setState({ lbImage: data.photo_file_uri })}
								/>
							</span>
						</div>
				}
				{
					!data.driver_license_file_id
						|| <div className="form-group">
							<span className="headerspan">{kst('Photographic ID (Driver License)')}:</span>
							<span className="block margin_0_15">
								<input
									type="text"
									placeholder={data.driver_license_file_name}
									className="form-control bg-image-form"
									onClick={() => this.setState({ lbImage: data.driver_license_file_uri })}
								/>
							</span>
						</div>
				}

				{
					!(data.licenses || []).length
						|| <div className="form-group">
							<span className="headerspan">{kst('Qualifications:')}</span>
							{
								(data.licenses || []).map(l => {
									return (<div key={l.id}>
										<span className="block margin_0_15">{l.qualification}:</span>
										<span className="block margin_0_15">
											<input
												type="text"
												placeholder={l.file_name}
												className="form-control bg-image-form"
												onClick={() => this.setState({ lbImage: l.file_uri })}
											/>
										</span>
									</div>)
								})
							}
						</div>
				}
				{
					!(data.insurances || []).length
						|| <div className="form-group">
							<span className="headerspan">{kst('Insurances')}:</span>
							{
								(data.insurances || []).map(l => <div key={l.id}>
									<span className="block margin_0_15">{l.insurance}:</span>
									<span className="block margin_0_15">
										<input
											type="text"
											placeholder={l.file_name}
											className="form-control bg-image-form"
											onClick={() => this.setState({ lbImage: l.file_uri })}
										/>
									</span>
								</div>)
							}
						</div>
				}
				{
					this.groupName !== 'sah' || <div className="form-group">
						<span className="headerspan">{kst('Leading hand:')}</span>
						<span className="block margin_0_15">{Number(data.leading_hand) ? 'Yes' : 'No'}</span>
					</div>
				}
				{
					// <div className="form-group">
					// 	<span className="headerspan">SWMS:</span>
					// 	<span className="block margin_0_15">
					// 		<input type="text" placeholder="mugshot.jpg" disabled  className="form-control bg-image-form" id="phid"/>
					// 	</span>
					// </div>
				}
			</div>
		</form>)
	}
}

WorkerView.propTypes = {
	worker: PropTypes.object.isRequired
}
