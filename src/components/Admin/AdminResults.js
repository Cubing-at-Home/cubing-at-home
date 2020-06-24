import React, { useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '../../utils/firebase'
import MUIDataTable from 'mui-datatables'
import { formatAttemptResult, parseActivityCode } from '../../logic/attempts'
import { activityKey } from '../../logic/consts'
import AdminApproveFlaggedResult from './AdminApproveFlaggedResult'
import moment from 'moment'
import IconButton from '@material-ui/core/IconButton'
import Approve from '@material-ui/icons/ThumbUp'
import { approveFlaggedResult } from '../../database/writes'

export default function AdminResults({ competitionId }) {
	const [loading, setLoading] = useState(false)
	const firebase = useContext(FirebaseContext)
	const handleApprove = async (result) => {
		console.log(result)
		setLoading(true)
		await approveFlaggedResult(firebase, competitionId, result)
		setLoading(false)
	}
	const columns = [
		{
			name: 'personId',
			label: 'ID',
			options: { display: 'false', print: false, download: false },
		},
		{
			name: 'name',
			label: 'Name',
		},
		{
			name: 'round',
			label: 'Round ID',
			options: {
				customBodyRender: (val) => {
					const { eventId, roundNumber } = parseActivityCode(val)
					return `${activityKey[eventId]} Round ${roundNumber}`
				},
				filter: false,
			},
		},
		{
			name: 'best',
			label: 'Single',
			options: {
				customBodyRender: (val, tableMeta) =>
					formatAttemptResult(
						val,
						parseActivityCode(tableMeta.rowData[2]).eventId
					),
				filter: false,
			},
		},
		{
			name: 'average',
			label: 'Average',
			options: {
				customBodyRender: (val, tableMeta) =>
					formatAttemptResult(
						val,
						parseActivityCode(tableMeta.rowData[2]).eventId,
						true
					),
			},
		},
		{
			name: 'attempts',
			label: 'Attempts',
			options: {
				customBodyRender: (val, tableMeta) =>
					val
						.map((solve) =>
							formatAttemptResult(
								solve,
								parseActivityCode(tableMeta.rowData[2]).eventId
							)
						)
						.join(', '),
			},
		},
		{
			name: 'lastUpdated',
			label: 'Last Updated',
			options: {
				customBodyRender: (val) => moment(val.toDate()).format('LT'),
			},
		},
		{
			name: 'reason',
			label: 'Reason',
			options: {},
		},
		{
			name: 'Approve',
			label: 'Approve',
			options: {
				download: false,
				print: false,
				sort: false,
				filter: false,
				customBodyRender: (value, tableMeta, rowIndex) => (
					<IconButton
						disabled={loading}
						onClick={() => handleApprove(results[tableMeta.rowIndex])}
					>
						<Approve />
					</IconButton>
				),
			},
		},
	]

	const [results, setResults] = useState([])
	useEffect(() => console.log(results), [results])
	const subscribeToFlaggedResults = () => {
		return firebase
			.firestore()
			.collection('competitions')
			.doc(competitionId)
			.collection('Flagged_Results')
			.orderBy('lastUpdated')
			.onSnapshot((snapshot) => {
				let newResults = []
				snapshot.forEach((doc) => {
					const data = doc.data()
					newResults.push(data)
				})
				setResults(newResults)
			})
	}
	useEffect(() => {
		const unsubscribe = subscribeToFlaggedResults()
		return () => unsubscribe()
	}, [])

	return (
		<>
			<MUIDataTable
				title='Flagged Competitors'
				data={results}
				columns={columns}
				options={{
					customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
						<AdminApproveFlaggedResult
							results={displayData}
							setSelectedRows={setSelectedRows}
							competitionId={competitionId}
						/>
					),
				}}
			/>
		</>
	)
}
