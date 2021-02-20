import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import React, { useState } from 'react'
import TabPanel from '../TabPanel'
import AdminResults from './AdminResults'
import AdminStream from './AdminStream'
import NewBracket from './NewBracket'
import SelectEvent from './SelectEvent'
import SetupBracket from './SetupBracket'

export default function CompetitionAdmin({ match }) {
	const [value, setValue] = useState('events')
	const onChange = (_, newVal) => {
		setValue(newVal)
	}
	return (
		<>
			<AppBar position='static' color='primary'>
				<Tabs value={value} onChange={onChange} aria-label=''>
					<Tab label='Events' value={'events'} />
					<Tab label='Results' value={'results'} />
					<Tab label='Stream' value={'stream'} />
					<Tab label='Manage Bracket' value={'bracket'} />
					<Tab label='New Bracket' value={'newBracket'} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={'events'}>
				<SelectEvent competitionId={match.params.competitionId} />
			</TabPanel>
			<TabPanel value={value} index={'results'}>
				<AdminResults competitionId={match.params.competitionId} />
			</TabPanel>
			<TabPanel value={value} index='stream'>
				<AdminStream competitionId={match.params.competitionId} />
			</TabPanel>
			<TabPanel value={value} index='bracket'>
				<SetupBracket competitionId={match.params.competitionId} />
			</TabPanel>
			<TabPanel value={value} index='newBracket'>
				<NewBracket competitionId={match.params.competitionId}/>
			</TabPanel>
		</>
	)
}
