import { getUserResults } from '../logic/wca-api'

export const createNewUser = async (firebase, user) => {
	let user_results = null
	if (user.wca_id !== null && user.wca_id !== undefined) {
		user_results = await getUserResults(user)
	}
	const db = firebase.firestore()
	return new Promise((resolve, reject) => {
		const docData = {
			wca: {
				avatar: user.avatar,
				country_iso2: user.country_iso2,
				email: user.email,
				gender: user.gender,
				id: user.id,
				name: user.name,
				wca_id: user.wca_id ? user.wca_id : null,
				last_updated: new Date(),
				personal_records: user_results ? user_results.personal_records : {},
				isDelegate: user_results && user_results.delegate_status ? true : false,
			},
			data: {
				competitions: [],
				results: [],
			},
		}
		db.collection('Users')
			.doc(user.id.toString())
			.set(docData)
			.then(resolve(docData))
			.catch((err) => reject(err))
	})
}

export const updateEmail = async (firebase, user) => {
	let user_results = null
	if (user.wca_id !== null && user.wca_id !== undefined) {
		user_results = await getUserResults(user)
	}
	const db = firebase.firestore()
	return new Promise((resolve, reject) => {
		const  updatedData = {
			wca: {
				avatar: user.avatar,
				country_iso2: user.country_iso2,
				email: user.email,
				gender: user.gender,
				id: user.id,
				name: user.name,
				wca_id: user.wca_id ? user.wca_id : null,
				last_updated: new Date(),
				personal_records: user_results ? user_results.personal_records : {},
				isDelegate: user_results && user_results.delegate_status ? true : false,
				},
				data: {
					competitions: [],
					results: [],
				},
			}
		db.collection("Users")
			.doc(user.id.toString())
			.update({ "wca.email": user.email })
			.then(resolve(updatedData))
			.catch((err)=>reject(err))
	})
}

export const createNewCompetition = async (
	firebase,
	competition,
	eventInfo
) => {
	const db = firebase.firestore()
	return db
		.collection(competition.id)
		.doc('info')
		.set(competition)
		.then(() => {
			db.collection(competition.id)
				.doc('events')
				.set({ eventInfo: eventInfo })
				.then(() => {
					db.collection('Competitions').doc(competition.id).set({
						id: competition.id,
						name: competition.name,
						start: competition.start,
						end: competition.end,
						schedule: competition.schedule
					})
				})
		})
}

export const registerCompetitor = async (
	firebase,
	userId,
	name,
	wcaId,
	competitionId
) => {
	let season2 = false
	let competitions = [competitionId]
	if (competitionId === 's2') {
		season2 = true
		competitions = ['cah2.1', 'cah2.2', 'cah2.3', 'cah2.4', 'cah2.5']
	}
	const db = firebase.firestore()
	const batch = db.batch()
	const userRef = db.collection('Users').doc(userId)
	batch.update(userRef, {
		'data.competitions': firebase.firestore.FieldValue.arrayUnion(
			...competitions
		),
		'data.seasons': firebase.firestore.FieldValue.arrayUnion('s2'),
	})
	// for (const competition of competitions) {
	// 	const competitionRef = db.collection('competitions').doc(competition)
	// 	batch.update(competitionRef, {
	// 		competitorCount: firebase.firestore.FieldValue.increment(1),
	// 	})
	// }
	if (season2) {
		const seasonRef = db.collection('seasons').doc('s2')
		batch.update(seasonRef, {
			competitorCount: firebase.firestore.FieldValue.increment(1),
		})
		const emailRef = userRef.collection('mails').doc('s2')
		batch.set(emailRef, { registered: true, registeredAt: new Date() })
	}
	return batch.commit()
}

export const cancelCompetitor = async (
	firebase,
	userId,
	name,
	wcaId,
	competitionId
) => {
	const db = firebase.firestore()
	const batch = db.batch()
	const userRef = db.collection('Users').doc(userId)
	const competitionRef = db.collection('competitions').doc(competitionId)
	batch.update(userRef, {
		'data.competitions': firebase.firestore.FieldValue.arrayRemove(
			competitionId
		),
	})
	batch.update(competitionRef, {
		competitorCount: firebase.firestore.FieldValue.increment(-1),
	})
	return batch.commit()
}

