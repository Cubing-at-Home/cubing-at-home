import React from 'react'
import { FirebaseContext } from '../utils/firebase'
import { LinearProgress, Typography } from '@material-ui/core'

export default function Scrambles() {
	const firebase = React.useContext(FirebaseContext)
	const [form, setForm] = React.useState(null)
	React.useEffect(() => {
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
			})
	}, [])
	return (
		<>
			{form === null ? (
				<LinearProgress />
			) : form === false ? (
				<Typography variant='h4' align='center'>
					Scrambles will be available when the competition begins
				</Typography>
			) : (
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
			)}
		</>
	)
}
