import React, { useState, useContext } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { defaultCompetition } from '../../database/builder'
import { Typography, InputLabel, Button } from '@material-ui/core'
import EventList from '../EventList'
import { createNewCompetition } from '../../database/writes'
import { FirebaseContext } from '../../utils/firebase'

const allEvents = [
	'222',
	'333',
	'444',
	'555',
	'666',
	'777',
	'333bf',
	'333mbf',
	'333oh',
	'333fm',
	'minx',
	'pyram',
	'sq1',
	'skewb',
	'clock',
	'444bf',
	'555bf'
]

export default function NewCompetition({ history }) {
	const firebase = useContext(FirebaseContext)
	const [competition, setCompetition] = useState(defaultCompetition)
	const [error, setError] = useState(null)
	const truncateSpaces = word => {
		let newWord = ''
		for (const letter of word) {
			if (letter !== ' ') {
				newWord += letter
			}
		}
		return newWord
	}
	const handleChange = e => {
		let value = e.target.value
		if (e.target.name === 'id') {
			value = truncateSpaces(value)
		}
		if (['date', 'datetime-local'].includes(e.target.type)) {
			value = new Date(value)
		}
		setCompetition({ ...competition, [e.target.name]: value })
	}
	const handleEventChange = event => {
		if (competition.events.includes(event)) {
			setCompetition({
				...competition,
				events: competition.events.filter(e => e !== event)
			})
		} else {
			setCompetition({
				...competition,
				events: [...competition.events, event]
			})
		}
	}
	const checkForErrors = () => {
		return false
	}
	const handleConfirm = event => {
		const error = checkForErrors()
		error !== false
			? setError(error)
			: createNewCompetition(firebase, competition).then(() =>
					history.push(`/${competition.id}`)
			  )
	}
	return (
		<Grid
			container
			direction='column'
			alignContent='center'
			justify='center'
			spacing={3}
			xs={12}
			style={{ padding: '5vw' }}
		>
			<Grid item>
				<Typography variant='h3'>New Competition</Typography>
			</Grid>
			<Grid item>
				<TextField
					fullWidth
					name={'name'}
					value={competition.name}
					label='Competition Name'
					onChange={handleChange}
					helperText='This will be what the competition is advertised as'
				/>
			</Grid>
			<Grid item>
				<TextField
					fullWidth
					name={'id'}
					value={competition.id}
					label='Competition ID'
					onChange={handleChange}
					helperText='This is used for database as well as routing. No spaces.'
				/>
			</Grid>
			<Grid item>
				<Typography variant='h6'>Events</Typography>
				<EventList
					name={'events'}
					showName='true'
					selected={competition.events}
					events={allEvents}
					onClick={handleEventChange}
				/>
			</Grid>
			<Grid item>
				<InputLabel>Competition Start</InputLabel>
			</Grid>
			<Grid item>
				<input
					name={'start'}
					value={competition.start.toISOString().split('T')[0]}
					type='date'
					onChange={handleChange}
				/>
			</Grid>
			<Grid item>
				<InputLabel>Competition End</InputLabel>
			</Grid>
			<Grid item>
				<input
					name={'end'}
					value={competition.end.toISOString().split('T')[0]}
					type='date'
					onChange={handleChange}
				/>
			</Grid>
			<Grid item>
				<InputLabel>Registration Start</InputLabel>
			</Grid>
			<Grid item>
				<input
					name={'registrationStart'}
					value={competition.registrationStart
						.toISOString()
						.slice(0, -1)}
					type='datetime-local'
					onChange={handleChange}
				/>
			</Grid>
			<Grid item>
				<InputLabel>Registration End</InputLabel>
			</Grid>
			<Grid item>
				<input
					name={'registrationEnd'}
					value={competition.registrationEnd
						.toISOString()
						.slice(0, -1)}
					type='datetime-local'
					onChange={handleChange}
				/>
			</Grid>
			<Grid item>
				<TextField
					name='admins'
					value={competition.admins.join(',')}
					onChange={e =>
						setCompetition({
							...competition,
							admins: e.target.value.split(',')
						})
					}
					label='Admins'
					helperText='WCA IDs of admins seperated by commas'
				/>
			</Grid>
			<Grid item>
				<Button varaint='contained' onClick={handleConfirm}>
					Confirm Competition
				</Button>
				{error && (
					<Typography color='error' variant='subtitle1'>
						{error}
					</Typography>
				)}
			</Grid>
		</Grid>
	)
}
