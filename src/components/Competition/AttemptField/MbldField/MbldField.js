import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'

import { dnfKeys, dnsKeys } from '../keybindings'
import TimeField from '../TimeField/TimeField'
import CubesField from '../CubesField/CubesField'
export const decodeMbldAttempt = (value) => {
	if (value <= 0) return { solved: 0, attempted: 0, centiseconds: value }
	const missed = value % 100
	const seconds = Math.floor(value / 100) % 1e5
	const points = 99 - (Math.floor(value / 1e7) % 100)
	const solved = points + missed
	const attempted = solved + missed
	const centiseconds = seconds === 99999 ? null : seconds * 100
	return { solved, attempted, centiseconds }
}

export const encodeMbldAttempt = ({ solved, attempted, centiseconds }) => {
	if (centiseconds <= 0) return centiseconds
	const missed = attempted - solved
	const points = solved - missed
	const seconds = Math.round(
		(centiseconds || 9999900) / 100
	) /* 99999 seconds is used for unknown time. */
	return (99 - points) * 1e7 + seconds * 1e2 + missed
}

export const validateMbldAttempt = ({ attempted, solved, centiseconds }) => {
	if (!attempted || solved > attempted) {
		return { solved, attempted: solved, centiseconds }
	}
	if (solved < attempted / 2 || solved <= 1) {
		return { solved: 0, attempted: 0, centiseconds: -1 }
	}
	/* Allow additional (arbitrary) 30 seconds over the limit for +2s. */
	if (centiseconds > 10 * 60 * 100 * Math.min(6, attempted) + 30 * 100) {
		return { solved: 0, attempted: 0, centiseconds: -1 }
	}
	return { solved, attempted, centiseconds }
}

const MbldField = ({ initialValue, onValue, disabled, label }) => {
	const [prevInitialValue, setPrevInitialValue] = useState(null)
	const [decodedValue, setDecodedValue] = useState(
		decodeMbldAttempt(initialValue)
	)

	/* Sync local value when initial value changes. See AttemptField for detailed description. */
	if (prevInitialValue !== initialValue) {
		setDecodedValue(decodeMbldAttempt(initialValue))
		setPrevInitialValue(initialValue)
	}

	const handleDecodedValueChange = (decodedValue) => {
		const updatedDecodedValue = validateMbldAttempt(decodedValue)
		if (encodeMbldAttempt(updatedDecodedValue) !== initialValue) {
			onValue(encodeMbldAttempt(updatedDecodedValue))
			/* Once we emit the change, reflect the initial state. */
			setDecodedValue(decodeMbldAttempt(initialValue))
		} else {
			setDecodedValue(updatedDecodedValue)
		}
	}

	const handleAnyInput = (event) => {
		const key = event.nativeEvent.data
		if (dnfKeys.includes(key)) {
			handleDecodedValueChange(decodeMbldAttempt(-1))
			event.preventDefault()
		} else if (dnsKeys.includes(key)) {
			handleDecodedValueChange(decodeMbldAttempt(-2))
			event.preventDefault()
		}
	}

	return (
		<Grid
			container
			direction='row'
			spacing={1}
			onInputCapture={handleAnyInput}
		>
			<Grid item xs={2}>
				<CubesField
					initialValue={decodedValue.solved}
					onValue={(solved) =>
						handleDecodedValueChange({ ...decodedValue, solved })
					}
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={2}>
				<CubesField
					initialValue={decodedValue.attempted}
					onValue={(attempted) =>
						handleDecodedValueChange({ ...decodedValue, attempted })
					}
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={8}>
				<TimeField
					label={label}
					initialValue={decodedValue.centiseconds}
					onValue={(centiseconds) =>
						handleDecodedValueChange({
							...decodedValue,
							centiseconds,
						})
					}
					disabled={disabled}
				/>
			</Grid>
		</Grid>
	)
}

export default MbldField
