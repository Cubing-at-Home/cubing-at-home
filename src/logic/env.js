export const PRODUCTION = process.env.NODE_ENV === 'production'

export const WCA_ORIGIN = PRODUCTION
	? 'https://www.worldcubeassociation.org'
	: 'https://staging.worldcubeassociation.org'

	export const WCA_OAUTH_CLIENT_ID = PRODUCTION
	? '-WquS_SaD6-cWXO61NSMG9ejqLJNEbeh-qrkNxJwXKE'
	: 'example-application-id'
	
	export const CHALLONGE_ORIGIN = 'https://api.challonge.com/v1'
	export const CHALLONGE_API_KEY = 'vr6tEIAYjxWvPbyGAjWtMZozJDVvDJdErWnNKMbU'

export const API_ORIGIN = PRODUCTION ? 'https://us-central1-cubing-at-home.cloudfunctions.net/' : 'http://localhost:5001/cubing-at-home/us-central1/' 