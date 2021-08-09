import { uuid } from 'uuidv4'

import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import { FormGroup, ControlLabel, FormControl, Row, Col, Checkbox } from 'react-bootstrap'

import serviceMisc from '../services/misc'

class Questions extends Component {
	constructor(props) {
		super(props)

		this.state = {
			items: (props.data || []).reduce((all, x) => Object.assign(all, { [uuid()]: x }), {})
		}

		this.add = this.add.bind(this)
		this.delete = this.delete.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		if (!Object.keys(this.state.items).length && nextProps.data.length) {
			this.setState({ items: nextProps.data.reduce((all, x) => Object.assign(all, { [uuid()]: x }), {}) })
		}
	}

	get data() {
		return Object.values(this.state.items)
	}

	add(e) {
		e.preventDefault()

		const { items } = this.state
		items[uuid()] = {
			position: Object.keys(items).length + 1,
			text: '',
			photo: 0,
			audio: 0
		}
		this.setState({ items })
	}

	delete(e, uid) {
		e.preventDefault()

		const { items } = this.state
		Reflect.deleteProperty(items, uid)

		Object.keys(items).map((uid, i) => items[uid].position = i + 1)

		this.setState({ items })
	}

	handleChange(e, uid, key) {
		const value = key === 'text' ? e.target.value : e.target.checked

		const { items } = this.state
		items[uid][key] = value

		this.setState({ items })
	}

	render() {
		const { readOnly } = this.props
		const { items } = this.state

		return <form>
			{
				Object.keys(items).map(uid => {
					const item = items[uid]

					return <Row key={uid} className="no-margin">
						<fieldset className="pl-20">
							<legend>
								Question {item.position}
								<small>
									<a href="" className="btn btn-link" onClick={e => this.delete(e, uid)}>delete</a>
								</small>
							</legend>
							<Col lg={12}>
								<FormGroup controlId="text">
									<ControlLabel>Text:</ControlLabel>
									<FormControl
										name="text"
										type="text"
										placeholder="Type your question here"
										value={item.text}
										onChange={e => this.handleChange(e, uid, 'text')}
									/>
								</FormGroup>
								<FormGroup>
									<Checkbox
										inline
										id={`photo-${uid}`}
										checked={item.photo}
										onChange={e => this.handleChange(e, uid, 'photo')}
									>
										TAKE PHOTO REQUIRED?
									</Checkbox>
								</FormGroup>
								<FormGroup>
									<Checkbox
										inline
										id={`audio-${uid}`}
										checked={item.audio}
										onChange={e => this.handleChange(e, uid, 'audio')}
									>
										RECORD AUDIO REQUIRED?
									</Checkbox>
								</FormGroup>
							</Col>
						</fieldset>
					</Row>
				})
			}
			{
				Boolean(readOnly) || <Row className="no-margin">
					<a href="" className="btn btn-link" onClick={this.add}>+ ADD</a>
				</Row>
			}
		</form>
	}
}

export default class Audit extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoading: false,
			isSaving: false,
			data: {}
		}

		this.save = this.save.bind(this)
	}

	componentDidMount() {
		if (this.props.params.id) {
			serviceMisc.getAudit(this.props.params.id)
				.then(({ audit }) => {
					this.setState({ data: {
						name: audit.name,
						questions: JSON.parse(audit.questions)
					} })
				})
				.catch(e => {
					console.error(e)
				})
		} else {
			this.setState({
				data: {
					name: '',
					questions: [
						{
							position: 1,
							text: '',
							photo: false,
							audio: false
						}
					]
				}
			})
		}
	}

	save() {
		this.setState({ isSaving: true })

		const { data } = this.state
		data.questions = JSON.stringify(this.questions.data)

		if (this.props.params.id) {
			serviceMisc.updateAudit(this.props.params.id, data)
				.then(() => {
					this.setState(
						{ isSaving: false },
						() => hashHistory.push('/audits')
					)
				})
				.catch(e => {
					console.error(e)
					this.setState({ isSaving: false })
				})
		} else {
			serviceMisc.addAudit(data)
				.then(() => {
					this.setState(
						{ isSaving: false },
						() => hashHistory.push('/audits')
					)
				})
				.catch(e => {
					console.error(e)
					this.setState({ isSaving: false })
				})
		}
	}

	handleChange(e, key) {
		const value = key === 'name' ? e.target.value : e.target.checked

		const { data } = this.state
		data[key] = value

		this.setState({ data })
	}

	render() {
		const { data } = this.state

		const readOnly = this.props.route.mode === 'view'

		const title = readOnly ? 'Audit Review' : 'Creating an Audit'

		return (<div className="content-section accept_job">

			<h1>{kst(title)}</h1>
			{
				readOnly
					? <h2>{data.name}</h2>
					: <div>
						<FormGroup controlId="name">
							<ControlLabel>{kst('Enter name for audit:')}</ControlLabel>
							<FormControl
								name="name"
								type="text"
								value={data.name || ''}
								placeholder={kst('Audit name')}
								onChange={e => this.handleChange(e, 'name')}
							/>
						</FormGroup>
					</div>
			}
			<div>
				<Questions readOnly={readOnly} data={data.questions || []} ref={ref => this.questions = ref} />
			</div>
			{
				readOnly
					? <div className="margin_40_0">
						<button className="btn-s party-btn1 bggray" onClick={() => hashHistory.goBack()}>{kst('BACK')}</button>
					</div>
					: <div className="margin_40_0">
						<button className="btn-s party-btn1 bggray" onClick={() => hashHistory.goBack()}>{kst('CANCEL')}</button>
						<button className="btn-s party-btn2 bgyellow" disabled={this.state.isSaving} onClick={this.save}>SAVE</button>
					</div>
			}
		</div>)
	}
}
