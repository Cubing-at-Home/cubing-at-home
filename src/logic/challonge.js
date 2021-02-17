import { CHALLONGE_API_KEY, CHALLONGE_ORIGIN } from './env'

export async function getTournament(id) {
  // get all matches for this tournament
	let tournament = await challongeApiFetch(`/tournaments/${id}/matches.json`)
  let participants = await challongeApiFetch(`/tournaments/${id}/participants.json`)

  // get participants list and get the emails
  let participantsMap = participants.reduce((m, v) => {
    if (!v.participant) return m

    v = v.participant
    let matches = v.display_name_with_invitation_email_address.match(/.*<(([^@]*)@.*)>/)
    let wcaId = null, email = null
    if (matches) {
      email = matches[1]
      wcaId = matches[2] // TODO: Support getting wcaId from misc details.
    }
    m[v.id] = {name: v.name, email: email, wcaId: wcaId}
    return m
  }, {})

  let matches = []
  tournament.forEach(v => {
    if (!v.match) return
    v = v.match
    let match = {
      state: v.state,
      round: v.round,
    }
    if (match.state === 'open' || match.state === 'complete' || (!!v.player1_id && !!v.player2_id)) {
      match.player1 = participantsMap[v.player1_id]
      match.player2 = participantsMap[v.player2_id]
    }
    matches.push(match)
  })

  return matches
}

// Supports challonge GET API endpoints
const challongeApiFetch = (path) => {
	const baseApiUrl = `${CHALLONGE_ORIGIN}`

	return fetch(`${baseApiUrl}${path}?api_key=${CHALLONGE_API_KEY}`)
		.then(response => {
			if (!response.ok) throw new Error(response.statusText)
			return response
		})
		.then(response => response.json())
}
