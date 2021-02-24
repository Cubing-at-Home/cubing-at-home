const firebaseConfig =
	process.env.NODE_ENV === 'production'
		? {
			apiKey: process.env.FIREBASE_API,
			authDomain: 'cubing-at-home.firebaseapp.com',
			databaseURL: 'https://cubing-at-home.firebaseio.com',
			projectId: 'cubing-at-home',
			storageBucket: 'cubing-at-home.appspot.com',
			messagingSenderId: '1053566413406',
			appId: '1:1053566413406:web:37f9f758627821f2c1a2cf',
			measurementId: 'G-TYM6KGHTDD',
		}
		: {
			apiKey: 'AIzaSyDKn85Ghdn1e4FVci8m_rCZnYoJlAB9FwE',
			authDomain: 'cubing-at-home-testing.firebaseapp.com',
			databaseURL: 'https://cubing-at-home-testing.firebaseio.com',
			projectId: 'cubing-at-home-testing',
			storageBucket: 'cubing-at-home-testing.appspot.com',
			messagingSenderId: '492826745442',
			appId: '1:492826745442:web:99b283ff12494d5debcf3b',
			measurementId: 'G-V3MKMCTVG8',
		}

export default firebaseConfig
