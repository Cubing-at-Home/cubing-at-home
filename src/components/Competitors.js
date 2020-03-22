import React from 'react'
import { FirebaseContext } from '../utils/firebase'
import CompetitorList from './CompetitorList'
import { WCA_ORIGIN } from '../logic/wca-env'
import { LinearProgress } from '@material-ui/core'

export default function Competitors({ history }) {
	const [competitors, setCompetitors] = React.useState(null)
	const [loading, setLoading] = React.useState(true)
	const firebase = React.useContext(FirebaseContext)
	React.useEffect(() => {
		async function getMarkers() {
			const markers = []
			await firebase
				.firestore()
				.collection('cah03282019')
				.get()
				.then(querySnapshot => {
					querySnapshot.docs.forEach(doc => {
						markers.push(doc.data())
					})
				})
			return markers
		}
		setLoading(true)
		getMarkers().then(competitiors => {
			setCompetitors(competitiors)
			setLoading(false)
		})
	}, [firebase])
	const open = url => {
		window.open(url, '_blank')
	}
	return (
		<>
			{!competitors || loading ? (
				<LinearProgress />
			) : (
				<CompetitorList
					competitors={competitors}
					onClick={(e, competitor) => open(competitor.url)}
				/>
			)}
		</>
	)
}
