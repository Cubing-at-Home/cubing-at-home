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
			title: 'Cubing at Home V',
			description:
				'Tune in 12 PM ET at twitch.tv/cubingusa this weekend to see who gets crowned our season champion!',
			image: `${process.env.PUBLIC_URL}/images/CH5.jpg`,
			buttonText: 'Learn More',
			href: '/cah5',
		},
		{
			title: 'Cubing at Home Bracket Contest!',
			description:
				"Cubicle is sponsoring a $1000 prize bracket tournament for Cubing at Home V. All competitors will have the chance to predict the bracket for 3x3 Finals - and if anyone gets 5 exactly correct, they will win $1000. We'll be posting the contest form once registration closes",
			image: `${process.env.PUBLIC_URL}/images/bracket.png`,
			buttonText: 'Enter Now!',
			href: 'https://forms.gle/xNHqrD5HTmqxQ2hp6'
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
		height: '80vh',
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
