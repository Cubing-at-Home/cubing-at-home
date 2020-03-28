import { Route, Redirect, Switch } from 'react-router-dom'
import React from 'react'
import { featured } from '../logic/consts'

export default function Featured() {
	return (
		<Switch>
			{featured.map(competitor => (
				<Route
					key={competitor.link}
					exact
					path={`/${competitor.link}`}
					component={() => (window.location = competitor.social)}
				/>
			))}
			<Redirect to='/' />
		</Switch>
	)
}
