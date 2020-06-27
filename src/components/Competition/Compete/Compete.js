import React, { useContext, useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import EventList from '../../EventList'
import ResultSubmission from './ResultSubmission'
import { UserContext } from '../../../utils/auth'
import { FirebaseContext } from '../../../utils/firebase'
import { signIn } from '../../../logic/auth'
import { LinearProgress, Typography } from '@material-ui/core'
import { activityKey } from '../../../logic/consts'
import { parseActivityCode } from '../../../logic/attempts'
import { getOpenRounds } from '../../../database/reads'
import moment from 'moment'

export default function Compete({ competitionInfo }) {
	const [rounds, setRounds] = useState(null)
	const [loading, setLoading] = useState(true)
	const [userAttempt, setUserAttempt] = useState(null)
	const [allRounds, setAllRounds] = useState(null)
	const [auth, setAuth] = useState(true)
	const user = useContext(UserContext)
	const firebase = useContext(FirebaseContext)
	const showAdmin =
		['organizer', 'staff'].includes(user.data.role) &&
		moment(competitionInfo.start).diff(moment(), 'days') <= 1

	const [selectedEvent, setSelectedEvent] = useState(null)
	useEffect(
		() => {
			let newUnsub = undefined
			if (allRounds && selectedEvent !== null) {
				const round = allRounds.find((round) => round.id === selectedEvent)
				const eventId = parseActivityCode(round.id).eventId
				const roundId = round.id
				newUnsub = firebase
					.firestore()
					.collection('competitions')
					.doc(competitionInfo.id)
					.collection('Events')
					.doc(eventId)
					.collection('Rounds')
					.doc(roundId)
					.collection('Results')
					.doc(user.wca.id.toString())
					.onSnapshot((doc) => {
						setUserAttempt(doc.data())
						setLoading(false)
					})
			} else {
				setLoading(false)
			}
			return () => newUnsub && newUnsub()
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[selectedEvent]
	)

	const [error, setError] = useState(null)
	React.useEffect(() => {
		async function fetch() {
			if (user === undefined) {
				signIn()
			}
			if (!user.data.competitions.includes(competitionInfo.id)) {
				setAuth(false)
			} else {
				try {
					const { roundsInformation, allRounds } = await getOpenRounds(
						firebase,
						competitionInfo.id,
						user.wca.id.toString(),
						showAdmin
					)
					if (!roundsInformation) setError('Unable to find qualified rounds')
					else {
						setRounds(roundsInformation)
						setAllRounds(allRounds)
						setSelectedEvent(allRounds[0]?.id)
					}
				} catch (err) {
					setError(err.message)
				}
			}
		}
		fetch()
	}, [user, competitionInfo, firebase])
	if (error !== null)
		return (
			<Typography variant='h2' color='error'>
				{error}
			</Typography>
		)
	if (!auth)
		return <Typography>You aren't registered for this competition.</Typography>
	if (rounds === null || selectedEvent === null || allRounds === null)
		return <LinearProgress />
	if (allRounds.length === 0)
		return <Typography>No events are currently available</Typography>
	return (
		<Grid container direction='column' justify='center'>
			<Grid item>
				<EventList
					selected={[selectedEvent]}
					events={allRounds.map((round) => round.id)}
					onClick={(_, index) => {
						if (allRounds[index].id !== selectedEvent) {
							setLoading(true)
							setSelectedEvent(allRounds[index].id)
						}
					}}
				/>
			</Grid>
			<Grid item>
				<Typography align='center'>{`${
					activityKey[parseActivityCode(selectedEvent).eventId]
				} Round ${parseActivityCode(selectedEvent).roundNumber}`}</Typography>
			</Grid>
			<Grid item style={{ height: '100%' }}>
				<ResultSubmission
					loading={loading}
					user={user}
					competitionId={competitionInfo.id}
					round={{
						...rounds.find((round) => round.id === selectedEvent),
						event: parseActivityCode(selectedEvent).eventId,
						...allRounds.find((round) => round.id === selectedEvent),
					}} // im doing this because an earlier version of the db had round.event, and im too lazy to change it everywhere
					userAttempt={userAttempt}
					showAdmin={showAdmin}
				/>
			</Grid>
		</Grid>
	)
}
