import React from 'react'
import AttemptField from '../AttemptField/AttemptField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { average, best } from '../../../logic/stats'
import { decodeMbldAttempt } from '../AttemptField/MbldField/MbldField'
import { getNumberAttempts } from '../../../logic/attempts'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import EventStart from './EventStart'
import EventSubmitted from './EventSubmitted'
import SolveAttempt from './SolveAttempt'
import DoneAllIcon from '@material-ui/icons/DoneAll'

export default function ResultSubmission({
	user,
	competitionId,
	round,
	userAttempt,
	loading,
	showAdmin,
}) {
	const centisecondsToInput = (centiseconds) => {
		if (round.event === '333mbf') {
			const { solved, attempted } = decodeMbldAttempt(centiseconds)
			return `${solved}/${attempted}`
		}
		if (centiseconds === 0) return ''
		if (centiseconds === -1) return 'DNF'
		if (centiseconds === -2) return 'DNS'
		return new Date(centiseconds * 10)
			.toISOString()
			.substr(11, 11)
			.replace(/^[0:]*(?!\.)/g, '')
	}
	const numAttempts = round.format
		? getNumberAttempts(round.format)
		: userAttempt?.attempts?.length || 0
	if (userAttempt === null) return <></>
	if (loading) return <CircularProgress />
	return (
		<Grid
			container
			direction='row'
			justify='flex-start'
			style={{ width: '100%', height: '100%' }}
		>
			<Grid item xs={4} style={{ maxWidth: '20%' }}>
				{numAttempts > 0 && (
					<Grid
						spacing={3}
						xs={12}
						container
						direction='column'
						justify='flex-start'
						alignItems='center'
					>
						{Array(numAttempts)
							.fill(0)
							.map((v, i) => (
								<Grid item container alignItems='center'>
									<Grid item key={i}>
										<AttemptField
											variant='filled'
											disabled={true}
											initialValue={
												userAttempt?.attempts?.length > i
													? userAttempt.attempts[i]
													: 0
											}
											eventId={round.event}
											style={{ width: '100%' }}
										/>
										<Typography variant='subtitle2'>{`Solve ${
											i + 1
										}`}</Typography>
									</Grid>
									{userAttempt?.attempts?.length > i && (
										<Grid item>
											<DoneAllIcon style={{ color: 'green' }} />
										</Grid>
									)}
								</Grid>
							))}
						<Grid container justify='space-between'>
							<Grid item>
								<Typography align='left'>
									Average:{' '}
									{centisecondsToInput(
										average(
											userAttempt?.attempts || [],
											round.event,
											numAttempts
										)
									)}
								</Typography>
							</Grid>
							<Grid item>
								<Typography align='right'>
									Best: {centisecondsToInput(best(userAttempt?.attempts || []))}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				)}
			</Grid>
			<Grid item style={{ marginRight: '3%' }}>
				<Divider orientation='vertical' />
			</Grid>
			<Grid item style={{ width: '70%' }}>
				{!round.isOpen && userAttempt?.isSubmitted ? (
					<EventSubmitted
						user={user}
						userAttempt={userAttempt}
						competitionId={competitionId}
						round={round}
					/>
				) : !round.isOpen && !showAdmin && !userAttempt?.isSubmitted ? (
					<Typography variant='h5'>
						Sorry, this round is not currently open.
					</Typography>
				) : !userAttempt ? (
					<EventStart round={round} user={user} competitionId={competitionId} />
				) : userAttempt.submitted ||
				  userAttempt?.attempts?.length >= numAttempts ? (
					<EventSubmitted
						userAttempt={userAttempt}
						competitionId={competitionId}
						round={round}
					/>
				) : (
					<SolveAttempt
						user={user}
						round={round}
						competitionId={competitionId}
						userAttempt={userAttempt}
					/>
				)}
			</Grid>
		</Grid>
	)
}
