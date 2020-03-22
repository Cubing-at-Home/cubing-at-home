import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import CubingIcon from './CubingIcon'
import Typography from '@material-ui/core/Typography'
import InfoIcon from '@material-ui/icons/Info'
import Grid from '@material-ui/core/Grid'

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
	'4bld': '4x4 Blindfolded',
	skewb: 'Skewb',
	clock: 'Clock',
	'333ft': '3x3 with Feet',
	'333mbf': '3x3 Multiple Blindfolded',
	'333fm': 'Fewest Moves',
	sq1: 'Square 1',
	minx: 'Megaminx',
	Welcome: 'Welcome'
}

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
})

function createData(id, name, start, qualification) {
	return { id, name, start, qualification }
}

const rows = [
	createData('', 'Welcome', '11:30 AM', ''),
	createData('555', '5x5 Combined Final', '11:40 AM', ''),
	createData('sq1', 'Square 1 Combined Final ', '12:10 PM', ''),
	createData('444', '4x4 Round 1', '12:30 PM', ''),
	createData('skewb', 'Skewb Combined Finals', '1:00 PM', ''),
	createData('333', '3x3 Round 1', '1:20 PM', ''),
	createData('pyram', 'Pyraminx Round 1', '1:40 PM', ''),
	createData('222', '2x2 Round 1', '2:00 PM', ''),
	createData('333bf', '3x3 Blindfolded Round 1', '2:20 PM', ''),
	createData('333oh', '3x3 One Handed Round 1', '2:40 PM', ''),
	createData('333', '3x3 Round 2', '3:00 PM', 'Top 50%'),
	createData('444', '4x4 Finals', '3:20 PM', 'Top 8'),
	createData('pyram', 'Pyraminx Finals', '3:40 PM', 'Top 8'),
	createData('333bf', '3x3 Blindfolded Finals', '4:00 PM', 'Top 8'),
	createData('222', '2x2 Finals', '4:20 PM', 'Top 8'),
	createData('333', '3x3 Finals', '4:40 PM', 'Top 8'),
	createData('', 'Awards', '5:00 PM', '')
]

export default function SimpleTable() {
	const classes = useStyles()

	return (
		<>
			<Grid
				container
				alignItems='center'
				alignContent='center'
				justify='center'
			>
				<Grid item>
					<Typography align='center' variant='h6' color='error'>
						<InfoIcon />
						Please note that times are in EDT
					</Typography>
				</Grid>
				<TableContainer component={Paper}>
					<Table className={classes.table} aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell
									size='small'
									align='left'
								></TableCell>
								<TableCell align='left'>Event</TableCell>
								<TableCell align='right'>Time</TableCell>
								<TableCell align='right'>
									Qualification
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map(row => (
								<TableRow key={row.name}>
									<TableCell
										colSpan={1}
										size='small'
										align='left'
									>
										<CubingIcon event={row.id} />
									</TableCell>
									<TableCell align='left'>
										<Typography variant='h6'>
											{row.name}
										</Typography>
									</TableCell>
									<TableCell align='right'>
										{row.start}
									</TableCell>
									<TableCell align='right'>
										{row.qualification}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</>
	)
}
