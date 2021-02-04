export const defaultCompetition = {
	competitorCount: -1,
	end: '',
	start: '',
	id: '',
	name: '',
	registrationStart: '',
	registrationEnd: '',
	shortName: '',
	persons: [],
	schedule: [],
	eventList: [],
	rounds: [],
	admins: [],
	settings: {},
	results: []
}

export const buildCompetition = async (firebase, competition) => {
	const {
		id,
		name,
		shortName,
		start,
		end,
		registrationStart,
		registrationEnd,
		persons,
		eventList,
		events,
		schedule,
		settings,
		competitorCount,
		rounds,
	} = competition
	try {
		await firebase.firestore().collection('competitions').doc(id).set({
			id,
			name,
			shortName,
			start,
			end,
			schedule,
			settings,
			competitorCount,
			eventList,
			registrationStart,
			registrationEnd,
			rounds: rounds,
		})
		for (const person of persons) {
			await firebase
				.firestore()
				.collection('competitions')
				.doc(id)
				.collection('Persons')
				.doc(person.wcaUserId)
				.set(person)
		}
		for (const event of events) {
			const { rounds, ...other } = event
			await firebase
				.firestore()
				.collection('competitions')
				.doc(id)
				.collection('Events')
				.doc(event.id)
				.set(other)
			for (const round of rounds) {
				const { results, ...other } = round
				console.log(results)
				await firebase
					.firestore()
					.collection('competitions')
					.doc(id)
					.collection('Events')
					.doc(event.id)
					.collection('Rounds')
					.doc(round.id)
					.set(other)
				for (const result of results) {
					await firebase
						.firestore()
						.collection('competitions')
						.doc(id)
						.collection('Events')
						.doc(event.id)
						.collection('Rounds')
						.doc(round.id)
						.collection('Results')
						.doc(result.personId.toString())
						.set(result)
				}
			}
		}
	} catch (error) {
		console.log(error)
	}
}