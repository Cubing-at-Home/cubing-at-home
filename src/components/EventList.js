import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import ButtonBase from '@material-ui/core/Button'
import CubingIcon from './CubingIcon'

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
	iconSelect: {
		fontSize: 20,
		padding: theme.spacing(1),
		color: theme.palette.primary.main,
		'&:hover': {
			opacity: 0.7,
		},
	},
}))

export default function EventList({
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
						{button ? (
							<ButtonBase
								disableRipple
								className={
									selected.includes(event) ? classes.iconSelect : classes.icon
								}
								onClick={() => onClick(event, index)}
							>
								<CubingIcon small={small} event={event} showName={showName} />
							</ButtonBase>
						) : (
							<CubingIcon small={small} event={event} showName={showName} />
						)}
					</Grid>
				))}
			</Grid>
		</div>
	)
}
