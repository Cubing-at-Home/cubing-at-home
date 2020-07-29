import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import React, { useContext } from 'react'
import { submitTime } from '../../../database/writes'
import { CONTACT_EMAILS } from '../../../logic/consts'
import { FirebaseContext } from '../../../utils/firebase'


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
							that you submit accurate times so please double check each solve
							before submitting.
						</li>
						{round.event !== '333fm' ?
							<>
								<li>
									After you complete each solve, enter in the exact time in the
									corresponding fields. If you have a penalty, add the penalty and
									enter the final time. If you got a DNF, type D. If you would like
									to enter a DNS, type S. For Multiple Blindfolded, the format is:
									Completed, Attempted, Time.
						</li>
								<li>
									If you plan to record, please <b>Start Recording BEFORE you click Begin Attempt</b>
								</li>
							</>
							:
							<>
								<li>
									<Typography>For 3x3 FMC, You will have 1 hour and 5 minutes for each attempt. FMC will be open for a total of 4 hours, so you may take breaks in between events - but please plan accordingly. We will be requiring both a move count as well as an <a href='https://alg.cubing.net'>alg.cubing.net</a> link. </Typography>
								</li>
								<li>
									Note: For Fewest Moves, we will not be asking for video. Instead, please make sure to explain your solution in the https://alg.cubing.net link you provide. The extra 5 minutes per solve is for that. You may also submit a video breakdown of your solves within 4 hours of submitting your time if you feel like you don't want to explain your solution in alg.cubing.net, though we highly recommend you do that. In addition, if we suspect any issues, we will reach out to you for clarifications.
						</li>
							</>}
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
								href={CONTACT_EMAILS}
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
