import React, { useContext } from 'react'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { FirebaseContext } from '../../../utils/firebase'
import { submitTime } from '../../../database/writes'

export default function EventStart({ user, competitionId, round }) {
	const firebase = useContext(FirebaseContext)
	const handleClick = async () => {
		await submitTime(firebase, competitionId, round.id, {
			personId: user.wca.id.toString(),
			started: true,
			attempts: [],
			name: user.wca.name,
			wcaId: user.wca.wca_id || '',
		})
	}

	return (
		<Grid container direction='column' justify='center' alignItems='center'>
			<Grid item xs={6} container style={{ display: 'flex' }}>
				<Typography component='div'>
					Result Submission Process
					<ul>
						<li>
							Once you click Begin Attempt, you will start submitting each
							attempt one by one. Please make sure to stay on the website and
							not refresh during you entire attempt.
						</li>
						<li>
							You will only be permitted to submit once per event. It is crucial
							that you submit accurate times so please double check each sovle
							before submitting.
						</li>
						<li>
							After you complete each solve, enter in the exact time in the
							corresponding fields. If you have a penalty, add the penalty and
							enter the final time. If you got a DNF, type D. If you would like
							to enter a DNS, type S. For Multiple Blindfolded, the format is:
							Completed, Attempted, Time.
						</li>
						<li>
							<Typography color='error'>
								Please note: If we detect any form of cheating, it will result
								in disqualification from all future Cubing at Home competitions.{' '}
							</Typography>
						</li>
						<li>
							If you have any issues/questions, check the{' '}
							<Link href={`/${competitionId}/faq`}>faq</Link>,{' or '}
							<Link
								target='_blank'
								rel='noreferrer'
								href='mailto:sgrover@worldcubeassociation.org,cnielson@worldcubeassociation.org,bsampson@worldcubeassociation.org,sbaird@worldcubeassociation.org'
							>
								{' '}
								contact us
							</Link>
						</li>
					</ul>
				</Typography>
			</Grid>
			<Grid item>
				<Button variant='contained' color='default' onClick={handleClick}>
					Begin Attempt
				</Button>
			</Grid>
		</Grid>
	)
}
