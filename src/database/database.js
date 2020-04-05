export const Avatar = {
	is_default: Boolean,
	thumb_url: String,
	url: String
}

export const User = {
	wca: {
		avatar: Avatar,
		country_iso2: String,
		email: String,
		gender: String,
		id: Number,
		last_updated: Date,
		name: String
	},
	data: {
		competitions: [String],
		results: [String]
	}
}

export const Result = {
	id: String,
	name: String,
	results: [Number]
}

export const Competition = {
	id: String,
	name: String,
	start: Date,
	end: Date,
	registrationStart: Date,
	registrationEnd: Date,
	events: [String],
	schedule: [{ start: Date, event: String }],
	admins: [String],
	competitiors: [Number]
}

export const Competitors = {
	id: Number,
	name: String,
	wcaId: String,
	results: [Result]
}
