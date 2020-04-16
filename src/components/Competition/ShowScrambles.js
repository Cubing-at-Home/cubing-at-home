import React, { useState, useEffect, useContext } from 'react'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import { LinearProgress, Button } from '@material-ui/core'
import { activityKey } from '../../logic/consts'
import { FirebaseContext } from '../../utils/firebase'

export default function ShowScrambles({ competitionId, round }) {
	const [show, setShow] = useState(false)
	const [scrambles, setScrambles] = useState(null)
	const firebase = useContext(FirebaseContext)
	const handleDownload = () => {
		const storage = firebase.storage()
		const storageRef = storage.ref()
		// assumes only 1 scramble set. may be an issue in the future
		const path = `${competitionId}/${
			activityKey[round.id.slice(0, round.id.indexOf('-'))]
		} Round ${round.id.slice(round.id.indexOf('-') + 2)} Scramble Set A.pdf`
		storageRef
			.child(path)
			.getDownloadURL()
			.then((url) => window.open(url, '_blank'))
			.catch((err) => console.error(err))
	}

	useEffect(() => {
		let combinedScrambles = ''
		round.scrambleSets[0].scrambles.map(
			(scramble, i) => (combinedScrambles += `${i + 1}. ${scramble}\n`)
		)
		combinedScrambles += `\n\nExtra Scrambles: \n`
		round.scrambleSets[0].extraScrambles.map(
			(scramble, i) => (combinedScrambles += `${i + 1}. ${scramble}\n`)
		)
		setScrambles(combinedScrambles)
	}, [round])
	return (
		<>
			{!scrambles ? (
				<LinearProgress />
			) : (
				<>
					<Button
						style={{ margin: '3vw' }}
						variant='contained'
						onClick={handleDownload}
					>
						View Scrambles PDF
					</Button>
					<FormControlLabel
						control={
							<Switch
								checked={show}
								onChange={() => setShow(!show)}
							/>
						}
						label={`Show Scrambles`}
					/>
					{show && (
						<TextField
							variant='outlined'
							multiline
							rowsMax={15}
							fullWidth
							helperText={
								'Note: You can copy paste this to cstimer'
							}
							label='Scrambles'
							value={scrambles}
							inputProps={{ readOnly: true }}
						/>
					)}
				</>
			)}
		</>
	)
}
