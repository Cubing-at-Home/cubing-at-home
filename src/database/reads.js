/**
 *
 * @param {} firebase Firebase component from FirebaseContext
 * @param {*} competitionId id of the competition
 * @param {*} eventId id of the event
 * @param {*} start Starting value for results (for pagination)
 * @param {*} limit How many results to return (for pagination)
 */
export const getEventResult = async (
	firebase,
	competitionId,
	eventId,
	start,
	limit
) => {
	const resultType = ['333bf', '444bf', '555bf', '333fm', '333mbf'].includes(
		eventId.slice(0, eventId.indexOf('-'))
	)
		? 'best'
		: 'average'
	return new Promise((resolve, reject) => {
		firebase
			.firestore()
			.collection(competitionId)
			.orderBy(`${eventId}.${resultType}`)
			.startAt(start)
			.limit(limit)
			.get()
			.then((resp) => {
				const competitors = []
				resp.forEach((doc) => competitors.push(doc.data()))
				resolve(competitors)
			})
			.catch((error) => reject(error))
	})
}

export const get = async (firebase, competitionId) => {
	return new Promise((resolve, reject) => {
		firebase
			.firestore()
			.collection(competitionId)
			.orderBy('id')
			.get()
			.then((resp) => {
				const competitors = []
				resp.forEach((doc) => competitors.push(doc.data()))
				resolve(competitors)
			})
			.catch((error) => reject(error))
	})
}
