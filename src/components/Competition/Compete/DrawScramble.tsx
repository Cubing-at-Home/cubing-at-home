import React, { ReactElement } from 'react'
import Typography from '@material-ui/core/Typography'

interface Props {
	scramble: string
	eventId: string
}

const validEvents = [
	'222',
	'333',
	'444',
	'555',
	'666',
	'777',
	'333bf',
	'333fm',
	'333oh',
	'clock',
	'minx',
	'pyram',
	'skewb',
	'sq1',
	'444bf',
	'555bf',
	'333mbf',
	'333ft',
	'mirror'
]

export default function DrawScramble({
	scramble,
	eventId,
}: Props): ReactElement {
	if (validEvents.includes(eventId)) {
		let scrambleParse = scramble
		if(eventId ==='sq1') {
			scrambleParse = scrambleParse.replace(/, /g, ",").replace(/,/g, ", ");
		}
		return (
			<>
				<scramble-display
					visualization='2D'
					event={eventId === 'mirror' ? '333' : eventId}
					scramble={scrambleParse}
				/>
				{eventId === 'pyram' && (
					<Typography>Note: Pyraminx Orientation is incorrect. </Typography>
				)}
			</>
		)
	}
	else
		return (
			<Typography variant='body1' color='error' align='center'>
				Unable to display scramble
			</Typography>
		)
}
