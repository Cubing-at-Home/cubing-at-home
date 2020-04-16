import React, { useContext, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import EventList from '../EventList'
import ResultSubmission from './ResultSubmission'
import ShowScrambles from './ShowScrambles'
import { UserContext } from '../../utils/auth'
import { FirebaseContext } from '../../utils/firebase'
import { signIn } from '../../logic/auth'
import { LinearProgress, Typography } from '@material-ui/core'
import { activityKey } from '../../logic/consts'
import { average, best } from '../../logic/stats'

export default function Scrambles({ competitionInfo }) {
	const [selectedEvent, setSelectedEvent] = useState()
	const [eventInfo, setEventInfo] = useState(null)
	const [status, setStatus] = useState('')
	const [auth, setAuth] = useState(true)
	const user = useContext(UserContext)
	const firebase = useContext(FirebaseContext)

	const handleSubmit = (attempts) => {
		setStatus('submitting')
		const eventAverage = average(
			attempts,
			selectedEvent.event,
			attempts.length
		)
		const eventBest = best(attempts)
		firebase
			.firestore()
			.collection(competitionInfo.id)
			.doc(user.wca.id.toString())
			.get()
			.then((resp) => {
				const data = resp.data()
				firebase
					.firestore()
					.collection(competitionInfo.id)
					.doc(user.wca.id.toString())
					.set({
						...data,
						[selectedEvent.id]: {
							average: eventAverage,
							best: eventBest,
							attempts: attempts,
						},
					})
					.then(setStatus('submitted'))
					.catch((err) => setStatus('error'))
			})
	}

	React.useEffect(() => {
		if (user === undefined) {
			signIn()
		}
		if (!user.data.competitions.includes(competitionInfo.id)) {
			setAuth(false)
		} else {
			firebase
				.firestore()
				.collection(competitionInfo.id)
				.doc('events')
				.get()
				.then((resp) => {
					const eventInfo = resp.data().eventInfo
					const openRounds = []
					// eslint-disable-next-line array-callback-return
					eventInfo.map((event) => {
						const round = event.rounds.filter(
							(round) => round.isOpen === true
						)
						round.length > 0 &&
							openRounds.push({ ...round[0], event: event.id })
					})
					setEventInfo(openRounds)
					setSelectedEvent(openRounds[0])
				})
		}
	}, [user, competitionInfo, firebase])
	return (
		<Grid container direction='column' justify='center'>
			{!eventInfo && auth ? (
				<LinearProgress />
			) : auth && eventInfo.length > 0 && selectedEvent ? (
				<>
					<Grid item>
						<EventList
							selected={[selectedEvent.event]}
							events={eventInfo.map((round) => round.event)}
							onClick={(e) =>
								setSelectedEvent(
									eventInfo.find((round) => round.event === e)
								)
							}
						/>
					</Grid>
					<Grid item>
						<Typography align='center'>{`${
							activityKey[selectedEvent.event]
						} Round ${selectedEvent.id.slice(-1)}`}</Typography>
					</Grid>
					<Grid item>
						<ShowScrambles
							competitionId={competitionInfo.id}
							round={selectedEvent}
						/>
					</Grid>
					<Grid item>
						<ResultSubmission
							user={user}
							competitionId={competitionInfo.id}
							onSubmit={handleSubmit}
							round={selectedEvent}
						/>
					</Grid>
					{status === 'submitted' && (
						<Grid item>
							<Typography>{`Successfully updated result.`}</Typography>
						</Grid>
					)}
					{status === 'error' && (
						<Grid item>
							<Typography color='error'>{`Error in submitting result`}</Typography>
						</Grid>
					)}
				</>
			) : (
				<Typography>No events are currently open for you.</Typography>
			)}
		</Grid>
	)
}
