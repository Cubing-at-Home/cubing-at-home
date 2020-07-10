import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import ButtonBase from '@material-ui/core/Button'
import CubingIcon from './CubingIcon'
import { parseActivityCode } from '../logic/attempts'
import Badge from '@material-ui/core/Badge'

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	icon: {
		fontSize: 20,
		padding: theme.spacing(1),
		'&:hover': {
			opacity: 0.7,
			color: theme.palette.primary.main,
		},
	},
	selected: {
		color: 'red',
	},
	iconSelect: {
		fontSize: 20,
		padding: theme.spacing(1),
		color: theme.palette.primary.secondary,
		'&:hover': {
			opacity: 0.7,
		},
	},
}))

export default function EventList({
	roundBadge = false,
	badgeProps = {},
	selected = [],
	onClick,
	justify = 'center',
	events,
	alignment = 'row',
	showName = false,
	small = false,
	button = true,
}) {
	const classes = useStyles()
	const eventIds = events.map((event) => parseActivityCode(event).eventId)
	const roundNumbers = events.map(
		(event) => parseActivityCode(event).roundNumber
	)

	return (
		<div className={classes.root}>
			<Grid
				spacing={2}
				container
				direction={alignment}
				justify={justify}
				alignItems='center'
			>
				{events.map((event, index) => (
					<Grid item key={`${event}-${index}`}>
						<Badge
							invisible={!roundBadge}
							badgeContent={roundNumbers[index]}
							{...badgeProps}
						>
							{button ? (
								<ButtonBase
									disableRipple
									className={
										selected.includes(event) ? classes.iconSelect : classes.icon
									}
									onClick={() => onClick(event, index)}
								>
									<CubingIcon
										selected={selected.includes(event)}
										small={small}
										event={eventIds[index]}
										showName={showName}
									/>
								</ButtonBase>
							) : (
								<CubingIcon small={small} event={event} showName={showName} />
							)}
						</Badge>
					</Grid>
				))}
			</Grid>
		</div>
	)
}
