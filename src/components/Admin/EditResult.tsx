import React, { ReactElement, useState, useEffect, useContext } from 'react'
import { best as getBest, average as getAverage } from '../../logic/stats'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Grid from '@material-ui/core/Grid'
import AttemptField from '../Competition/AttemptField/AttemptField'
import Button from '@material-ui/core/Button'
import { submitTime, approveFlaggedResult } from '../../database/writes'
import { FirebaseContext } from '../../utils/firebase'

interface Props {
	result: Result & { round: string; reason: string }
	onComplete: () => void
	competitionId: string
}

export default function EditResult({
	result,
	onComplete,
	competitionId,
}: Props): ReactElement {
	const firebase = useContext(FirebaseContext)
	const [best, setBest] = useState(result.best)
	const [average, setAverage] = useState(result.average)
	const [attempts, setAttempts] = useState(result.attempts)
	const saveAndApprove = async () => {
		await approveFlaggedResult(firebase, competitionId, {
			...result,
			average,
			best,
			attempts,
		})
		onComplete()
	}
	const save = async () => {
		await submitTime(firebase, competitionId, result.round, {
			flagged: {
				isFlagged: true,
				reason: result.reason,
			},
			personId: result.personId,
			average,
			best,
			attempts,
		})
		onComplete()
	}
	useEffect(() => {
		setBest(getBest(attempts))
		setAverage(
			getAverage(attempts, result.round.split('-')[0], result.attempts.length)
		)
	}, [attempts])
	return (
		<Dialog open={true} onClose={onComplete} fullWidth>
			<DialogContent>
				<Grid direction='column'>
					{attempts.map((attempt, index) => (
						<Grid item>
							<AttemptField
								helperText={`Solve ${index + 1}`}
								eventId={result.round.split('-')[0]}
								initialValue={attempt}
								onValue={(val: number) =>
									setAttempts([
										...attempts.slice(0, index),
										val,
										...attempts.slice(index + 1),
									])
								}
							/>
						</Grid>
					))}
					<Grid item>
						<AttemptField
							eventId={result.round.split('-')[0]}
							initialValue={best}
							helperText='Best'
							onValue={(val: number) => setBest(val)}
						/>
					</Grid>
					<Grid item>
						<AttemptField
							eventId={result.round.split('-')[0]}
							initialValue={average}
							helperText='Average'
							onValue={(val: number) => setAverage(val)}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={saveAndApprove}> Save and Approve</Button>
				<Button onClick={save}>Save</Button>
				<Button onClick={onComplete}>Cancel</Button>
			</DialogActions>
		</Dialog>
	)
}
