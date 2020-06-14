import React from 'react'
import Carousel from 'react-material-ui-carousel'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery'

export default function LandingCarousel() {
	const items = [
		{
			title: 'C@H Season 1 Events',
			description: `The events and dates for Season 1! We'll be having all 17 WCA Events and 5 Non-WCA events!`,
			image: `${process.env.PUBLIC_URL}/images/cah1events.png`,
			buttonText: 'Register Now!',
			href: '/s1/register',
		},
		{
			title: 'Announcing C@H Season 1!',
			description: `Join top speedcubers acorss the world to compete in 21 events across 5 competitions! See all the action live at twitch.tv/cubingusa`,
			image: `${process.env.PUBLIC_URL}/images/season1.png`,
			buttonText: 'Register FOR FREE NOW!',
			href: '/s1/register',
		},
	]
	const classes = useStyles()
	return (
		<Carousel className={classes.root}>
			{items.map((item, index) => (
				<Item className={classes.root} key={index} item={item} />
			))}
		</Carousel>
	)
}

const useStyles = makeStyles({
	root: {
		maxWidth: '100vw',
		height: 'auto',
	},
	media: {
		height: '100vh',
		width: '80vw',
		display: 'block',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
})

function Item({ item }) {
	const { title, description, image, href, buttonText } = item
	const classes = useStyles()
	const history = useHistory()
	const theme = useTheme()
	const mdPlus = useMediaQuery(theme.breakpoints.up('md'))
	return (
		<Card className={classes.root}>
			<CardActionArea>
				<CardContent>
					<Typography gutterBottom variant='h5' component='h2'>
						{title}
					</Typography>
					<Typography variant='body2' color='textSecondary' component='p'>
						{description}
					</Typography>
					{buttonText && (
						<CardActions>
							<Button
								onClick={() => history.push(href)}
								color='primary'
								variant='outlined'
							>
								{buttonText}
							</Button>
						</CardActions>
					)}
				</CardContent>
				{mdPlus && (
					<CardMedia className={classes.media} image={image} title={title} />
				)}
			</CardActionArea>
		</Card>
	)
}
