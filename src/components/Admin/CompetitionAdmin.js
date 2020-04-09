import React from 'react'
import SelectEvent from './SelectEvent'

export default function CompetitionAdmin({ match }) {
	return (
		<>
			<SelectEvent competitionId={match.params.competitionId} />
		</>
	)
}
