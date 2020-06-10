import { parseActivityCode } from '../logic/attempts'

export const getOpenRounds = async (firebase, competitionId, personId = -1) => {
	try {
		const db = firebase.firestore()
		const roundRef = await db
			.collection('competitions')
			.doc(competitionId)
			.get()
		const rounds = roundRef
			.data()
			.rounds.filter((round) => round.isOpen === true)
			.map((round) => round.id)
		// const userRef = await db
		// 	.collection('Users')
		// 	.doc(personId.toString())
		// 	.collection('Results')
		// 	.doc(competitionId)
		// 	.get()
		// const userResults = userRef.data().results
		let qualifiedRounds = rounds
		/**
		 * TODO: need to work on qualified rounds
		 */
		// for (const round of rounds) {
		// 	if (parseInt(round.slice(round.indexOf('r') + 1)) > 1) {
		// 		if (userResults.find((result) => result.roundId === round)?.qualified)
		// 			qualifiedRounds.push(round)
		// 	} else {
		// 		qualifiedRounds.push(round)
		// 	}
		// }
		let roundsInformation = []
		for (const round of qualifiedRounds) {
			const { eventId } = parseActivityCode(round)
			const roundInfoRef = await firebase
				.firestore()
				.collection('competitions')
				.doc(competitionId)
				.collection('Events')
				.doc(eventId)
				.collection('Rounds')
				.doc(round)
				.get()
			const roundInfo = roundInfoRef.data()
			roundsInformation.push(roundInfo)
		}
		console.log(roundsInformation)
		return roundsInformation
	} catch (err) {
		console.log(err)
		return null
	}
}
