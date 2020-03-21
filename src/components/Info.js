import React from 'react'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import EventList from './EventList'

const useStyles = makeStyles(theme => ({
	paper: {
		minHeight: '50vh'
	}
}))

export default function Info() {
	const classes = useStyles()
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
						<Button
							onClick={() =>
								(window.location.href =
									'/cubing-at-home-I/register')
							}
							variant='contained'
							color='primary'
						>
							Manage Your Registration
						</Button>
					</Grid>
					<Typography variant='caption' color='error'>
						Registration Closes on Thursday, March 26th, 8 pm EST
					</Typography>
					<Grid item>
						<Typography align='center' variant='h4'>
							Events
						</Typography>
						<EventList
							events={[
								'222',
								'333',
								'444',
								'555',
								'333oh',
								'pyram',
								'333bf',
								'skewb',
								'sq1'
							]}
							showName
							onClick={() => {}}
						/>
					</Grid>
					<Grid item>
						<Typography align='center' variant='h4'>
							Rules
						</Typography>
						<Typography align='center' variant='h6'>
							Need to write this out
						</Typography>
					</Grid>
					<Grid item>
						<Typography align='center' variant='h4'>
							Prizes (Sponsored by TheCubicle.com)
						</Typography>
						<Typography align='center' variant='h6'>
							TBD!
						</Typography>
					</Grid>
				</Grid>
			</Paper>
		</>
	)
}
