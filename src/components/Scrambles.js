import React from 'react'
import { FirebaseContext } from '../utils/firebase'
import { LinearProgress, Typography } from '@material-ui/core'
import { isSignedIn, signIn } from '../logic/auth'
import { getMe } from '../logic/wca-api'
import { competitors } from '../database/competitors'

export default function Scrambles() {
	const firebase = React.useContext(FirebaseContext)
	const [competitor, setCompetitor] = React.useState(null)
	const [form, setForm] = React.useState(null)
	React.useEffect(() => {
		if (!isSignedIn()) {
			signIn()
		}
		const firestore = firebase.firestore()
		firestore
			.collection('CubingAtHomeI')
			.doc('Forms')
			.get()
			.then(doc => {
				const forms = doc.data().forms
				if (!forms) {
					setForm(false)
				} else {
					const currForm = forms.find(form => form.current === true)
					currForm ? setForm(currForm) : setForm(false)
				}
				getMe().then(user => {
					const competitor = competitors.find(
						competitor => competitor.id === user.me.id
					)
					if (competitor === undefined || competitor === null) {
						setCompetitor(false)
					} else {
						setCompetitor(competitor)
					}
				})
			})
	}, [])
	return (
		<>
			{form === null || competitor === null ? (
				<LinearProgress />
			) : form === false ? (
				<Typography variant='h4' align='center'>
					Scrambles will be available when the competition begins
				</Typography>
			) : competitor === false ? (
				<Typography variant='h4' align='center'>
					You are not signed up for this competition or eligible for
					this round
				</Typography>
			) : (
				<>
					<Typography
						variant='h6'
						align='center'
					>{`Logged in as ${competitor.name}: Please enter your results below.`}</Typography>
					<iframe
						title='form'
						src={form.form}
						width='100%'
						height='809'
						frameBorder='0'
						marginHeight='0'
						marginWidth='0'
					>
						Loading…
					</iframe>
				</>
			)}
		</>
	)
}
