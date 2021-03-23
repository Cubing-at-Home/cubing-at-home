import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import React from 'react'
import Carousel from 'react-material-ui-carousel'
import { useHistory } from 'react-router-dom'

export default function LandingCarousel() {
	const items = [
		{
			title: 'C@H Has MERCH!',
			description: 'Purchase this amazing Cubing at Home merchandise - 10% of all sales will go towards the prize pool!',
			image:`${process.env.PUBLIC_URL}/images/merch.jpeg`,
			buttonText: 'Purchase Here!',
			href: 'https://www.thecubicle.com/collections/new-arrivals/products/cubing-at-home-t-shirt'
		},
		{
			title: 'C@H Season 2',
			description: `Cubing at Home 2.2 is on March 27th`,
			image: `${process.env.PUBLIC_URL}/images/cah22.png`,
			buttonText: 'Register NOW!',
			href: '/s2/register',
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
								href={href}
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
