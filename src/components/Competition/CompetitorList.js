import { Link } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import React from 'react'
import { formatAttemptResult } from '../../logic/attempts'
import { WCA_ORIGIN } from '../../logic/env'

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(2),
		overflow: 'auto',
	},
	list: {
		height: '400',
		textAlign: 'center',
	},
}))

export default function CompetitorList({
	onClick,
	competitors,
	event,
	page,
	total,
	registered,
}) {
	const classes = useStyles()
	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} aria-label='simple table'>
				<TableHead>
					<TableRow>
						<TableCell align='left'>#</TableCell>
						<TableCell>Name</TableCell>
						<TableCell>WCA ID</TableCell>
						<TableCell align='right'>Average</TableCell>
						<TableCell align='right'>WR</TableCell>
						<TableCell align='right'>Single</TableCell>
						<TableCell align='right'>WR</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{competitors.map((row, i) => (
						<TableRow key={row.wca.id}>
							<TableCell>{i + 1}</TableCell>
							<TableCell component='th' scope='row'>
								<Link
									href={`${WCA_ORIGIN}/persons/${row.wca.wca_id}`}
								>
									{row.wca.name}
								</Link>
							</TableCell>
							<TableCell align='left'>
								{row.wca.wca_id || ''}
							</TableCell>
							<TableCell align='right'>
								{formatAttemptResult(
									row.wca.personal_records[event]?.average
										?.best || 0,
									event,
									true
								)}
							</TableCell>
							<TableCell align='right'>
								{row.wca.personal_records[event]?.average
									?.world_rank || ''}
							</TableCell>
							<TableCell align='right'>
								{formatAttemptResult(
									row.wca.personal_records[event]?.single
										?.best || '',
									event,
									false
								)}
							</TableCell>
							<TableCell align='right'>
								{row.wca.personal_records[event]?.single
									?.world_rank || ''}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
