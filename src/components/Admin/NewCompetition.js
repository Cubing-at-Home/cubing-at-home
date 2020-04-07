import React, { useState, useContext } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { defaultCompetition } from '../../database/builder'
import { Typography, InputLabel, Button } from '@material-ui/core'
import { createNewCompetition } from '../../database/writes'
import { FirebaseContext } from '../../utils/firebase'
import moment from 'moment-timezone'

export default function NewCompetition({ history }) {
	let fileReader
	const firebase = useContext(FirebaseContext)
	const [competition, setCompetition] = useState(defaultCompetition)
	const [eventInfo, setEventInfo] = useState(null)
	const [error, setError] = useState(null)
	const truncateSpaces = (word) => {
		let newWord = ''
		for (const letter of word) {
			if (letter !== ' ') {
				newWord += letter
			}
		}
		return newWord
	}
	const handleChange = (e) => {
		let value = e.target.value
		if (e.target.name === 'id') {
			value = truncateSpaces(value)
		}
		if ('datetime-local' === e.target.type) {
			value = new Date(value)
		} else if ('date' === e.target.type) {
			value = new Date(`${value}T11:00Z`)
		}
		setCompetition({ ...competition, [e.target.name]: value })
	}
	const checkForErrors = () => {
		return false
	}
	const handleConfirm = (event) => {
		const error = checkForErrors()
		error !== false
			? setError(error)
			: createNewCompetition(firebase, competition, eventInfo).then(() =>
					history.push(`/${competition.id}`)
			  )
	}
	const handleFileRead = (e) => {
		const content = fileReader.result
		const eventInfo = JSON.parse(content).wcif.events
		const events = eventInfo.map((event) => event.id)
		setEventInfo(eventInfo)
		setCompetition({ ...competition, events: events })
	}
	const handleFileChosen = (file) => {
		fileReader = new FileReader()
		fileReader.onloadend = handleFileRead
		fileReader.readAsText(file)
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
				<InputLabel>Competition Start</InputLabel>
			</Grid>
			<Grid item>
				<input
					name={'start'}
					value={moment(competition.start).format('YYYY-MM-DD')}
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
					value={moment(competition.end).format('YYYY-MM-DD')}
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
					value={moment(competition.registrationStart).format(
						'YYYY-MM-DDThh:mm'
					)}
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
					value={moment(competition.registrationEnd).format(
						'YYYY-MM-DDThh:mm'
					)}
					type='datetime-local'
					onChange={handleChange}
				/>
			</Grid>
			<Grid item>
				<TextField
					name='admins'
					value={competition.admins.join(',')}
					onChange={(e) =>
						setCompetition({
							...competition,
							admins: e.target.value.split(','),
						})
					}
					label='Admins'
					helperText='WCA IDs of admins seperated by commas'
				/>
			</Grid>
			<Grid item>
				<InputLabel>Upload JSON Scrambles file from Tnoodle</InputLabel>
			</Grid>
			<Grid item>
				<input
					type='file'
					id='file'
					accept='.json'
					onChange={(e) => handleFileChosen(e.target.files[0])}
				/>
			</Grid>
			<Grid item>
				<Button
					disabled={!eventInfo || competition.id === ''}
					varaint='contained'
					onClick={handleConfirm}
				>
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