export const submitTime = async (firebase, competitionId, roundId, results) => {
	const result = { ...results, lastUpdated: new Date() }
	const db = firebase.firestore()
	const userResultRef = db
		.collection('Users')
		.doc(results.personId)
		.collection('Results')
		.doc(competitionId)
	const userPrevResultRef = await userResultRef.get()
	const prevFlaggedResultRef = db
		.collection('competitions')
		.doc(competitionId)
		.collection('Flagged_Results')
		.doc(`${results.personId}-${roundId}`)
	let prevFlaggedResult = await prevFlaggedResultRef.get()
	const batch = db.batch()
	if (results.isSubmitted) {
		let userResults = {
			competitionId,
			results: [],
		}
		if (userPrevResultRef.exists) {
			userResults = userPrevResultRef.data()
		}
		userResults.results.push({
			roundId,
			average: results.average,
			attempts: results.attempts,
			best: results.best,
			lastUpdated: results.lastUpdated,
			flagged: results.flagged,
		})
		batch.set(userResultRef, userResults, { merge: true })
	}
	const competitionResultRef = db
		.collection('competitions')
		.doc(competitionId)
		.collection('Events')
		.doc(roundId.split('-')[0])
		.collection('Rounds')
		.doc(roundId)
		.collection('Results')
		.doc(result.personId)
	batch.set(competitionResultRef, result, { merge: true })
	if (results?.flagged?.isFlagged) {
		const competitionFlaggedRef = db
			.collection('competitions')
			.doc(competitionId)
			.collection('Flagged_Results')
			.doc(`${results.personId}-${roundId}`)
		const { flagged, lastUpdated, ...other } = results
		batch.set(
			competitionFlaggedRef,
			{
				flagged: true,
				reason: results.flagged.reason,
				lastUpdated: result.lastUpdated,
				count: firebase.firestore.FieldValue.increment(1),
				round: roundId,
				...other,
			},
			{ merge: true }
		)
	}
	// if result was flagged but is now fine, delete the flagged result
	else if (!results?.flagged?.isFlagged && prevFlaggedResult.exists) {
		batch.delete(prevFlaggedResultRef)
	}
	return batch.commit()
}

export const approveFlaggedResult = async (firebase, competitionId, result) => {
	let newResult = {
		name: result.name,
		lastUpdated: new Date(),
		personId: result.personId,
		best: result.best,
		average: result.average,
		attempts: result.attempts,
		flagged: {
			isFlagged: false,
			reason: result.reason,
		},
	}
	return submitTime(firebase, competitionId, result.round, newResult)
}

export const removeResult = async (
	firebase,
	competitionId,
	roundId,
	results
) => {
	const result = { ...results, lastUpdated: new Date() }
	const db = firebase.firestore()
	const userResultRef = db
		.collection('Users')
		.doc(results.personId)
		.collection('Results')
		.doc(competitionId)
	const userPrevResultRef = await userResultRef.get()
	const prevFlaggedResultRef = db
		.collection('competitions')
		.doc(competitionId)
		.collection('Flagged_Results')
		.doc(`${results.personId}-${roundId}`)
	let userResults = {
		competitionId,
		results: [],
	}
	if (userPrevResultRef.exists) {
		userResults = userPrevResultRef.data()
	}
	userResults.results = userResults.results.filter(
		(result) => result.roundId !== roundId
	)
	const batch = db.batch()
	const competitionResultRef = db
		.collection('competitions')
		.doc(competitionId)
		.collection('Events')
		.doc(roundId.split('-')[0])
		.collection('Rounds')
		.doc(roundId)
		.collection('Results')
		.doc(result.personId)
	batch.delete(competitionResultRef)
	batch.set(userResultRef, userResults, { merge: true })
	batch.delete(prevFlaggedResultRef)
	return batch.commit()
}

export const banCompetitor = async (firebase, personId) => {
	return firebase
		.firestore()
		.collection('Users')
		.doc(personId)
		.set({ data: { banned: true } }, { merge: true })
}

export const createTimerRoom = async (firebase, player1, player2) => {
	let roomId = `${player1.wca.id}-${player2.wca.id}`

	const docData = {
		name: `${player1.wca.name} (${player1.wca.wca_id}) vs ${player2.wca.name} (${player2.wca.wca_id})`,
		wcaId: `${player1.wca.wca_id}-${player2.wca.wca_id}`,
	}
	await firebase.firestore()
		.collection('timer-rooms')
		.doc(roomId)
		.set(docData)

	let playerData = {
		attempts: [],
		'current-time': 0,
		id: player1.wca.id,
		name: player1.wca.name,
		ready: false,
		state: 'waiting',
		'time-started': 0,
		'timer-started': false,
		'timer-state': -1,
	}
	await firebase.firestore()
		.collection('timer-rooms')
		.doc(roomId)
		.collection('runners')
		.doc('runner1')
		.set(playerData)

	playerData.id = player2.wca.id
	await firebase.firestore()
		.collection('timer-rooms')
		.doc(roomId)
		.collection('runners')
		.doc('runner2')
		.set(playerData)
	
	return roomId
}
