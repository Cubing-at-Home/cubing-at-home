import React from 'react'
import AttemptField from './AttemptField/AttemptField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import KeyboardIcon from '@material-ui/icons/Keyboard'

export default function ResultSubmission({ event }) {
	const numAttempts = [
		'333bf',
		'333fm',
		'444bf',
		'555bf',
		'666',
		'777',
	].includes(event)
		? 3
		: 5
	const [attempts, setAttempts] = React.useState(Array(numAttempts).fill(0))
	return (
		<>
			<Grid container direction='row' justify='space-around'>
				<Grid item>
					<Grid
						spacing={1}
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
									eventId='333'
									onValue={(newAttempt) => {
										const newAttempts = attempts.slice()
										newAttempts[i] = newAttempt
										setAttempts(newAttempts)
									}}
									style={{ width: '30vw' }}
								/>
								<Typography variant='subtitle2'>{`Solve ${
									i + 1
								}`}</Typography>
							</Grid>
						))}
						<Grid container alignItems='flex-end'>
							<Grid item>
								<Button
									type='submit'
									variant='outlined'
									color='primary'
									disabled={attempts.includes(0)}
									onClick={() => {}}
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
											<div>{`Up, Down, Enter - navigation`}</div>
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
					</Grid>
				</Grid>
				<Grid item>
					<Typography>Result Submission</Typography>
				</Grid>
			</Grid>
		</>
	)
}
