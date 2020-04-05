import React, { createContext } from 'react'
import { isSignedIn, signOut } from '../logic/auth'
import { getMe } from '../logic/wca-api'
import { FirebaseContext } from './firebase'
import { createNewUser } from '../database/writes'
const UserContext = createContext(null)
export { UserContext }
export default ({ children }) => {
	const [user, setUser] = React.useState(null)
	const fireabse = React.useContext(FirebaseContext)
	React.useEffect(() => {
		if (isSignedIn()) {
			getMe().then(user => {
				fireabse
					.firestore()
					.collection('Users')
					.doc(user.me.id.toString())
					.get()
					.then(docSnapshot => {
						if (docSnapshot.exists) {
							setUser(docSnapshot.data())
						} else {
							createNewUser(fireabse, user.me).then(newUser => {
								setUser(newUser)
							})
						}
					})
			})
		} else {
			setUser(undefined)
		}
	}, [])
	return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
