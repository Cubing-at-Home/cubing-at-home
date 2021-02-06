import { Link, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import React from "react";
import Faq from 'react-faq-component';
import { faq } from "../logic/consts";

const useStyles = makeStyles((theme)=>({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		padding: "2vh"
	}
}))

export default function FaqPage() {
	const theme = useTheme()
	const classes = useStyles();
    return (
		<div className={classes.root}>
						<Faq
									data={faq}
									styles={{
										bgColor: theme.palette.background.paper,
										titleTextColor: theme.palette.primary.main,
										rowTextColor: theme.palette.primary.main,
										rowTitleColor: theme.palette.text.primary,
										rowContentColor: theme.palette.text.primary,
									}}
								/>
								<Typography color='primary' align='center' variant='h6'>
									<Link
										color='inherit'
										rel='noopener noreferrer'
										href="/contact"
									>
										Contact Us
								</Link>
								</Typography>
								</div>
    )
}
