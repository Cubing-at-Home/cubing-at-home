import { sortAttempts } from '../logic/attempts'
import { TIER_KEY, LEADERBOARD_POINTS } from '../logic/consts'
export async function updateUsers(firebase, competitions) {
	const db = firebase.firestore()
	for (const competition of competitions) {
		let compResults = { competitionId: competition.name, results: [] }
		const results = await firebase
			.firestore()
			.collection(competition.name)
			.get()
		results.forEach(async (doc) => {
			if (!doc.data().eventInfo && !doc.data().startDate) {
				compResults.results.push(doc.data())
			}
		})
		let i = 0
		for (const result of compResults.results) {
			if (result.id) {
				for (const round of competition.rounds) {
					if (result[round]) {
						const resultRef = db
							.collection('competitions')
							.doc(competition.name)
							.collection('Events')
							.doc(round.slice(0, round.indexOf('-')))
							.collection('Rounds')
							.doc(round)
							.collection('Results')
							.doc(result.id)
						await resultRef.set({
							...result[round],
							name: result.name || '',
							personId: result.id || '',
							ranking: -1,
							wcaId: result.wcaId || '',
						})
					}
				}
				const userResults = {
					competitionId: competition.name,
					results: [],
				}
				for (const key of Object.keys(result)) {
					if (competition.rounds.includes(key)) {
						userResults.results.push({ ...result[key], roundId: key })
					}
				}
				const userRef = db
					.collection('Users')
					.doc(result.id)
					.collection('Results')
					.doc(competition.name)
				await userRef.set(userResults)
				console.log(`Updated results for: ${result.name || ''} #${i}`)
				i += 1
			}
		}
		return Promise.resolve()
	}
}

export async function updateRankings(firebase, competitionId, roundId) {
	const db = firebase.firestore()
	const competitorRef = await db
		.collection('competitions')
		.doc(competitionId)
		.collection('Events')
		.doc(roundId.slice(0, roundId.indexOf('-')))
		.collection('Rounds')
		.doc(roundId)
		.collection('Results')
		.get()
	const roundRef = await db
		.collection('competitions')
		.doc(competitionId)
		.collection('Events')
		.doc(roundId.slice(0, roundId.indexOf('-')))
		.collection('Rounds')
		.doc(roundId)
		.get()
	const roundInfo = roundRef.data()
	const competitors = []
	competitorRef.forEach((doc) => competitors.push(doc.data()))
	competitors.sort((a, b) => sortAttempts(a, b, roundInfo.format))
	let rank = 1
	for (const competitor of competitors) {
		await db
			.collection('competitions')
			.doc(competitionId)
			.collection('Events')
			.doc(roundId.slice(0, roundId.indexOf('-')))
			.collection('Rounds')
			.doc(roundId)
			.collection('Results')
			.doc(competitor.personId.toString())
			.update({ ranking: rank })
		const userRef = db
			.collection('Users')
			.doc(competitor.personId.toString())
			.collection('Results')
			.doc(competitionId)
		const user = await userRef.get()
		const userComp = user.data()
		let newResults = []
		for (const result of userComp.results) {
			if (result.roundId === roundId)
				newResults.push({ ...result, ranking: rank })
			else newResults.push(result)
		}
		await userRef.update({ results: newResults })
		rank++
	}
}

export async function updateLeaderboard(firebase, competitionId, roundIds) {
	const db = firebase.firestore()
	const usersRef = await db
		.collection('Users')
		.where('data.competitions', 'array-contains', competitionId)
		// .where('wca.id', '==', 14216)
		.get()
	await usersRef.forEach(async (doc) => {
		const transaction = await db.runTransaction(async (transaction) => {
			const user = doc.data()
			let userResultsRef = db
				.collection('Users')
				.doc(user.wca.id.toString())
				.collection('Results')
				.doc(competitionId)
			userResultsRef = await transaction.get(userResultsRef)
			let results = userResultsRef.data() ? userResultsRef.data().results : []
			const points = {
				ranking: 0,
				podium: 0,
				win: 0,
				wr: 0,
				competing: 0,
				other: 0,
			}
			if (results.length > 0) {
				points.competing = LEADERBOARD_POINTS.PARTICIPATION
				results = results.filter((result) => roundIds.includes(result.roundId))
				for (const result of results) {
					const eventId = result.roundId.slice(0, result.roundId.indexOf('-'))
					const tier = TIER_KEY[eventId] || 3
					if (result.ranking === 1) {
						points.win = points.win + LEADERBOARD_POINTS.WIN[tier]
					} else if (result.ranking <= 3) {
						points.podium = points.podium + LEADERBOARD_POINTS.PODIUM[tier]
					} else if (result.ranking <= 8) {
						points.ranking = points.ranking + LEADERBOARD_POINTS.RANKING[tier]
					}
				}
				const total = sum(points)
				points.total = total
				const season = ['cah1', 'cah2', 'cah3', 'cah4', 'cah5'].includes(
					competitionId
				)
					? 's0'
					: 's1'
				const oldResultRef = db
					.collection('Leaderboards')
					.doc(season)
					.collection('Results')
					.doc(user.wca.id.toString())
				const oldResultResp = await transaction.get(oldResultRef)
				if (!oldResultResp.exists) {
					const result = {
						total: total,
						[competitionId]: points,
						name: user.wca.name,
						id: user.wca.id,
						wcaId: user.wca.wca_id,
					}
					await transaction.set(oldResultRef, result)
				} else {
					const oldResults = oldResultResp.data()
					const oldTotal = oldResults[competitionId]
						? oldResults[competitionId].total
						: 0
					oldResults.total = oldResults.total - oldTotal + total
					oldResults[competitionId] = points
					await transaction.set(oldResultRef, oldResults)
				}
			}
			return Promise.resolve('done')
		})
	})
	console.log('done')
}
function sum(obj) {
	var sum = 0
	for (var el in obj) {
		if (obj.hasOwnProperty(el)) {
			sum += parseFloat(obj[el])
		}
	}
	return sum
}
