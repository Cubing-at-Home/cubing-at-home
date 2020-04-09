import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import { LinearProgress } from '@material-ui/core'

export default function ShowScrambles({ round }) {
	const [show, setShow] = useState(true)
	const [scrambles, setScrambles] = useState(null)
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
