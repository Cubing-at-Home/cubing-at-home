import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { UserContext } from '../../utils/auth'
import { signIn, signOut } from '../../logic/auth'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	title: {
		flexGrow: 1
	}
}))

export default function Header({ history }) {
	const user = useContext(UserContext)
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<AppBar position='static'>
				<Toolbar>
					<Grid
						container
						direction='row'
						alignItems='center'
						justify='space-evenly'
						style={{ cursor: 'pointer' }}
						onClick={() => history.push('/')}
					>
						<Grid item>
							<img
								width='100vw'
								height='100vh'
								alt='CubingUSA'
								src={
									process.env.PUBLIC_URL +
									'/cubingusa_logo.png'
								}
							/>
						</Grid>
						<Grid item>
							<Typography
								style={{ cursor: 'pointer' }}
								align='center'
								variant='h2'
							>
								Cubing at Home
							</Typography>
							<Typography
								align='center'
								gutterBottom
								variant='h6'
							>
								Online Cubing Competitions for Quarantiners
							</Typography>
						</Grid>
						<Grid item>
							<img
								width='100vw'
								height='100vh'
								alt='Cubicle'
								src={
									process.env.PUBLIC_URL + '/cubicle_logo.png'
								}
							/>
						</Grid>
					</Grid>
					<Button
						onClick={
							user
								? () =>
										signOut().then(
											(window.location.href = '/')
										)
								: signIn
						}
						variant='text'
						size='large'
						color='inherit'
					>
						{user ? user.wca.name : `Login with WCA`}
					</Button>
				</Toolbar>
			</AppBar>
		</div>
	)
}
