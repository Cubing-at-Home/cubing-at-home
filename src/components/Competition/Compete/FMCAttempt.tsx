import React, { ReactElement, useState, useContext, useEffect } from 'react'
import { getNumberAttempts } from '../../../logic/attempts'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import AttemptField from '../AttemptField/AttemptField'
import Grid from '@material-ui/core/Grid'
import ScrambleView from './ScrambleView'
import DrawScramble from './DrawScramble'
import { FirebaseContext } from '../../../utils/firebase'
import { submitTime } from '../../../database/writes'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import { checkAgainstPersonalBest, best, average } from '../../../logic/stats'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { formatAttemptResult } from '../../../logic/attempts'
import moment from 'moment'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'

interface Props {
	user: User
	competitionId: string
	round: Round & { event: string }
	userAttempt: FMCResult
}

export default function SolveAttempt({
	user,
	competitionId,
	round,
	userAttempt,
}: Props): ReactElement {
	const [attempt, setAttempt] = useState(0)
	const [solutionUrl, setSolutionUrl] = useState('')
	const [dialog, setDialog] = useState(false)
	const [flagged, setFlagged] = useState<{
		isFlagged: boolean
		reason?: string
	}>({ isFlagged: false })
	const [checked, setChecked] = useState(false)
	const currentAttempt = userAttempt?.attempts.length
	const numAttempts = getNumberAttempts(round.format)
	const firebase = useContext(FirebaseContext)
	const [now, setNow] = useState(65)
	useEffect(() => {
		if (userAttempt.attemptInfo?.length === currentAttempt + 1) {
			const prev = moment(userAttempt.attemptInfo[currentAttempt].startedAt)
			const curr = moment()
			const duration = moment.duration(curr.diff(prev))
			const minutes = duration.minutes()
			setNow(65 - minutes)
			if (65 - minutes <= 0) {
				setAttempt(-1)
			} else {
				const interval = setInterval(() => {
					const prev = moment(userAttempt.attemptInfo[currentAttempt].startedAt)
					const curr = moment()
					const duration = moment.duration(curr.diff(prev))
					const minutes = duration.minutes()
					setNow(65 - minutes)
					if (65 - minutes <= 0) {
						setAttempt(-1)
					}
				}, 30000)
				return () => {
					clearInterval(interval)
					setNow(65)
				}
			}
		}
		return
	}, [userAttempt, currentAttempt])
	if (currentAttempt >= numAttempts)
		return (
			<Typography variant='h2' color='error'>
				Error
			</Typography>
		)
	const scramble = round.scrambleSets[0].scrambles[currentAttempt]
	const handleAttemptSubmit = async () => {
		const recordedAttempt = attempt
		const solution = solutionUrl
		setAttempt(0)
		setSolutionUrl('')
		setChecked(false)
		let newUserAttempt: FMCResult = {
			...userAttempt,
			attempts: [...userAttempt.attempts, recordedAttempt],
			flagged,
			isSubmitted: currentAttempt === numAttempts - 1,
			best: best([...userAttempt.attempts, recordedAttempt]),
			average: average(
				[...userAttempt.attempts, recordedAttempt],
				round.event,
				numAttempts
			),
			attemptInfo: [...(userAttempt.attemptInfo || [])],
			solutionUrl: [...(userAttempt.solutionUrl || []), solution],
		}
		if (
			currentAttempt === numAttempts - 1 &&
			!flagged.isFlagged &&
			user.wca.personal_records &&
			user.wca.personal_records[round.event] &&
			checkAgainstPersonalBest(
				round.event,
				newUserAttempt.attempts.length === 5 ||
					newUserAttempt.attempts.length === 3,
				newUserAttempt.attempts,
				user.wca.personal_records[round.event]
			)
		) {
			setFlagged({ isFlagged: true, reason: '30% better than personal best' })
			setDialog(true)
		} else {
			await submitTime(firebase, competitionId, round.id, newUserAttempt)
		}
	}

	const handleBeginFMC = async () => {
		await submitTime(firebase, competitionId, round.id, {
			personId: user.wca.id.toString(),
			flagged: {
				isFlagged: false,
				reason: '',
			},
			attemptInfo: [
				...(userAttempt.attemptInfo || []),
				{
					started: true,
					startedAt: Date.now(),
				},
			],
		})
	}

	return (
		<Grid
			container
			direction='column'
			justify='center'
			alignItems='center'
			style={{ marginTop: '10px' }}
			spacing={3}
		>
			<Dialog open={dialog}>
				<DialogTitle>Confirm Submission</DialogTitle>
				<DialogContent>
					<DialogContentText variant='body1'>
						{`Your results have been flagged due to the following reason: ${flagged.reason}`}
					</DialogContentText>
					<DialogContentText variant='body1'>
						{`Are you sure that your times are correct?`}
					</DialogContentText>
					<DialogContentText variant='body1'>
						{`If these times are correct, your result will be sent to the results team for approval. We may reach out to you (${user.wca.email}) for verification if necessary`}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setDialog(false)
							handleAttemptSubmit()
						}}
					>
						Yes, my results are valid
					</Button>
					<Button
						onClick={() => {
							setDialog(false)
							setFlagged({ isFlagged: false })
						}}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
			<Grid item>
				<Typography variant='h4' align='center'>{`Solve ${
					currentAttempt + 1
				}`}</Typography>
			</Grid>
			<Grid item>
				{userAttempt.attemptInfo?.length === currentAttempt + 1 && (
					<Grid container direction='row' justify='center'>
						<Grid item style={{ width: '50%' }}>
							<ScrambleView scramble={scramble} />
						</Grid>
						<Grid item style={{ width: '50%' }}>
							<DrawScramble eventId={round.event} scramble={scramble} />
						</Grid>
						<Grid item>
							<Typography color={now < 10 ? 'error' : 'inherit'} variant='h6'>
								{now >= 0
									? `${now} minutes left`
									: 'Time is up. Your solve will be DNF'}
							</Typography>
						</Grid>
					</Grid>
				)}
			</Grid>
			<Grid item style={{ width: '100%' }}>
				{userAttempt.attemptInfo?.length === currentAttempt + 1 ? (
					<Grid container direction='row' justify='center' spacing={4}>
						<Grid item>
							<AttemptField
								helperText={`Please enter your ${
									round.event === '333fm' ? 'move count' : 'time'
								} for Solve ${currentAttempt + 1} with penalities applied. `}
								eventId={round.event}
								initialValue={attempt}
								onValue={(val: number) => setAttempt(val)}
								disabled={now <= 0}
							/>
						</Grid>
						<Grid item>
							<TextField
								value={solutionUrl}
								label='https://alg.cubing.net/syz'
								onChange={({ target: { value } }) => setSolutionUrl(value)}
								helperText={
									<Link
										rel='noopener'
										target='_blank'
										href='https://alg.cubing.net'
									>
										Please submit a alg.cubing.net link to your solution
									</Link>
								}
							/>
						</Grid>
						<Grid item>
							<FormControlLabel
								label={
									attempt !== 0
										? `${formatAttemptResult(
												attempt,
												round.event
										  )} is the correct time for Solve ${currentAttempt + 1}`
										: ''
								}
								control={
									<Checkbox
										disabled={attempt === 0}
										checked={checked}
										color='primary'
										onChange={({ target: { checked } }) => setChecked(checked)}
									/>
								}
							/>
							<Button
								disabled={
									attempt === 0 || !checked || (solutionUrl === '' && now > 0)
								}
								variant='contained'
								onClick={handleAttemptSubmit}
							>
								Submit
							</Button>
						</Grid>
					</Grid>
				) : (
					<>
						<Grid item>
							<Button
								onClick={handleBeginFMC}
								variant='contained'
								color='primary'
							>
								{' '}
								{`Begin Solve ${currentAttempt + 1}`}
							</Button>
						</Grid>
						<Grid item>
							<p>
								Once you begin, you will have 1 hour and 5 minutes to submit
								your attempt and Alg DB link
							</p>
						</Grid>
					</>
				)}
			</Grid>
		</Grid>
	)
}
