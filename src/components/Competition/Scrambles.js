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
import { parseActivityCode } from '../../logic/attempts'
import { getOpenRounds } from '../../database/reads'
import { submitTime } from '../../database/writes'
export default function Scrambles({ competitionInfo }) {
	const [selectedEvent, setSelectedEvent] = useState(null)
	const [rounds, setRounds] = useState(null)
	const [status, setStatus] = useState('')
	const [auth, setAuth] = useState(true)
	const user = useContext(UserContext)
	const firebase = useContext(FirebaseContext)

	const handleSubmit = async (attempts) => {
		setStatus('submitting')
		const eventAverage = average(
			attempts,
			parseActivityCode(rounds[selectedEvent].id).eventId,
			attempts.length
		)
		const eventBest = best(attempts)
		const result = {
			average: eventAverage,
			best: eventBest,
			attempts: attempts,
			name: user.wca.name,
			personId: user.wca.id.toString(),
			lastUpdated: new Date(),
		}
		console.log(result)
		await submitTime(
			firebase,
			competitionInfo.id,
			rounds[selectedEvent].id,
			result
		).catch((err) => setError(err))
		setStatus('submitted')
	}

	const [error, setError] = useState(null)
	React.useEffect(() => {
		async function fetch() {
			if (user === undefined) {
				signIn()
			}
			if (!user.data.competitions.includes(competitionInfo.id)) {
				setAuth(false)
			} else {
				const rounds = await getOpenRounds(
					firebase,
					competitionInfo.id,
					user.wca.id.toString()
				)
				if (!rounds) setError('Unable to find qualified rounds')
				else {
					setRounds(rounds)
					setSelectedEvent(0)
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
	if (rounds === null || selectedEvent === null) return <LinearProgress />
	if (!auth)
		return <Typography>You aren't registered for this competition.</Typography>
	if (rounds.length === 0)
		return <Typography>No events are currently open for you.</Typography>

	return (
		<Grid container direction='column' justify='center'>
			<Grid item>
				<EventList
					selected={parseActivityCode(rounds[selectedEvent].id).eventId}
					events={rounds.map(
						(round) => parseActivityCode(rounds[selectedEvent].id).eventId
					)}
					onClick={(_, index) => setSelectedEvent(index)}
				/>
			</Grid>
			<Grid item>
				<Typography align='center'>{`${
					activityKey[parseActivityCode(rounds[selectedEvent].id).eventId]
				} Round ${
					parseActivityCode(rounds[selectedEvent].id).roundNumber
				}`}</Typography>
			</Grid>
			<Grid item>
				<ShowScrambles
					competitionId={competitionInfo.id}
					round={rounds[selectedEvent]}
				/>
			</Grid>
			<Grid item>
				<ResultSubmission
					user={user}
					competitionId={competitionInfo.id}
					onSubmit={handleSubmit}
					round={{
						...rounds[selectedEvent],
						event: parseActivityCode(rounds[selectedEvent].id).eventId,
					}} // im doing this because an earlier version of the db had round.event, and im too lazy to change it everywhere
				/>
			</Grid>
			{status === 'submitted' && (
				<Grid item>
					<Typography>{`Successfully updated result.`}</Typography>
				</Grid>
			)}
			{status === 'error' && (
				<Grid item>
					<Typography color='error'>{`Error in submitting result. Please try again.`}</Typography>
				</Grid>
			)}
		</Grid>
	)
}
