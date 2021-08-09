import React from 'react'
import PropTypes from 'prop-types'

import { tFormat } from '../../lib/helper'

export default class TasksTable extends React.Component {
	rowClick(id) {
		if (typeof this.props.onRowClick === 'function') this.props.onRowClick(id)
	}

	render() {
		return (<div className="table">
			<table>
				<caption>{this.props.caption}</caption>
				<tbody>
					<tr>
						<th>{kst('JOB NO')}</th>
						<th>{kst('SUBMITTED BY')}</th>
						<th>{kst('DATE')}</th>
						<th>{kst('SITE NAME')}</th>
						<th>{kst('SITE ADDRESS')}</th>
						<th>{kst('JOB DESCRIPTION')}</th>
						<th>{kst('JOB STATUS')}</th>
					</tr>
					{
						this.props.isLoading
							? <tr><td colSpan={7}>{kst('Loading')}</td></tr>
							: (this.props.items || []).map(item => <tr
								key={item.id}
								className={this.props.selectedId == item.id ? 'active' : ''}
								onClick={this.rowClick.bind(this, item.id)}
							>
								<td>{item.id}</td>
								<td>{item.user_name}</td>
								<td>{tFormat(item.created_on)}</td>
								<td>{item.site_name}</td>
								<td>{item.site_address}</td>
								<td>{item.teaser}</td>
								<td>{item.status}</td>
							</tr>)
					}
				</tbody>
			</table>
		</div>)
	}
}

TasksTable.propTypes = {
	caption: PropTypes.string,
	selectedId: PropTypes.any.isRequired,
	isLoading: PropTypes.bool.isRequired,
	items: PropTypes.array.isRequired,
	onRowClick: PropTypes.func
}
