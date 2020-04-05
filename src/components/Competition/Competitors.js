import React, { useState, useEffect, useContext } from 'react'
import CompetitorList from './CompetitorList'
import { LinearProgress, Typography } from '@material-ui/core'
import Paginator from '../Paginator'
import { WCA_ORIGIN } from '../../logic/wca-env'
import { FirebaseContext } from '../../utils/firebase'
import EventList from '../EventList'

export default function Competitors({ history, competitionInfo, registered }) {
	const [competitors, setCompetitors] = useState(null)
	// in order to avoid 100 reads every time someone switches an event, store the result if it's already been accessed
	const [preLoadedCompetitors, setPreLoadedCompetiors] = useState({})
	const [event, setEvent] = useState(competitionInfo.events[0])
	const handleEventChange = (newEvent) => {
		setEvent(newEvent)
	}
	const firebase = useContext(FirebaseContext)
	useEffect(() => {
		if (preLoadedCompetitors[event]) {
			setCompetitors(preLoadedCompetitors[event])
		} else {
			setCompetitors(null)

			const criteria = [
				'333bf',
				'333fm',
				'444bf',
				'555bf',
				'333mbf',
			].includes(event)
				? 'single'
				: 'average'
			firebase
				.firestore()
				.collection('Users')
				.where(
					'data.competitions',
					'array-contains',
					competitionInfo.id
				)
				.orderBy(`wca.personal_records.${event}.${criteria}.world_rank`)
				.limit(100)
				.get()
				.then((query) => {
					const competitors = []
					query.forEach((q) => competitors.push(q.data()))
					setCompetitors(competitors)
					setPreLoadedCompetiors({
						...preLoadedCompetitors,
						[event]: competitors,
					})
				})
		}
	}, [event])
	const open = (url) => {
		window.open(url, '_blank')
	}
	const [page, setPage] = React.useState(1)
	return (
		<>
			<EventList
				selected={[event]}
				events={competitionInfo.events}
				onClick={handleEventChange}
			/>
			{!competitors ? (
				<LinearProgress />
			) : (
				<>
					<CompetitorList
						competitors={competitors}
						registered={registered}
						total={competitors.length}
						page={page}
						onClick={(e, competitor) =>
							open(
								`${WCA_ORIGIN}/persons/${competitor.wca.wca_id}`
							)
						}
					/>
				</>
			)}
		</>
	)
}
