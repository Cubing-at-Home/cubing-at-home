import React, { createContext } from 'react'
import app from 'firebase/app'
import '@firebase/storage'
import firebaseConfig from './firebaseConfig'
const FirebaseContext = createContext<null | typeof app>(null)
export { FirebaseContext }
export default ({ children }: React.PropsWithChildren<{}>) => {
	if (!app.apps.length) {
		app.initializeApp(firebaseConfig)
	}
	return (
		<FirebaseContext.Provider value={app}>{children}</FirebaseContext.Provider>
	)
}
