import React, { useContext } from 'react'
import { FirebaseContext } from '../../utils/firebase'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { activityKey } from '../../logic/consts'
import { UserContext } from '../../utils/auth'
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TableContainer,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
})

export default function SelectEvent({ competitionId }) {
	const user = useContext(UserContext)
	const [eventInfo, setEventInfo] = React.useState(null)
	const firebase = React.useContext(FirebaseContext)
	const classes = useStyles()
	const [confirm, setConfirm] = React.useState()
	const [error, setError] = React.useState()
	React.useEffect(() => {
		firebase
			.firestore()
			.collection(`${competitionId}`)
			.doc('events')
			.get()
			.then((resp) => setEventInfo(resp.data().eventInfo))
	}, [competitionId, firebase])
	const handleCheckboxChange = (e, roundId, eventId, event) => {
		setEventInfo([
			...eventInfo.map((event) =>
				event.id !== eventId
					? event
					: {
							...event,
							rounds: event.rounds.map((round) =>
								round.id !== roundId
									? round
									: { ...round, isOpen: !round.isOpen }
							),
					  }
			),
		])
	}
	const handleSubmit = () => {
		firebase
			.firestore()
			.collection(competitionId)
			.doc('events')
			.set({ eventInfo: eventInfo })
			.then(() => setConfirm(true))
			.catch((err) => setError(err))
	}
	return (
		<>
			{!eventInfo || !user ? (
				<LinearProgress />
			) : (
				<Grid
					container
					direction='column'
					justify='center'
					alignItems='center'
					alignContent='center'
					style={{ marginTop: '5vh' }}
					spacing={2}
					xs={12}
				>
					<Grid item>
						<TableContainer component={Paper}>
							<Table className={classes.table} size='small'>
								<TableHead>
									<TableRow>
										<TableCell>Event</TableCell>
										<TableCell>Round</TableCell>
										<TableCell>Open</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{eventInfo.map((event) =>
										event.rounds.map((round, i) => (
											<TableRow key={round.id}>
												<TableCell>
													{activityKey[event.id]}
												</TableCell>
												<TableCell>{i + 1}</TableCell>
												<TableCell>
													<Checkbox
														checked={round.isOpen}
														onChange={(e) =>
															handleCheckboxChange(
																e,
																round.id,
																event.id
															)
														}
													></Checkbox>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>

					{confirm && (
						<Grid item>
							<Typography variant='subtitle1'>
								Updated Successfully
							</Typography>
						</Grid>
					)}
					{error && (
						<Grid item>
							<Typography variant='subtitle1'>{error}</Typography>
						</Grid>
					)}
					<Grid item>
						<Button
							color='primary'
							variant='contained'
							onClick={handleSubmit}
						>
							SAVE
						</Button>
					</Grid>
				</Grid>
			)}
		</>
	)
}
