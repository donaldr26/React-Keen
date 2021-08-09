import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import Lightbox from 'react-image-lightbox'

import AudioPlayer from './core/AudioPlayer'

import serviceMisc from '../services/misc'
import { tFormat } from '../lib/helper.js'

export default class AuditReview extends Component {
	constructor(props) {
		super(props)

		this.state = {
			lbImage: false,
			isLoading: false,
			audit: {},
			answersByUser: {}
		}
	}

	componentWillMount() {
		this.setState({ isLoading: true })

		serviceMisc.getAudit(this.props.params.id)
			.then(({ audit, answers }) => {
				const answersByUser = answers.reduce((all, x) => {
					all[x.user_id] = {
						name: [x.user_first_name, x.user_last_name].join(' '),
						answers: answers.filter(a => a.user_id === x.user_id)
					}
					all[x.user_id].answers.sort((a, b) => {
						if (a.created_on > b.created_on) return 1
						if (a.created_on < b.created_on) return -1

						return 0
					})

					return all
				}, {})

				this.setState({ audit, answersByUser, isLoading: false })
			})
			.catch(e => {
				console.error(e)
				this.setState({ isLoading: false })
			})
	}

	showImage(lbImage, e) {
		e.preventDefault()
		this.setState({ lbImage })
	}

	render() {
		const { audit, answersByUser, isLoading } = this.state

		return (<div className="content-section accept_job">
			{
				!this.state.lbImage
					|| <Lightbox
						mainSrc={this.state.lbImage}
						onCloseRequest={() => this.setState({ lbImage: false })}
					/>
			}
			<h1>{kst('Audit review')} <small>{audit.name}</small></h1>
			<div>
				{
					isLoading
						? <div><h2>Loading answers</h2></div>
						: <div>
							{
								Boolean(Object.keys(answersByUser).length) || <div>
									<h2>No recorded answers</h2>
									<p>
										To review the audit answers, please complete the Audit using our Keen Safety app.
									</p>
								</div>
							}
							{
								Object.keys(answersByUser).map(userId => {
									const data = answersByUser[userId]

									return <div key={userId}>
										<h2>{data.name}</h2>
										{
											data.answers.map(x => <div key={x.id}>
												<strong>{ tFormat(x.created_on) }</strong>
												<div style={{ marginTop: '20px' }}><i>{x.question}</i></div>
												<div style={{ marginLeft: '20px' }}>
													<div>{x.answer}</div>
													{ !x.photo_file_uri || <div><a href="#" onClick={this.showImage.bind(this, x.photo_file_uri)}>Photo</a></div> }
													{' '}
													{ !x.audio_file_uri || <div><AudioPlayer uri={x.audio_file_uri} /></div> }
													{' '}
													{ !x.audio_text || <div>{x.audio_text}</div> }
												</div>
											</div>)
										}
									</div>
								})
							}
						</div>
				}
			</div>
			<div className="margin_40_0">
				<button className="btn-s party-btn1 bggray" onClick={() => hashHistory.goBack()}>{kst('BACK')}</button>
			</div>
		</div>)
	}
}
