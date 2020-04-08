import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import CubingIcon from '../CubingIcon'
import Typography from '@material-ui/core/Typography'
import InfoIcon from '@material-ui/icons/Info'
import Grid from '@material-ui/core/Grid'
import jstz from 'jstimezonedetect'
import { Tooltip } from '@material-ui/core'
import moment from 'moment-timezone'
import LinearProgress from '@material-ui/core/LinearProgress'
const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
})

export default function Schedule({ competitionInfo }) {
	const [timezone, setTimezone] = useState(null)
	const rows = competitionInfo.schedule || []
	const date = competitionInfo.start.toDate().toISOString().split('T')[0]
	useEffect(() => {
		setTimezone(jstz.determine().name())
	}, [])
	const classes = useStyles()

	return (
		<>
			{!timezone ? (
				<LinearProgress />
			) : (
				<Grid
					container
					alignItems='center'
					alignContent='center'
					justify='center'
					direction='column'
				>
					<Grid item>
						<Tooltip title={`Showing times in ${timezone}`}>
							<Typography align='center' variant='h4'>
								<InfoIcon />
							</Typography>
						</Tooltip>
						<Typography align='center' variant='h4'>
							{competitionInfo.start.toDate().toDateString()}
						</Typography>
					</Grid>
					<TableContainer component={Paper}>
						<Table className={classes.table}>
							<TableHead>
								<TableRow>
									<TableCell
										size='small'
										align='left'
									></TableCell>
									<TableCell align='left'>Event</TableCell>
									<TableCell align='right'>
										<Grid
											container
											direction='column'
											justify='center'
										>
											<Grid item>
												<Tooltip
													title={`Showing times in ${timezone}`}
												>
													<InfoIcon size='small' />
												</Tooltip>
											</Grid>
											<Grid item>
												<Typography>{`Start`}</Typography>
											</Grid>
										</Grid>
									</TableCell>
									<TableCell align='right'>End</TableCell>
									<TableCell align='right'>
										Qualification
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row) => (
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
											{moment(
												`${date}T${row.start}-04:00`
											)
												.tz(timezone)
												.format('hh:mm a')}
										</TableCell>
										<TableCell align='right'>
											{moment(`${date}T${row.end}-04:00`)
												.tz(timezone)
												.format('hh:mm a')}
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
			)}
		</>
	)
}
