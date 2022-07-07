import { Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/styles'
import React, { useContext } from 'react'
import { UserContext } from '../../utils/auth'
import EventList from '../EventList'


const useStyles = makeStyles((theme) => ({
	paper: {
		minHeight: '50vh',
	},
}))

export default function Info({ history, match, competitionInfo }) {
	const user = useContext(UserContext)
	const classes = useStyles()
	const competitionId = match.params.id
	const registered = user
		? user.data.competitions.includes(competitionId)
		: false
	return (
		<>
			<Paper className={classes.paper}>
				<Grid
					container
					alignItems='center'
					justify='center'
					direction='column'
					spacing={4}
				>
					<Grid item>
						<Typography variant='h3'>{competitionInfo.name}</Typography>
						<Typography align='center' variant='h6'>
							{competitionInfo.start}
						</Typography>
					</Grid>

					<Grid item>
						<Button
							onClick={() => history.push(`/s2/register`)}
							variant='contained'
							color='primary'
						>
							{registered ? `Registered` : `Manage Your Registration`}
						</Button>
					</Grid>
					<Typography variant='caption' color='error'>
						{`Registration Closes on ${new Date(
							competitionInfo.registrationEnd
						).toString()}`}
					</Typography>
					<Grid item>
						<Typography align='center' variant='h4'>
							Events
						</Typography>
						<EventList
							button={false}
							selected={competitionInfo.eventList}
							events={competitionInfo.eventList}
							showName
							onClick={() => { }}
							small={true}
						/>
					</Grid>
					<Grid item>
						<Typography align='center' variant='h4'>
							Rules
						</Typography>
						<p>
							<strong>Competition Instructions</strong>
						</p>
						<ul>
							<li>
								Open the live stream on{' '}
								<Link href='https://twitch.tv/thecubiclestream'>
									<u>twitch.tv/thecubiclestream</u>
								</Link>
								{' and the '}
								<Link href='https://discord.gg/r5AQD2r'>
									<u>Discord Channel</u>
								</Link>
								{' to follow along as the competition progresses'}
							</li>
						</ul>
						<li>
							{`Once a round opens, you will be able to view scrambles and enter times at: `}
							<Link href={`/${competitionInfo.id}/compete`}>
								<u>{`cubingathome.com/${competitionInfo.id}/compete`}</u>
							</Link>
						</li>
						<ul>
							<li>Scramble your cube using the provided scramble sequence</li>
						</ul>
						<li>
							Complete each of your solves and enter the times and any penalties
						</li>
						<ul>
							<li>
								You can time your solves with a stackmat timer or with another
								timer, such as <u>cstimer.net</u>
							</li>
							<li>
								<b>
									{`Please note: You still need to adhere to WCA
									Inspection. `}
								</b>
								You can use a tool like{' '}
								<Link href='https://cubing.net/inspection'>
									cubing.net/inspection
								</Link>{' '}
								or other similar tools.
							</li>
						</ul>
						<li>
							Enter your time in the format ss.cc (as in 12.34) if it is less
							than a minute and m:ss.cc (as in 2:34.56) if it is over a minute
						</li>
						<li>Rounds will run for 20-30 minutes depending on the event</li>
						<li>Don’t discuss the scrambles in chat until the round is over</li>
						<li>
							After everyone is done, we will post the results at{' '}
							<Link href='https://results.cubingathome.com'>
								{' '}
								<u>results.cubingathome.com/</u>
							</Link>
						</li>

						<p>
							<strong>Requirements to Podium or Make Finals</strong>
						</p>
						<ul>
							<li>
								If you want to be eligible for a podium in any event, you must
								have video of the entire round, which includes
							</li>
							<ul>
								<li>Opening the document with the scrambles</li>
								<li>All of your solves</li>
								<li>Submitting your times</li>
							</ul>

							<li>This must be in one unbroken video for the entire round</li>
							<li>
								We will contact anyone who podiums to get this video for
								verification purposes
							</li>
						</ul>

						<p></p>
					</Grid>
					<Grid item>
						<Paper style={{ width: '80vw' }}>
							<Typography
								stlye={{ margin: '2vw' }}
								align='center'
								variant='body1'
							>
								<b>Note: </b> By signing up, you allow CubingUSA and/or The
								Cubicle to edit and repost any videos you submit and content you
								participate in for this event without any additional
								compensation
							</Typography>
							<Typography align='center' variant='h6'>
								<Link
									color='primary'
									rel='noopener noreferrer'
									href="/contact"
								>
									Contact Us
								</Link>
							</Typography>
						</Paper>
					</Grid>
				</Grid>
			</Paper>
		</>
	)
}
