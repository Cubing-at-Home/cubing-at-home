import { FormControlLabel, useTheme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import DoneAllIcon from '@material-ui/icons/DoneAll'
import React, { useContext, useState } from 'react'
import { submitTime } from '../../../database/writes'
import { parseActivityCode } from '../../../logic/attempts'
import { activityKey } from '../../../logic/consts'
import { FirebaseContext } from '../../../utils/firebase'
import Snackbar from '../../Snackbar'

export default function EventSubmitted({ userAttempt, competitionId, round }) {
	const { eventId, roundNumber } = parseActivityCode(round.id)
	const theme = useTheme()
	const [localVideoURL, setLocalVideoURL] = useState(userAttempt.videoURL || '')
	const [snackbar, setSnackbar] = useState(null)
	const [privateVideo, setPrivateVideo] = useState(false)
	const firebase = useContext(FirebaseContext)

	const handleUpdate = async () => {
		await submitTime(firebase, competitionId, round.id, {
			...userAttempt,
			videoURL: localVideoURL,
			hasPrivateVideo: privateVideo
		})
		setSnackbar(null)
		setSnackbar('Succesfully updated Video URL')
	}

	return (
		<React.Fragment>
			{snackbar && <Snackbar message={snackbar} />}
			<Grid
				container
				direction='column'
				justify='center'
				alignItems='center'
				spacing={2}
			>
				<Grid item>
					<DoneAllIcon
						fontSize='large'
						style={{ color: theme.palette.success.main }}
					/>
				</Grid>
				<Grid item>
					<Typography
						variant='h4'
						align='center'
					>{`Your times for ${activityKey[eventId]} Round ${roundNumber} have been successfully submitted. `}</Typography>
				</Grid>
				<Grid item>
					<Typography
						variant='subtitle1'
						align='center'
					>{`Note: In order for you to qualify for further rounds, or gain points from this round, you must submit a video of your solves. If you anticipate ranking in the Top 16 for this round, we recommend that you submit a video. Failure to submit a video will result in disqualification of any points/podiums you may have earned from this position. You do not need to submit a video if you don't anticipate earning points from this round. You can choose to make your video private to the public on submission.`}</Typography>
				</Grid>
				<Grid item>
					<Grid spacing={2} container style={{ marginTop: '5px' }}>
						<Grid item style={{ width: (localVideoURL==='' ? "70%" : "60%") }}>
							<TextField
								value={localVideoURL}
								onChange={(e) => setLocalVideoURL(e.target.value)}
								variant='outlined'
								label='Video URL'
								helperText='Please make sure that the video is accessible via the link. You may use YouTube to upload an unlisted video, or share a link using Google/Apple Photos'
							/>
						</Grid>
						<Grid item style={{ width: '15%', display: (localVideoURL==='' ? 'none' : 'block'), textAlign: "center"}}>
							<FormControlLabel
								control = {
									<Checkbox
										defaultChecked
										disabled={localVideoURL===''}
										onChange={({ target: { checked } }) => setPrivateVideo(!checked)}
									/>
								}
								labelPlacement="bottom"
								label="Show Video on Results Page"
							/>
						</Grid>
						<Grid item style={{ width: (localVideoURL==='' ? "30%" : "25%") }}>
							<Button
								size='small'
								variant='contained'
								color='primary'
								onClick={handleUpdate}
							>
								Update URL
							</Button>
						</Grid>
					</Grid>
				</Grid>
				<Grid item></Grid>
			</Grid>
		</React.Fragment>
	)
}
