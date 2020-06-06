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
	const db = firebase.firestore()
	const batch = db.batch()
	const userRef = db.collection('Users').doc(userId)
	batch.update(userRef, {
		'data.competitions': firebase.firestore.FieldValue.arrayUnion(
			competitionId
		),
	})
	const competitionRef = db.collection('competitions').doc(competitionId)
	batch.update(competitionRef, {
		competitorCount: firebase.firestore.FieldValue.increment(1),
	})
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
	return batch.commit()
}
