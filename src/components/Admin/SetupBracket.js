import { Button, Link, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import React, { useContext, useEffect, useState } from 'react';
import { createTimerRoom } from '../../database/writes';
import { getTournament } from '../../logic/challonge';
import { activityKey } from '../../logic/consts';
import { FirebaseContext } from '../../utils/firebase';


export default function SetupBracket({ history, competitionId }) {
	const firebase = useContext(FirebaseContext)
	const [challonge, setChallonge] = useState("")
	const [matches, setMatches] = useState(null)
	const [rooms, setRooms] = useState([])
	const [error, setError] = useState(null)
	const [event, setEvent] = useState('333')

	useEffect(() => {
		if (rooms.length === 0) {
			async function fetchRooms() {
				let roomDocs = await firebase.firestore()
					.collection('timer-rooms')
					.get()
				roomDocs.forEach((doc) => {
					rooms.push({
						id: doc.id,
						name: doc.data().name,
						wcaId: doc.data().wcaId,
					})
				})
				setRooms(rooms)
			}
			fetchRooms()
		}
	},[])

	const handleConfirm = async (event) => {
		let challongeId = challonge.match(/https:\/\/challonge.com\/([^/]*)/)
		if (!challongeId) {
			setError(`Failed to match the challonge link with a tournament ID. Make sure the link is in the format https://challonge.com/<tournament id>`)
			return
		}
		setError(false)

		let matches = await getTournament(challongeId[1])
		setMatches(matches)
	}
	
	const getWcaUser = async (wcaId) => {
		let docs = await firebase.firestore().collection('Users')
		.where('wca.wca_id', '==', wcaId).get()
		let doc = null
		docs.forEach(x => {
			doc = x.data() // NOTE: this should only run once for the only result. Or zero times if there are no results in which case doc == null
		})
		return doc
	}
	const handleRoomCreation = async (player1, player2, round) => {
		let player1Doc = await getWcaUser(player1.wcaId)
		let player2Doc = await getWcaUser(player2.wcaId)
		let roomId = await createTimerRoom(firebase, player1Doc, player2Doc, event, round, competitionId) // player1Doc.wca.id == the user id used in the timer room
		let newRooms = rooms.concat({
			id: roomId,
			wcaId: `${player1.wcaId}-${player2.wcaId}`,
		})
		setRooms(newRooms)
	}

	return (
		<Grid
			container
			direction='column'
			alignContent='center'
			justify='center'
			spacing={3}
			style={{ padding: '5vw' }}
		>
			<Grid item>
				<Typography variant='h3'>Setup Bracket</Typography>
			</Grid>
			<Grid item>
				<TextField
					fullWidth
					name={'link'}
					value={challonge}
					label='Challonge Link'
					onChange={e => setChallonge(e.target.value)}
					helperText='This is the challonge tournament link'
				/>
			</Grid>
			<Grid item>
				<InputLabel id='eventId'>Event ID</InputLabel>
				<Select name='id' labelId='eventId' fullWidth onChange={(e) => setEvent(e.target.value)} >
					{Object.keys(activityKey).map(key =>
						<MenuItem key={key} value={key}>{activityKey[key]}</MenuItem>)
					}
				</Select>
			</Grid>
			<Grid item style={{display: 'block', margin: '0 auto'}}>
				<Button
					disabled={challonge === ''}
					variant='contained'
					onClick={handleConfirm}
				>
					Check Challonge
				</Button>
				{error && (
					<Typography color='error' variant='subtitle1'>
						{error}
					</Typography>
				)}
			</Grid>
			<>
			{matches && matches.map(
				(m, i) => Matchup(
					m,
					i,
					rooms.reduce((acc, room) => {
						if (acc) return acc
						if (!room.wcaId) return acc
						if (room.wcaId.includes(m?.player1?.wcaId) && room.wcaId.includes(m?.player2?.wcaId)) return room.id
						else return null
					}, null),
					handleRoomCreation)
			)}
			</>
		</Grid>
	)
}

// TODO: support text fields for entering wcaId if it couldn't be found on the website.
function Matchup(match, key, roomId, handleRoomCreation) {
	let completed = match.state === 'complete'
	if (match.state === 'pending' && !match.player1 && !match.player2) {
		return <div key={key}></div>
	}

	return <div style={{backgroundColor: ((completed && 'green') || (roomId && 'yellow'))}} key={match?.player1?.name + match?.player2?.name}>
		<b>Round {`${match?.round}`}</b><br/>
		{`${match?.player1?.name} (${match?.player1?.wcaId}) vs ${match?.player2?.name} (${match?.player2?.wcaId})`}<br/>
		<Button variant='contained' disabled={completed} onClick={() => handleRoomCreation(match.player1, match.player2, match.round)}>Create Room</Button>
		{roomId && <Link target='_blank' href={`https://timer.cubingathome.com/room/${roomId}`}>Go to timer</Link>}
		<hr/>
	</div>
}
