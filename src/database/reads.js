import { parseActivityCode } from '../logic/attempts'

export const getOpenRounds = async (
	firebase,
	competitionId,
	personId = -1,
	showAdmin = false
) => {
	const db = firebase.firestore()
	const roundRef = await db.collection('competitions').doc(competitionId).get()
	const allRounds = roundRef
		.data()
		.rounds.sort((round) => (round.isOpen ? -1 : 1))
	const userRef = await db
		.collection('Users')
		.doc(personId.toString())
		.collection('Results')
		.doc(competitionId)
		.get()
	const userResults = userRef.exists && userRef.data().results
	let qualifiedRounds = allRounds
	if (!showAdmin) {
		qualifiedRounds = qualifiedRounds.filter((round) => {
			if (round.id !== '333-r2') {
				return round.isOpen === true
			} else {
				const result = userResults
					? userResults.find((result) => result.roundId === '333-r1')?.average
					: null
				return (
					round.isOpen === true &&
					!isNaN(result) &&
					!isNaN(round.qualified) &&
					result <= round.qualified
				)
			}
		})
	}
	qualifiedRounds = qualifiedRounds.map((round) => round.id)
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
	const newAllRounds = qualifiedRounds.includes('333-r2')
		? allRounds
		: allRounds.map((round) =>
				round.id === '333-r2' ? { ...round, isOpen: false } : round
		  )
	if (!roundsInformation || !allRounds) {
		throw new Error('Error: Unable to find qualified rounds')
	}
	return {
		roundsInformation,
		allRounds: newAllRounds,
	}
}
