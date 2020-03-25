import React from 'react'
import { isSignedIn, isAdmin } from '../logic/auth'
import { getMe } from '../logic/wca-api'
import { rounds } from '../logic/consts'
import { FirebaseContext } from '../utils/firebase'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TableContainer
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
})

export default function Admin({ history }) {
	const [user, setUser] = React.useState(null)
	const [forms, setForms] = React.useState(null)
	const firebase = React.useContext(FirebaseContext)
	const classes = useStyles()
	const [confirm, setConfirm] = React.useState()
	const [error, setError] = React.useState()
	React.useEffect(() => {
		if (!isSignedIn()) {
			history.push('/')
		}
		getMe().then(user =>
			isAdmin(user.me) ? setUser(user.me) : history.push('/')
		)
		const forms = []
		for (const round of rounds) {
			forms.push({
				name: round.name,
				id: round.id,
				form: '',
				current: false
			})
		}
		firebase
			.firestore()
			.collection('CubingAtHomeI')
			.doc('Forms')
			.get()
			.then(doc => setForms(doc.data().forms))
	}, [])
	const handleTextChange = (e, form) => {
		setForms([
			...forms.map(f =>
				f.name === form.name ? { ...f, form: e.target.value } : f
			)
		])
	}
	const handleCheckboxChange = (e, form) => {
		setForms([
			...forms.map(f =>
				f.name === form.name
					? { ...f, current: e.target.checked }
					: { ...f, current: false }
			)
		])
	}
	const handleSubmit = () => {
		firebase
			.firestore()
			.collection('CubingAtHomeI')
			.doc('Forms')
			.set({ forms: forms })
			.then(() => setConfirm(true))
			.catch(err => setError(err))
	}
	return (
		<>
			{!forms || !user ? (
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
				>
					<Grid item>
						<TableContainer component={Paper}>
							<Table className={classes.table} size='small'>
								<TableHead>
									<TableRow>
										<TableCell>Event</TableCell>
										<TableCell>Form Link</TableCell>
										<TableCell>Current</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{forms.map(form => (
										<TableRow key={form.name}>
											<TableCell>{form.name}</TableCell>
											<TableCell>
												<TextField
													fullWidth
													value={form.form}
													onChange={e =>
														handleTextChange(
															e,
															form
														)
													}
												/>
											</TableCell>
											<TableCell>
												<Checkbox
													checked={form.current}
													onChange={e =>
														handleCheckboxChange(
															e,
															form
														)
													}
												></Checkbox>
											</TableCell>
										</TableRow>
									))}
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
