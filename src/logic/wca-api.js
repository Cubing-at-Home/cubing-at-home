import { WCA_ORIGIN } from './wca-env'
import { wcaAccessToken } from './auth'
import { pick } from './tools'

export const getMe = () => wcaApiFetch(`/me`)

const wcaApiFetch = (path, fetchOptions = {}) => {
	const baseApiUrl = `${WCA_ORIGIN}/api/v0`

	return fetch(
		`${baseApiUrl}${path}`,
		Object.assign({}, fetchOptions, {
			headers: new Headers({
				Authorization: `Bearer ${wcaAccessToken()}`,
				'Content-Type': 'application/json'
			})
		})
	)
		.then(response => {
			if (!response.ok) throw new Error(response.statusText)
			return response
		})
		.then(response => response.json())
}

const updateWcif = (competitionId, wcif) =>
	wcaApiFetch(`/competitions/${competitionId}/wcif`, {
		method: 'PATCH',
		body: JSON.stringify(wcif)
	})

export const saveWcifChanges = (previousWcif, newWcif) => {
	const keysDiff = Object.keys(newWcif).filter(
		key => previousWcif[key] !== newWcif[key]
	)
	if (keysDiff.length === 0) return Promise.resolve()
	return updateWcif(newWcif.id, pick(newWcif, keysDiff))
}
