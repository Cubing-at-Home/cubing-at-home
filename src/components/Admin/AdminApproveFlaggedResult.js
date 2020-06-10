import React, { useContext } from 'react'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import IconButton from '@material-ui/core/IconButton'
import Approve from '@material-ui/icons/ThumbUp'
import { approveFlaggedResult } from '../../database/writes'
import { FirebaseContext } from '../../utils/firebase'
export default function AdminApproveFlaggedResult({
	results,
	setSelectedRows,
	competitionId,
}) {
	const firebase = useContext(FirebaseContext)
	const [loading, setLoading] = React.useState(false)
	console.log(results)
	const approveResults = async () => {
		setLoading(true)
		for (const result of results) {
			await approveFlaggedResult(firebase, competitionId, result[0])
		}
		setSelectedRows(false)
	}
	return (
		<ButtonGroup variant='text' color='default' aria-label=''>
			<IconButton disabled={loading} aria-label='' onClick={approveResults}>
				<Approve />
			</IconButton>
		</ButtonGroup>
	)
}
