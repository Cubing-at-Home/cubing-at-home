import { Grid, Typography } from '@material-ui/core'
import React, { useContext } from 'react'
import useFirebase from '../hooks/useFirebase'
import { isSignedIn } from '../logic/auth'
import { UserContext } from '../utils/auth'

export default function Claim() {
	const user = useContext(UserContext) as User | null
	const firebase = useFirebase() as any
	const fetchCard = async () => {
		console.log(user)
		if (!user) return null
		const userDoc = await firebase
			.firestore()
			.collection('Users')
			.doc(user.wca.id.toString())
			.get()
		if (userDoc) {
			const user = userDoc.data()
			console.log(user)
			return user.data.s2GiftCard ?? null
		}
		return null
	}
	const [giftCard, setGiftCard] = React.useState<string | null>(null)
	React.useEffect(() => {
		fetchCard().then((resullt) => setGiftCard(resullt))
	}, [user, firebase])
	if (!isSignedIn || !giftCard) return null
	return (
		<Grid
			container
			direction='column'
			alignItems='center'
			justify='center'
			style={{ height: '100vh' }}>
			<Grid item>
				<Typography>{`Hi ${user?.wca.name} - Your Season2 Gift Card for https://thecubicle.com is:`}</Typography>
			</Grid>
			<Grid item>
				<Typography variant='h2'>{giftCard}</Typography>
			</Grid>
		</Grid>
	)
}
