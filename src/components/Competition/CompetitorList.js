import React, { useState } from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(2),
		overflow: 'auto',
	},
	list: {
		height: '400',
		textAlign: 'center',
	},
}))

export default function CompetitorList({
	onClick,
	competitors,
	page,
	total,
	registered,
}) {
	const classes = useStyles()
	const [query, setQuery] = useState('')
	const [queryCompetitors, setQueryCompetitors] = useState(
		competitors.slice(100 * (page - 1), page * 100)
	)
	React.useEffect(() => {
		setQueryCompetitors(competitors.slice(100 * (page - 1), 100 * page))
	}, [page, competitors])
	const handleSearchChange = (event) => {
		const query = event.target.value
		setQuery(query)
		query === ''
			? setQueryCompetitors(competitors)
			: setQueryCompetitors(
					competitors.filter(
						(competitor) =>
							competitor.name
								.toLowerCase()
								.includes(query.toLowerCase()) ||
							(competitor.wcaId &&
								competitor.wcaId.includes(query.toUpperCase()))
					)
			  )
	}
	return (
		<Paper className={classes.paper}>
			<List
				className={classes.list}
				subheader={
					<ListSubheader>{`${total} Competitors`}</ListSubheader>
				}
			>
				{/* <ListItem className={classes.list}>
					<TextField
						value={query}
						onChange={handleSearchChange}
						fullWidth={true}
						label='Search'
						id='outlined-basic'
					></TextField>
				</ListItem> */}
				{queryCompetitors.map((competitor) => (
					<ListItem
						button
						onClick={(e) => onClick(e, competitor)}
						key={competitor.wca.id}
						style={{
							textAlign: 'center',
							backgroundColor:
								competitors[0].id === competitor.id &&
								registered
									? blue[200]
									: '',
						}}
					>
						<ListItemAvatar>
							<Avatar
								style={{
									width: 60,
									height: 60,
								}}
								alt={competitor.wca.name}
								src={competitor.wca.avatar.url}
							/>
						</ListItemAvatar>
						<ListItemText
							primary={competitor.wca.name}
							secondary={
								competitor.wca.wca_id
									? competitor.wca.wca_id
									: competitor.id
							}
						/>
					</ListItem>
				))}
			</List>
		</Paper>
	)
}
