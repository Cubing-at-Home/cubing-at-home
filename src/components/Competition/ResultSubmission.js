import React, { useContext, useState } from 'react'
import AttemptField from './AttemptField/AttemptField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import KeyboardIcon from '@material-ui/icons/Keyboard'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import { FirebaseContext } from '../../utils/firebase'
import { average, best, checkAgainstPersonalBest } from '../../logic/stats'
import {
	DialogTitle,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogActions,
} from '@material-ui/core'
import { decodeMbldAttempt } from './AttemptField/MbldField/MbldField'

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		margin: 'auto',
		maxWidth: 500,
	},
	image: {
		width: 128,
		height: 128,
	},
	img: {
		margin: 'auto',
		display: 'block',
		maxWidth: '100%',
		maxHeight: '100%',
	},
}))

export default function ResultSubmission({
	user,
	competitionId,
	onSubmit,
	round,
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
	const classes = useStyles()
	const firebase = useContext(FirebaseContext)
	const [dialog, setDialog] = useState(false)
	const handleSubmit = () => {
		if (
			user.wca.personal_records &&
			user.wca.personal_records[round.event] &&
			checkAgainstPersonalBest(
				round.event,
				attempts.length === 5 || attempts.length === 3,
				attempts,
				user.wca.personal_records[round.event]
			)
		) {
			setDialog(true)
		} else {
			onSubmit(attempts)
		}
	}
	const numAttempts = [
		'333bf',
		'333fm',
		'444bf',
		'555bf',
		'666',
		'777',
	].includes(round.event)
		? 3
		: ['333mbf', '2345relay'].includes(round.event)
		? 1
		: 5
	const [attempts, setAttempts] = React.useState(Array(numAttempts).fill(0))
	React.useEffect(() => {
		firebase
			.firestore()
			.collection(competitionId)
			.doc(user.wca.id.toString())
			.get()
			.then((resp) => {
				const data = resp.data()
				if (data[round.id] !== undefined) {
					setAttempts(data[round.id].attempts)
				} else {
					setAttempts(Array(numAttempts).fill(0))
				}
			})
	}, [numAttempts, competitionId, firebase, round, user])
	return (
		<div className={classes.root}>
			<Dialog open={dialog}>
				<DialogTitle>Confirm Submission</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Your results are over 30% better than your WCA Personal best.
					</DialogContentText>
					<DialogContentText>
						Are you sure that your times are correct?
					</DialogContentText>
					<DialogContentText>
						Please note that any form of cheating is unacceptable.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setDialog(false)
							onSubmit(attempts)
						}}
					>
						Yes, my results are valid
					</Button>
					<Button onClick={() => setDialog(false)}>Cancel</Button>
				</DialogActions>
			</Dialog>
			<Grid
				style={{ display: 'flex' }}
				container
				direction='row'
				justify='space-between'
			>
				<Grid item xs={4} style={{ display: 'flex' }}>
					<Grid
						spacing={3}
						xs={12}
						container
						direction='column'
						justify='flex-start'
						alignItems='center'
					>
						{attempts.map((v, i) => (
							<Grid item key={i}>
								<AttemptField
									initialValue={attempts[i]}
									eventId={round.event}
									onValue={(newAttempt) => {
										const newAttempts = attempts.slice()
										newAttempts[i] = newAttempt
										setAttempts(newAttempts)
									}}
									style={{ width: '30vw' }}
								/>
								<Typography variant='subtitle2'>{`Solve ${i + 1}`}</Typography>
							</Grid>
						))}
						<Grid container justify='space-between' alignItems='space-around'>
							<Grid item>
								<Button
									type='submit'
									variant='outlined'
									color='primary'
									disabled={attempts.includes(0)}
									onClick={handleSubmit}
								>
									Submit
								</Button>
							</Grid>
							<Grid item style={{ flexGrow: 1 }} />
							<Grid item>
								<Tooltip
									title={
										<div>
											Key bindings:
											<div>{`/ or d - DNF`}</div>
											<div>{`* or s - DNS`}</div>
										</div>
									}
								>
									<KeyboardIcon
										style={{ verticalAlign: 'middle' }}
										color='action'
									/>
								</Tooltip>
							</Grid>
						</Grid>
						<Grid container justify='space-around'>
							<Grid item>
								<Typography align='left'>
									Average:{' '}
									{centisecondsToInput(
										average(attempts, round.event, numAttempts)
									)}
								</Typography>
							</Grid>
							<Grid item>
								<Typography align='right'>
									Best: {centisecondsToInput(best(attempts))}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={6} container style={{ display: 'flex' }}>
					<Typography>
						Result Submission Process
						<ul>
							<li>
								{`A PDF of the Scrambles is available to download by clicking the button above. Make sure to verify each scramble with the image.`}
							</li>
							<li>
								After you complete each solve, enter in the exact time in the
								corresponding fields. If you have a penalty, add the penalty and
								enter the final time. If you got a DNF, type D. If you would
								like to enter a DNS, type S. For Multiple Blindfolded, the
								format is: Completed, Attempted, Time.
							</li>
							<li>
								Once you finish all of your solves, make sure to double check
								that all the times are correct. Then, you may submit your times.
								You can submit your times as many times as you want as long as
								the round remains open. Once the round is closed, your last
								submission will be used.
							</li>
							<li>
								<Typography color='error'>
									Please note: If we detect any form of cheating, it will result
									in disqualification from all future Cubing at Home
									competitions.{' '}
								</Typography>
							</li>
							<li>
								If you have any issues/questions, check the{' '}
								<Link href={`/${competitionId}/faq`}>faq</Link>,{' or '}
								<Link
									target='_blank'
									rel='noreferrer'
									href='mailto:sgrover@worldcubeassociation.org,cnielson@worldcubeassociation.org,bsampson@worldcubeassociation.org,sbaird@worldcubeassociation.org'
								>
									{' '}
									contact us
								</Link>
							</li>
						</ul>
					</Typography>
				</Grid>
			</Grid>
		</div>
	)
}
