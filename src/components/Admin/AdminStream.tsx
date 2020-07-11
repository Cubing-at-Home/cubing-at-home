import React, { ReactElement, useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import useFirebase from '../../hooks/useFirebase'
import { Link, Button } from '@material-ui/core'

interface Props {
	competitionId: string
}

interface StreamInfo {
	round: string
	wcaIds: string[]
}

export default function AdminStream(): ReactElement {
	const firebase = useFirebase()

	const [streamInfo, setStreamInfo] = useState<StreamInfo>({
		round: '',
		wcaIds: [],
	})

	useEffect(() => {
		const unsub = firebase!
			.firestore()
			.collection('stream')
			.doc('competitor')
			.onSnapshot((doc) => setStreamInfo(doc.data() as StreamInfo))
		return () => unsub()
	}, [])

	return (
		<Grid
			container
			direction='column'
			justify='center'
			alignContent='center'
			spacing={4}
		>
			<Grid item>
				<TextField
					value={streamInfo.round}
					onChange={({ target: { value } }) =>
						setStreamInfo({ ...streamInfo, round: value })
					}
					label='Round ID'
					helperText={
						<>
							{`Find round info `}
							<Link href='https://docs.google.com/spreadsheets/d/1wRiih3I32_v-Mu5PnMZsPAlxrJiDw-xCunmISWkBD94/edit#gid=10260936'>
								here
							</Link>
						</>
					}
				/>
			</Grid>
			<Grid item>
				<TextField
					value={streamInfo.wcaIds.join(',')}
					onChange={(e) =>
						setStreamInfo({
							...streamInfo,
							wcaIds: e.target.value.replace(/\s/g, '').split(','),
						})
					}
					helperText='Separate WCA IDs by commas (,)'
					label={'WCA IDs'}
				/>
			</Grid>
			<Grid item>
				<Button
					onClick={() =>
						firebase
							?.firestore()
							.collection('stream')
							.doc('competitor')
							.set(streamInfo)
					}
				>
					Update
				</Button>
			</Grid>
		</Grid>
	)
}
