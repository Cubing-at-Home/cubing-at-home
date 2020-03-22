import React from 'react'
import CompetitorList from './CompetitorList'
import { LinearProgress, Typography } from '@material-ui/core'
import Link from '@material-ui/core/Link'

export default function Competitors({ history, competitors }) {
	const [wcaIds, setWcaIds] = React.useState(
		'https://jonatanklosko.github.io/rankings/#/rankings/show?name=Cubing+at+Home+I+Psych+Sheet&wcaids='
	)
	React.useEffect(() => {
		let ids = ''
		if (competitors !== null) {
			for (const competitor of competitors) {
				if (competitor.wcaId) {
					ids += competitor.wcaId + ','
				}
			}
			setWcaIds(wcaIds + ids)
		}
	}, [competitors])
	const open = url => {
		window.open(url, '_blank')
	}
	return (
		<>
			{!competitors ? (
				<LinearProgress />
			) : (
				<>
					<Typography
						variant='h4'
						align='center'
						style={{ marginBottom: '1vw' }}
					>
						<Link
							target='_blank'
							rel='noopener noreferrer'
							href={wcaIds}
						>
							Psych Sheet
						</Link>
					</Typography>
					<CompetitorList
						competitors={competitors}
						onClick={(e, competitor) => open(competitor.url)}
					/>
				</>
			)}
		</>
	)
}
