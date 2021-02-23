import { Button, InputLabel, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import moment from 'moment-timezone';
import React, { useContext, useState } from 'react';
import { buildCompetition, defaultCompetition } from '../../database/builder';
import { FirebaseContext } from '../../utils/firebase';
export default function NewCompetition({ history }) {
	let fileReader
	const firebase = useContext(FirebaseContext)
	const [competition, setCompetition] = useState(defaultCompetition)
	const [eventInfo, setEventInfo] = useState(null)
	const [error, setError] = useState(null)
	const [newSchedule, setNewSchedule] = useState({});
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
	const handleConfirm = async (event) => {
		const error = checkForErrors()
		if (error) setError(error)
		else {
			await buildCompetition(firebase, { ...competition, start: moment(competition.start).format('YYYY-MM-DD'), end: moment(competition.end).format('YYYY-MM-DD'), registrationStart: competition.registrationStart.toISOString(), registrationEnd: competition.registrationEnd.toISOString() })
			history.push(`/competitions/${competition.id}`)
		}
	}
	const handleFileRead = (e) => {
		const content = fileReader.result
		const events = JSON.parse(content).wcif.events
		const eventList = events.map((event) => event.id)
		setCompetition({ ...competition, eventList, events })
	}
	const handleFileChosen = (file) => {
		fileReader = new FileReader()
		fileReader.onloadend = handleFileRead
		fileReader.readAsText(file)
	}
	const handleEventChange = (e) => {
		setNewSchedule({ ...newSchedule, [e.target.name]: e.target.value });
	}
	const addEvent = (e) => {
		setCompetition({ ...competition, schedule: [...competition.schedule, newSchedule] });
	}
	const removeEvent = (index) => {
		console.log(competition);
		const updated = competition.schedule.filter((_, i) => i !== index);
		setCompetition({ ...competition, schedule: updated });
		console.log(competition);
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
					helperText='WCA IDs of admins separated by commas'
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
				<InputLabel>Add Events to Schedule</InputLabel>
			</Grid>
			<Grid item container direction='column' style={{width: '25%'}}>
				<TextField name="name" label="Event Name" onChange={handleEventChange} required></TextField>
				<TextField name="id" label="Event ID" onChange={handleEventChange} required></TextField>
				<TextField
					name="start"
					label="Start Time"
					type="time"
					onChange={handleEventChange}
					required
				></TextField>
				<TextField
					name="end"
					label="End Time"
					type="time"
					onChange={handleEventChange}
					required
				></TextField>
				<TextField
					defaultValue=""
					name="qualification"
					label="Qualification (optional)"
					type="text"
					onChange={handleEventChange}
				></TextField>
        <br/>
				<Button
					disabled={Object.keys(newSchedule).length < 4}
					onClick={addEvent}>Add Event
					</Button>
			</Grid>
			<Grid item></Grid>
			<Grid item>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>ID</TableCell>
							<TableCell>Start</TableCell>
							<TableCell>End</TableCell>
							<TableCell>Qualification (optional)</TableCell>
							<TableCell>Remove</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{competition.schedule.map((event, index) => {
							return <TableRow key={index}>
								<TableCell>{event?.name}</TableCell>
								<TableCell>{event?.id}</TableCell>
								<TableCell>{event?.start}</TableCell>
								<TableCell>{event?.end}</TableCell>
								<TableCell>{event?.qualification}</TableCell>
								<TableCell><Button onClick={() => removeEvent(index)}>❌</Button></TableCell>
							</TableRow>
						}
						)}
					</TableBody>
				</Table>
			</Grid>
			<Grid item>
				<Button
					disabled={!competition.events || competition.id === ''}
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
