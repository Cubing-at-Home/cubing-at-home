import React from 'react'
import Grid from '@material-ui/core/Grid'
import EventList from '../EventList'
//import ResultSubmission from './ResultSubmission'
import { UserContext } from '../../utils/auth'
import { signIn } from '../../logic/auth'

export default function Scrambles({ competitionInfo }) {
	const [event, setEvent] = React.useState(competitionInfo.events[0])
	//const handleSubmit = (attempts) => {}
	const user = React.useContext(UserContext)
	React.useEffect(() => {
		if (user === undefined) {
			signIn()
		}
	}, [user])
	return (
		<Grid container direction='column' justify='center'>
			<Grid item>
				<EventList
					selected={[event]}
					events={competitionInfo.events}
					onClick={(e) => setEvent(e)}
				/>
			</Grid>
			<Grid item>
				{/* <ResultSubmission
					user={user}
					event={event}
					onSubmit={handleSubmit}
				/> */}
			</Grid>
		</Grid>
	)
}
