import { Grid, Link, Paper, Typography } from "@material-ui/core";
import MailIcon from '@material-ui/icons/Mail';
import { makeStyles } from '@material-ui/styles';
import Discord from 'mdi-material-ui/Discord';
import React from "react";
import { CONTACT_EMAILS } from "../logic/consts";

const useStyles = makeStyles((theme) => ({
	paper: {
        width: "100%",
        marginLeft:0,
        marginRight:0
	},
}))

export default function Contact () {
    const classes=useStyles();
    return (
        <>
        <Paper className={classes.paper}>
            <Grid container
                container
                alignContent="center"
                alignItems="center"
                direction='column'
                style={{textAlign:"center"}}
            >
                <Grid item style={{marginTop:"2.5vh"}}>
                    <Typography variant="h3">Contact Us</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h6">with any comments, questions, or concerns</Typography>
                </Grid>
                <Grid item>
                    <div>
                {CONTACT_EMAILS.map((email, index) => {
                    return (
                        <>
                        <div style={{marginTop:"2.5vh"}}>
                            <Grid item key={index}>
                                <Link href={`mailto:${email.href}`} target="_blank">
                                    <Typography variant="h6"><MailIcon style={{verticalAlign:"middle"}}></MailIcon> {email.href}
                                    </Typography>
                                </Link>
                            </Grid>
                            <Grid item><hr style={{width:"50%"}}></hr></Grid>
                            <Grid item>
                                <Typography variant="h7">{email.description}</Typography>
                            </Grid>
                        </div>
                        </>
                        )
                })}
                    <div style={{marginTop:"2.5vh",marginBottom:"2.5vh"}}>
                        <Grid item>
                            <Link href="https://discord.gg/BvFu3v8H" target="_blank">
                                <Typography variant="h6">
                                    <Discord style={{verticalAlign:"middle"}}></Discord> https://discord.gg/BvFu3v8H
                                </Typography>
                            </Link>
                        </Grid>
                        <Grid item>
                            <hr style={{width:"50%"}}></hr></Grid>
                        <Grid item>
                            <Typography variant="h7">For team-specific questions</Typography>
                        </Grid>
                    </div>
                </div>
                </Grid>
            </Grid>
        </Paper>
        </>
    )
}