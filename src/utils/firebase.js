import React, { createContext } from 'react'
import app from 'firebase/app'
import firebaseConfig from './firebaseConfig'
const FirebaseContext = createContext(null)
export { FirebaseContext }
export default ({ children }) => {
	if (!app.apps.length) {
		app.initializeApp(firebaseConfig)
	}
	return (
		<FirebaseContext.Provider value={app}>
			{children}
		</FirebaseContext.Provider>
	)
}
