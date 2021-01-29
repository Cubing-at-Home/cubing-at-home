import { TextField } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import moment from 'moment'
import React, { useContext, useState } from 'react'
import { cancelCompetitor, registerCompetitor } from '../../database/writes'
import { signIn } from '../../logic/auth'
import { WCA_ORIGIN } from '../../logic/wca-env'
import { UserContext } from '../../utils/auth'
import { FirebaseContext } from '../../utils/firebase'

const useStyles = makeStyles((theme) => ({
	grid: {
		marginTop: theme.spacing(2),
	},
	avatar: {
		width: theme.spacing(10),
		height: theme.spacing(10),
	},
}))

export default function Register({ history, match }) {
	const user = useContext(UserContext)
	const [checked, setChecked] = useState(false)
	const [error, setError] = useState(false)
	const competitionId = match.params.id
	const registered = user
		? user.data.competitions.includes(competitionId) ||
		user.data.seasons?.includes(competitionId)
		: false
	const firebase = React.useContext(FirebaseContext)
	const [competitionInfo, setCompetitionInfo] = useState(null)
	React.useEffect(() => {
		if (user === undefined) {
			signIn()
		}
		if (competitionId === 's2') {
			firebase
				.firestore()
				.collection('seasons')
				.doc(competitionId)
				.get()
				.then((resp) => setCompetitionInfo(resp.data()))
		} else
			firebase
				.firestore()
				.collection('competitions')
				.doc(competitionId)
				.get()
				.then((resp) => {
					setCompetitionInfo(resp.data())
				})
				.catch((err) => setError(err))
	}, [competitionId, firebase, user])
	const handleChange = (event) => {
		setChecked(event.target.checked)
	}
	const handleSubmit = (register) => {
		const exec = register ? registerCompetitor : cancelCompetitor
		exec(
			firebase,
			user.wca.id.toString(),
			user.wca.name,
			user.wca.wca_id,
			competitionId
		)
			.then(() => window.location.reload())
			.catch((err) => setError(err))
	}
	const classes = useStyles()
	return (
		<>
			{!user || !competitionInfo ? (
				<LinearProgress />
			) : error ? (
				<Typography variant='h1' color='error'>
					{error}
				</Typography>
			) : (
						<Grid
							container
							alignItems='center'
							justify='center'
							alignContent='center'
							className={classes.grid}
							spacing={1}
							direction='column'
						>
							<Grid item>
								<Typography variant='h6'>{competitionInfo.name}</Typography>
							</Grid>
							<Grid item>
								<Avatar
									alt={user.wca.name}
									src={user.wca.avatar.url}
									className={classes.avatar}
								/>
							</Grid>
							<Grid item>
								<TextField label='Name' value={user.wca.name} disabled />
								<TextField
									fullWidth
									label='Email'
									value={user.wca.email}
									disabled
									helperText={
										<>
											{`You can change this information in your WCA
									Account `}
											<Link href={`${WCA_ORIGIN}/profile/edit`}>here</Link>
										</>
									}
								/>
							</Grid>
							{registered ? (
								<>
									<Grid item>
										<Typography variant='h4'>
											{`You have successfully registered for ${competitionInfo.name} competition. Please check ${user.wca.email} for a confirmation of your registration`}
										</Typography>
									</Grid>
									<Grid item>
										<Button
											onClick={() => handleSubmit(false)}
											variant='contained'
											color='primary'
											disabled
										>
											Cancel Registration
								</Button>
									</Grid>
								</>
							) : new Date() > new Date(competitionInfo.registrationEnd) ? (
								<Grid item>
									<Typography align='center' variant='h4'>
										{`Registration is closed. Follow `}
										<Link href='https://instagram.com/cubingusa'>
											{` CubingUSA `}
										</Link>
										{`for notifications about upcoming Cubing At Home
								Competitions!`}
									</Typography>
								</Grid>
							) : new Date() < new Date(competitionInfo.registrationStart) ? (
								<Grid item>
									<Typography align='center' variant='h4'>
										{`Registration opens on: ${new Date(
											competitionInfo.registrationStart
										).toString()} `}
									</Typography>
								</Grid>
							) : (
											<>
												<h2>Important, Please Read</h2>
												{competitionId === 's2' && (
													<ul style={{ maxWidth: '50vw', fontSize: '16px' }}>
														<li>
															{`By registering, you are signing up for all 5 Season 2 competitions. 
												You do not need to register for each event individually.
												Please check your email(${user.wca.email}) for a confirmation once you register. If you do not see a confirmation, contact us from the icon below `}
														</li>
														<li>
															Season 2 Events:
										<ul>
																{competitionInfo.competitions.map((competition) => (
																	<li>{`${competition.name}: ${moment(
																		competition.start
																	).format('dddd MMMM Do')}`}</li>
																))}
															</ul>
														</li>
													</ul>
												)}
												<Grid item>
													<FormControlLabel
														style={{ maxWidth: '50vw' }}
														control={
															<Checkbox
																checked={checked}
																onChange={handleChange}
																color='primary'
															/>
														}
														label={
															<>
																<ul>
																	{competitionId === 's2' && (
																		<li>
																			{`If you are eligible for a leaderboard prize or a participating prize from our sponsors, we have the right to deny the prize if we suspect cheating or any form of violations against the `}{' '}
																			<Link href='https://docs.google.com/document/d/e/2PACX-1vQgJNuwV3bCHidJn2QGjrShAlRPV4X6luLTr7D120RUhaBbTPnn2qdGf3KCR2Rsk1m3vzk4JB6TjB07/pub'>
																				{'Cubing at Home 2 rules'}
																			</Link>
																		</li>
																	)}
																	<li>
																		By signing up, I agree to submit my times as they
																		occur along with any penalties. I understand that any
																		form of cheating can result in disqualification for
																		any further Cubing at Home competitions.
												</li>
																	<li>
																		I also understand that in order to claim a podium
																		prize, I am required to submit a full uncut video of
																		the entire round.
												</li>
																	<li>
																		I allow CubingUSA and/or The Cubicle to edit and
																		repost any videos I submit and content I particiapte
																		in for this event without any additional compensation
												</li>
																</ul>
															</>
														}
													/>
												</Grid>
												<Grid item>
													<Button
														color='primary'
														disabled={!checked}
														variant='contained'
														onClick={() => handleSubmit(true)}
													>
														Register
								</Button>
												</Grid>
											</>
										)}
						</Grid>
					)}
		</>
	)
}
