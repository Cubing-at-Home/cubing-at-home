import { Tooltip } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import HelpOutlinedIcon from '@material-ui/icons/HelpOutlined'
import InfoIcon from '@material-ui/icons/Info'
import jstz from 'jstimezonedetect'
import moment from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import CubingIcon from '../CubingIcon'

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
})

export default function Schedule({ competitionInfo }) {
	const [timezone, setTimezone] = useState(null)
	const rows = competitionInfo.schedule || []
	const date = moment(competitionInfo.start)
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
						<Typography align='center' variant='h4'>
							{moment(`${date.format('YYYY-MM-DDThh:mm')}${competitionInfo.mainTimezone ?? `-05:00`}`)
								.local()
								.format('ll')}
						</Typography>
						<Typography align='center' variant='subtitle1'>
							{`Showing times in ${timezone}`}
						</Typography>
					</Grid>
					<TableContainer component={Paper}>
						<Table className={classes.table}>
							<TableHead>
								<TableRow>
									<TableCell size='small' align='left'></TableCell>
									<TableCell align='left'>Event</TableCell>
									<TableCell align='right'>
										<Grid container direction='column' justify='center'>
											<Grid item>
												<Tooltip title={`Showing times in ${timezone}`}>
													<InfoIcon size='small' />
												</Tooltip>
											</Grid>
											<Grid item>
												<Typography>{`Start`}</Typography>
											</Grid>
										</Grid>
									</TableCell>
									<TableCell align='right'>End</TableCell>
									<TableCell align='right'>Qualification</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((row) => (
									<TableRow key={row.name}>
										<TableCell colSpan={1} size='small' align='left'>
											{row.id === 'mystery' ? (
												<HelpOutlinedIcon />
											) : (
												<CubingIcon event={row.id} />
											)}
										</TableCell>
										<TableCell align='left'>
											<Typography variant='h6'>{row.name}</Typography>
										</TableCell>
										<TableCell align='right'>
											{moment(`${date.format('YYYY-MM-DD')}T${row.start}${competitionInfo.mainTimezone ?? `-05:00`}`)
												.local()
												.format('hh:mm A')}
										</TableCell>
										<TableCell align='right'>
											{moment(`${date.format('YYYY-MM-DD')}T${row.end}${competitionInfo.mainTimezone ?? `-05:00`}`)
												.local()
												.format('hh:mm A')}
										</TableCell>
										<TableCell align='right'>{row.qualification}</TableCell>
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
