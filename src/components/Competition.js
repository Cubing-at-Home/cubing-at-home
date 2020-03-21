import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { Button } from '@material-ui/core'
import Info from './Info'
import Schedule from './Schedule'
import Competitors from './Competitors'

function TabPanel(props) {
	const { children, value, index, ...other } = props

	return (
		<Typography
			component='div'
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</Typography>
	)
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`
	}
}

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper
	}
}))

export default function Competition({ history }) {
	const classes = useStyles()
	const [value, setValue] = React.useState(0)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	return (
		<div className={classes.root}>
			<AppBar color='inherit' position='static'>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label='simple tabs example'
				>
					<Tab label='Information' {...a11yProps(0)} />
					<Tab label='Schedule' {...a11yProps(1)} />
					<Tab label='Competitors' {...a11yProps(2)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				<Info history={history} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<Schedule />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<Competitors history={history} />
			</TabPanel>
		</div>
	)
}
