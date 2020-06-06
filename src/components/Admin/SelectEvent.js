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
import { parseActivityCode } from '../../logic/attempts'

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
			.collection('competitions')
			.doc(`${competitionId}`)
			.get()
			.then((resp) => setEventInfo(resp.data().rounds || []))
	}, [competitionId, firebase])
	const handleSubmit = () => {
		const storageRef = firebase.storage().ref()
		firebase
			.firestore()
			.collection('competitions')
			.doc(competitionId)
			.update({ rounds: eventInfo })
			.then(() => {
				let promsies = []
				for (const round of eventInfo) {
					const { eventId, roundNumber } = parseActivityCode(round.id)
					const path = `${competitionId}/${activityKey[eventId]} Round ${roundNumber} Scramble Set A.pdf`
					const promise = storageRef.child(path).updateMetadata({
						customMetadata: { isOpen: round.isOpen.toString() },
					})
					promsies.push(promise)
				}
				Promise.all(promsies).then(() => setConfirm(true))
			})
			.catch((err) => setError(err))
	}
	return (
		<>
			{eventInfo === null || !user ? (
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
									{eventInfo.map((round) => {
										const { eventId, roundNumber } = parseActivityCode(round.id)
										return (
											<TableRow key={round.id}>
												<TableCell>{activityKey[eventId]}</TableCell>
												<TableCell>{roundNumber}</TableCell>
												<TableCell>
													<Checkbox
														checked={round.isOpen}
														onChange={(e) => {
															setEventInfo([
																...eventInfo.map((r) =>
																	r.id === round.id
																		? { ...r, isOpen: !r.isOpen }
																		: r
																),
															])
														}}
													></Checkbox>
												</TableCell>
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>

					{confirm && (
						<Grid item>
							<Typography variant='subtitle1'>Updated Successfully</Typography>
						</Grid>
					)}
					{error && (
						<Grid item>
							<Typography variant='subtitle1'>{error}</Typography>
						</Grid>
					)}
					<Grid item>
						<Button color='primary' variant='contained' onClick={handleSubmit}>
							SAVE
						</Button>
					</Grid>
				</Grid>
			)}
		</>
	)
}
