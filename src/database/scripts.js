import { sortAttempts } from '../logic/attempts'
import { TIER_KEY, LEADERBOARD_POINTS } from '../logic/consts'
export async function updateUsers(firebase) {
	const db = firebase.firestore()
	const competitions = [
		{
			name: 'cah3',
			rounds: [
				'333-r1',
				'444-r1',
				'444bf-r1',
				'777-r1',
				'333oh-r1',
				'skewb-r1',
				'222-r1',
			],
		},
	]
	for (const competition of competitions) {
		const infoRef = await db.collection(competition.name).doc('info').get()
		const competitors = infoRef.data().competitors
		const competitorsDone = []
		for (const competitor of competitors) {
			const competitorTransaction = await firebase
				.firestore()
				.runTransaction(async (transaction) => {
					let compResults = { competitionId: competition.name, results: [] }
					for (const round of competition.rounds) {
						const roundCompetitorRef = db
							.collection('competitions')
							.doc(competition.name)
							.collection('Events')
							.doc(round.slice(0, round.indexOf('-')))
							.collection('Rounds')
							.doc(round)
							.collection('Results')
							.doc(competitor)
						const roundCompetitor = await transaction.get(roundCompetitorRef)
						if (roundCompetitor.exists) {
							const { name, personId, wcaId, ...other } = roundCompetitor.data()
							compResults.results.push({ ...other, roundId: round })
						}
					}
					const userRef = db
						.collection('Users')
						.doc(competitor)
						.collection('Results')
						.doc(competition.name)
					await transaction.set(userRef, compResults)
					return Promise.resolve(competitor)
				})
			console.log(
				`Updated Results for ${competitorTransaction} for ${competition.name}`
			)
			competitorsDone.push(competitor)
		}
		console.log(
			`Updated ${competitorsDone.length}/${competitors.length} competitors for ${competition.name}`
		)
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
			let results = userResultsRef.data().results
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
					: competitionId.slice(0, 2)
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
