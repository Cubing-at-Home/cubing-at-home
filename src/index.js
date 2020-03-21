import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import firebase from '@firebase/app'
import 'firebase/auth'
import '@firebase/firestore'
import firebaseConfig from './utils/firebaseConfig'
import * as serviceWorker from './serviceWorker'
import FirebaseProvider from './utils/firebase'
import { getMe } from './logic/wca-api'
import { isSignedIn } from './logic/auth'
import { initializeAuth } from './logic/auth'

firebase.initializeApp(firebaseConfig)
initializeAuth()
if (isSignedIn()) {
	getMe().then(user => {
		ReactDOM.render(
			<FirebaseProvider>
				<App userInfo={user} />
			</FirebaseProvider>,
			document.getElementById('root')
		)
	})
} else {
	ReactDOM.render(
		<FirebaseProvider>
			<App userInfo={{}} />
		</FirebaseProvider>,
		document.getElementById('root')
	)
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
