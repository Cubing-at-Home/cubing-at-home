import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Grid, IconButton, Typography } from '@material-ui/core'

const activityKey = {
	'222': '2x2',
	'333': '3x3',
	'444': '4x4',
	'555': '5x5',
	'666': '6x6',
	'777': '7x7',
	pyram: 'Pyraminx',
	'333oh': '3x3 One Handed',
	'333bf': '3x3 Blindfolded',
	'444bf': '4x4 Blindfolded',
	'555bf': '5x5 Blindfolded',
	skewb: 'Skewb',
	clock: 'Clock',
	'333ft': '3x3 with Feet',
	'333mbf': '3x3 Multiple Blindfolded',
	'333fm': 'Fewest Moves',
	sq1: 'Square 1',
	minx: 'Megaminx'
}

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	icon: {
		fontSize: 20,
		padding: theme.spacing(1),
		'&:hover': {
			opacity: 0.7,
			color: theme.palette.primary.main
		}
	},
	iconSelect: {
		fontSize: 20,
		padding: theme.spacing(1),
		color: theme.palette.primary.main,
		'&:hover': {
			opacity: 0.7
		}
	}
}))

export default function EventList({
	selected = [],
	onClick,
	justify,
	events,
	alignment = 'row',
	size = 2,
	user = 'spectator',
	showName = false
}) {
	const classes = useStyles()
	return (
		<div className={classes.root}>
			<Grid spacing={2} container direction={alignment} justify={justify}>
				{events.map(event => (
					<Grid item key={event}>
						<IconButton
							variant='inherit'
							onClick={() => onClick(event)}
						>
							<span
								className={
									(selected.includes(event)
										? classes.iconSelect
										: classes.icon) +
									` cubing-icon event-${event}`
								}
							/>
						</IconButton>
						{showName && (
							<Grid item>
								<Typography align='center'>
									{activityKey[event]}
								</Typography>
							</Grid>
						)}
					</Grid>
				))}
			</Grid>
		</div>
	)
}
