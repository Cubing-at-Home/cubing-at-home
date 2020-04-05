import React from 'react'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
// import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info'
import ContactMailIcon from '@material-ui/icons/ContactMail'
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects'
import { makeStyles } from '@material-ui/core/styles'
import GitHubIcon from '@material-ui/icons/GitHub'
import { version } from '../../../package.json'
import { Tooltip } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
	root: {
		position: 'fixed',
		bottom: 0,
		width: '100%',
		overflow: 'hidden',
		padding: theme.spacing(2)
	},
	grow: {
		flexGrow: 1
	},
	link: {
		verticalAlign: 'middle',
		fontWeight: 500,
		'&:hover': {
			textDecoration: 'none',
			opacity: 0.7
		}
	},
	footerPadding: {
		width: '100%',
		height: 50
	}
}))

const Footer = ({ currTheme, onThemeChange }) => {
	const classes = useStyles()
	return (
		<>
			<div className={classes.footerPadding} />

			<Grid container className={classes.root}>
				<Grid item className={classes.grow} />
				<Grid item>
					<Grid container spacing={2}>
						<Grid item>
							<Link
								className={classes.link}
								variant='body2'
								href='/admin'
							>
								Admin
							</Link>
						</Grid>
						<Tooltip title={'Contact'}>
							<Grid item key='Contact'>
								<Link
									className={classes.link}
									variant='body2'
									href={
										'mailto:sgrover@worldcubeassociation.org,cnielson@worldcubassociation.org,bsampson@worldcubeassociation.org,sbaird@worldcubeassociation.org'
									}
								>
									<ContactMailIcon />
								</Link>
							</Grid>
						</Tooltip>
						<Tooltip
							title={
								currTheme === 'light'
									? 'Switch to Dark'
									: 'Switch to Light'
							}
						>
							<Grid item key='Theme'>
								<Link
									className={classes.link}
									variant='body2'
									onClick={onThemeChange}
								>
									<EmojiObjectsIcon />
								</Link>
							</Grid>
						</Tooltip>
						{/* <Tooltip title={'About'}>
							<Grid item key='Info'>
								<Link
									className={classes.link}
									variant='body2'
									href={'/about'}
								>
									<InfoIcon size={20} />
								</Link>
							</Grid>
						</Tooltip>
						<Grid item key='Version'>
							<Link
								className={classes.link}
								variant='body2'
								href={
									'https://github.com/saranshgrover/WCARealTime/releases'
								}
							>
								{version}
							</Link>
						</Grid> */}
					</Grid>
				</Grid>
			</Grid>
		</>
	)
}

export default Footer
