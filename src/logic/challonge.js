
import { API_ORIGIN } from './env'

export async function getTournament(id) {
  const CHALLONGE_API_KEY = process.env.REACT_APP_CHALLONGE_API_KEY
  const CHALLONGE_ORIGIN = process.env.REACT_APP_CHALLONGE_ORIGIN
  // get all matches for this tournament
  let tournament = await challongeApiFetch(`/tournaments/${id}/matches.json`)
  let participants = await challongeApiFetch(`/tournaments/${id}/participants.json`)

  // get participants list and get the emails
  let participantsMap = participants.reduce((m, v) => {
    if (!v.participant) return m

    v = v.participant
    m[v.id] = { name: v.name, wcaId: v.misc }
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

export async function createTournament(opts) {
  try {
    const tournament = await apiPost('createTournament', opts)
    return tournament
  }
  catch (err) {
    console.log(err)
    throw err
  }
}

export async function addParticpant(opts) {
  try {
    const participant = await apiPost('addParticipant', opts)
    return participant
  }
  catch (err) {
    console.log(err)
    throw err
  }
}

// Supports challonge GET API endpoints
const challongeApiFetch = (path) => {
  const CHALLONGE_API_KEY = process.env.REACT_APP_CHALLONGE_API_KEY
  const CHALLONGE_ORIGIN = process.env.REACT_APP_CHALLONGE_API_ORIGIN
  const baseApiUrl = `${CHALLONGE_ORIGIN}`

  return fetch(`${baseApiUrl}${path}?api_key=${CHALLONGE_API_KEY}`)
    .then(response => {
      if (!response.ok) throw new Error(response.statusText)
      return response
    })
    .then(response => response.json())
}

const apiPost = (path, data = {}, opts = {}) => {
  return fetch(`${API_ORIGIN}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...data }), // body data type must match "Content-Type" header,
    ...opts
  }).then(response => {
    console.log(response)
    return response
  })
    .then(response => response.json())
}
