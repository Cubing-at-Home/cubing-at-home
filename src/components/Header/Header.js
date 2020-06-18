import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { UserContext } from '../../utils/auth'
import { signIn, signOut } from '../../logic/auth'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
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
						justify='space-between'
						onClick={() => history.push('/')}
					>
						{/* <Grid item>
							<img
								width='100vw'
								height='100vh'
								alt='CubingUSA'
								src={
									process.env.PUBLIC_URL +
									'/cubingusa_logo.png'
								}
							/>
						</Grid> */}
						<Grid item>
							{' '}
							<img
								width='80vw'
								height='80vh'
								alt='C@H'
								src={process.env.PUBLIC_URL + '/logo.png'}
							/>
						</Grid>

						{/* <Grid item>
							<img
								width='100vw'
								height='100vh'
								alt='Cubicle'
								src={
									process.env.PUBLIC_URL + '/cubicle_logo.png'
								}
							/>
						</Grid> */}

						<Grid item>
							<Typography
									align='center'
									variant='h3'
								>
								Cubing at Home
							</Typography>
						</Grid>

						<Grid item>
							{/*
								Ignore this, this just lets the text be centered LOL
							*/}
						</Grid>
					</Grid>
					<Button
						onClick={
							user ? () => signOut().then((window.location.href = '/')) : signIn
						}
						variant='text'
						color='inherit'
					>
						{user ? user.wca.name : `Login with WCA`}
					</Button>
				</Toolbar>
			</AppBar>
		</div>
	)
}
