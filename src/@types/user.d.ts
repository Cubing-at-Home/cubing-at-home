interface User {
	data: UserData
	wca: UserWca
}

interface UserData {
	competitions: string[]
	seasons: string[]
}

interface UserWca {
	avatar: {
		isDefault: boolean
		thumb_url: boolean
		url: string
	}
	country_iso2: string
	email: string
	id: number
	isDelegate: boolean
	name: string
	personal_records: PersonalRecord
	wca_id?: string
}

// todo
type PersonalRecord = any
