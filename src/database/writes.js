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
	let season1 = false
	let competitions = [competitionId]
	if (competitionId === 's1') {
		season1 = true
		competitions = ['cah1.1', 'cah1.2', 'cah1.3', 'cah1.4', 'cah1.5']
	}
	const db = firebase.firestore()
	const batch = db.batch()
	const userRef = db.collection('Users').doc(userId)
	batch.update(userRef, {
		'data.competitions': firebase.firestore.FieldValue.arrayUnion(
			...competitions
		),
		'data.seasons': firebase.firestore.FieldValue.arrayUnion('s1'),
	})
	// for (const competition of competitions) {
	// 	const competitionRef = db.collection('competitions').doc(competition)
	// 	batch.update(competitionRef, {
	// 		competitorCount: firebase.firestore.FieldValue.increment(1),
	// 	})
	// }
	if (season1) {
		const seasonRef = db.collection('seasons').doc('s1')
		batch.update(seasonRef, {
			competitorCount: firebase.firestore.FieldValue.increment(1),
		})
		const emailRef = userRef.collection('mails').doc('s1')
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
		.doc(results.personId)
	let prevFlaggedResult = await prevFlaggedResultRef.get()
	let userResults = {
		competitionId,
		results: [],
	}
	if (userPrevResultRef.exists) {
		userResults = userPrevResultRef.data()
	}
	userResults.results[roundId] = {
		roundId,
		average: results.average,
		attempts: results.attempts,
		best: results.best,
		lastUpdated: results.lastUpdated,
	}
	const batch = db.batch()
	const competitionResultRef = db
		.collection('competitions')
		.doc(competitionId)
		.collection('Events')
		.doc(roundId.split('-')[0])
		.collection('Rounds')
		.doc(roundId)
		.collection('Results')
		.doc(results.personId)
	batch.set(competitionResultRef, results)
	batch.set(userResultRef, userResults)
	if (results.flagged.isFlagged) {
		const competitionFlaggedRef = db
			.collection('competitions')
			.doc(competitionId)
			.collection('Flagged_Results')
			.doc(results.personId)
		const { flagged, lastUpdated, ...other } = results
		batch.set(
			competitionFlaggedRef,
			{
				flagged: true,
				reason: results.flagged.reason,
				lastUpdated: results.lastUpdated,
				count: firebase.firestore.FieldValue.increment(1),
				round: roundId,
				...other,
			},
			{ merge: true }
		)
	}
	// if result was flagged but is now fine, delete the flagged result
	else if (!results.flagged.isFlagged && prevFlaggedResult.exists) {
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
