import React, { ReactElement, useState, useContext } from 'react'
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
import ShowScrambles from './ShowScrambles'

interface Props {
	user: User
	competitionId: string
	round: Round & { event: string }
	userAttempt: Result
}

export default function SolveAttempt({
	user,
	competitionId,
	round,
	userAttempt,
}: Props): ReactElement {
	const [attempt, setAttempt] = useState(0)
	const [dialog, setDialog] = useState(false)
	const [flagged, setFlagged] = useState<{
		isFlagged: boolean
		reason?: string
	}>({ isFlagged: false })
	const currentAttempt = userAttempt.attempts.length
	const numAttempts = getNumberAttempts(round.format)
	const firebase = useContext(FirebaseContext)
	if (currentAttempt >= numAttempts)
		return (
			<Typography variant='h2' color='error'>
				Error
			</Typography>
		)
	const scramble = round.scrambleSets[0].scrambles[currentAttempt]
	const handleAttemptSubmit = async () => {
		let newUserAttempt: Result = {
			...userAttempt,
			attempts: [...userAttempt.attempts, attempt],
			flagged,
			isSubmitted: currentAttempt === numAttempts - 1,
			best: best( [...userAttempt.attempts, attempt]),
			average: average( [...userAttempt.attempts, attempt],round.event, numAttempts)
		}
		if (
			currentAttempt === numAttempts - 1 &&
			!flagged.isFlagged &&
			user.wca.personal_records &&
			user.wca.personal_records[round.event] &&
			checkAgainstPersonalBest(
				round.event,
				userAttempt.attempts.length === 5 || userAttempt.attempts.length === 3,
				userAttempt.attempts,
				user.wca.personal_records[round.event]
			)
		) {
			setFlagged({ isFlagged: true, reason: '30% better than personal best' })
			setDialog(true)
		} else {
			await submitTime(firebase, competitionId, round.id, newUserAttempt)
		}
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
				{['333mbf', 'miniguild'].includes(round.event) ? (
					<ShowScrambles round={round} competitionId={competitionId} />
				) : (
					<Grid container direction='row' justify='center'>
						<Grid item style={{ width: '50%' }}>
							<ScrambleView scramble={scramble} />
						</Grid>
						<Grid item style={{ width: '50%' }}>
							<DrawScramble eventId={round.event} scramble={scramble} />
						</Grid>
					</Grid>
				)}
			</Grid>
			<Grid item style={{ width: '100%' }}>
				<Grid container direction='row' justify='center' spacing={4}>
					<Grid item>
						<AttemptField
							helperText={`Please enter you time for Solve ${
								currentAttempt + 1
							} with penalities applied. `}
							eventId={round.event}
							initialValue={attempt}
							onValue={(val: number) => setAttempt(val)}
						/>
					</Grid>
					<Grid item>
						<Button
							disabled={attempt === 0}
							variant='contained'
							onClick={handleAttemptSubmit}
						>
							Submit
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
}
