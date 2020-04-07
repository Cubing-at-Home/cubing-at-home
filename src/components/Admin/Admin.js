import React from 'react'
import { Switch, Route } from 'react-router-dom'
import NewCompetition from './NewCompetition'
import CompetitionAdmin from './CompetitionAdmin'
import AdminHome from './AdminHome'

export default function Admin() {
	return (
		<>
			<Switch>
				<Route exact path='/admin/abcd' component={NewCompetition} />
				<Route exact path='/admin' component={AdminHome} />
				<Route exact path='/:id' component={CompetitionAdmin} />
			</Switch>
		</>
	)
}
