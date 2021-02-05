import React, { createContext } from 'react'
import { createNewUser, updateEmail } from '../database/writes'
import { isSignedIn } from '../logic/auth'
import { getMe } from '../logic/wca-api'
import { FirebaseContext } from './firebase'
const UserContext = createContext(null)
export { UserContext }
export default ({ children }) => {
	const [user, setUser] = React.useState(null)
	const fireabse = React.useContext(FirebaseContext)
	React.useEffect(() => {
		if (isSignedIn()) {
			getMe().then((user) => {
				fireabse
					.firestore()
					.collection('Users')
					.doc(user.me.id.toString())
					.get()
					.then((docSnapshot) => {
						if (docSnapshot.exists) {
							//added checking if email has changed
							if (user.me.email !== docSnapshot.data().wca.email) {
								updateEmail(fireabse, user.me)
									.then((updatedUser) => {
										setUser(updatedUser);
									})
									.then(_ => {
										alert("Your email has been updated to reflect changes to your WCA account!")
									})
							} else {
								setUser(docSnapshot.data())
							}
						} else {
							createNewUser(fireabse, user.me).then((newUser) => {
								setUser(newUser)
							})
						}
					})
			})
		} else {
			setUser(undefined)
		}
	}, [fireabse])
	return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
