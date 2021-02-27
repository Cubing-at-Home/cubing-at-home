import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { Scrambow } from 'scrambow'
import useFirebase from '../../hooks/useFirebase'
import AttemptField from '../Competition/AttemptField/AttemptField'
import DrawScramble from '../Competition/Compete/DrawScramble'



const useStyles = makeStyles({
    paper: {
        width: '80vw'
    },
    info: {
        maxWidth: '40vw'
    }
})


export default function JudgeRoom({ room, completeRoom }) {
    const [competitorOne, setCompetitorOne] = React.useState()
    const [competitorTwo, setCompetitorTwo] = React.useState()
    const firebase = useFirebase()
    const changeScramble = (scramble, matchScramblePresent) => {
        firebase.firestore().collection('timer-rooms').doc(room.id).set({ currScramble: scramble, matchScramblePresent }, { merge: true })
    }

    const setCompetitor = (doc, newCompetitor) => {
        firebase.firestore().collection('timer-rooms').doc(room.id).collection('runners').doc(doc).set(newCompetitor, { merge: true })
    }

    React.useEffect(() => {
        if (room) {
            const unsub1 = firebase.firestore().collection('timer-rooms').doc(room.id).collection('runners').doc('runner1').onSnapshot(doc => setCompetitorOne({ ...doc.data(), id: doc.id }))
            const unsub2 = firebase.firestore().collection('timer-rooms').doc(room.id).collection('runners').doc('runner2').onSnapshot(doc => setCompetitorTwo({ ...doc.data(), id: doc.id }))

            return () => {
                unsub1()
                unsub2()
            }
        }
    }, [room])

    if (!competitorOne || !competitorTwo || !room) return <LinearProgress />
    return (
        <Grid container spacing={3} justifyContent='center' alignItems='center' direction='column'>
            {(competitorOne.wins >= room.neededToWin && competitorTwo['timer-state'] === -1) || (competitorTwo.wins >= room.neededToWin && competitorOne['timer-state'] === -1) ?
                <Grid item>
                    <Typography variant='h1'>Match Complete</Typography>
                    <Typography variant='h2'>{`${competitorOne.name} : ${competitorOne.wins}`} </Typography>
                    <Typography variant='h2'>{`${competitorTwo.name} : ${competitorTwo.wins}`}</Typography>
                    <Button variant='contained' onClick={completeRoom}>Confirm and Submit</Button>
                </Grid>
                :
                <>
                    <Grid item>
                        <JudgeCompetitor competitor={competitorOne} setCompetitor={(val) => setCompetitor('runner1', val)} room={room} changeScramble={changeScramble} />
                    </Grid>
                    <Grid item>
                        <Divider />
                    </Grid>
                    <Grid item>
                        <JudgeCompetitor competitor={competitorTwo} setCompetitor={(val) => setCompetitor('runner2', val)} room={room} changeScramble={changeScramble} />
                    </Grid>
                </>
            }
        </Grid>
    )
}


export function JudgeCompetitor({ competitor, setCompetitor, room, changeScramble }) {
    const classes = useStyles()
    const timerState = competitor['timer-state']
    const [attemptTime, setAttemptTime] = React.useState(Math.floor(competitor['current-time'] / 10))
    const [win, setWin] = React.useState()
    React.useEffect(() => {
        setAttemptTime(Math.floor(competitor['current-time'] / 10))
        if (competitor.attempts.length > 0) {
            setWin(competitor.attempts[competitor.attempts.length - 1].win)
        }
    }, [competitor])
    const firebase = useFirebase()
    const handleSubmitAttempt = () => {
        let newAttempts = competitor.attempts.map((a, i) => i === competitor.attempts.length - 1 ? { scramble: room.currScramble, time: attemptTime, win: win } : a)
        let newWinNumber = win ? competitor.wins + 1 : competitor.wins
        setCompetitor({
            'timer-started': false,
            'current-time': 0,
            'timer-state': -1,
            attempts: newAttempts,
            wins: newWinNumber
        })
        changeScramble(room.currScramble, false)
    }


    const setReady = async () => {
        if (!room.matchScramblePresent) {
            const gen = new Scrambow()
            const scramble = gen.setType(room.event).get()[0].scramble_string
            await changeScramble(scramble, true)
        }
        setCompetitor({ 'ready': true, 'timer-state': 0, state: 'ready' })
    }

    return (
        <Paper className={classes.paper} style={{ padding: '10px' }}>
            <Typography variant='h3'>{competitor.name}: {competitor.state}</Typography>
            <Grid spacing={2}>
                <Grid item className={classes.info}>
                    <Typography variant='subtitle1'>{`Timer State: ${competitor['timer-state']}`}</Typography>
                </Grid>
                <br />
                <Grid item style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {timerState === -1 && <Button variant='contained' onClick={setReady}>{`Ready Up`}</Button>}
                    {timerState === 1 &&
                        <Grid container direction='column'>
                            <Grid item>
                                <Typography variant='body'>Verify Scramble</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant='body'>{room.currScramble}</Typography>
                            </Grid>
                            <Grid item>
                                <DrawScramble scramble={room.currScramble} eventId={room.event} />
                            </Grid>
                            <Button variant='contained' onClick={() => setCompetitor({ 'ready': true, 'timer-state': 2, 'state': 'ready' })}>Verify Scramble</Button>
                        </Grid>
                    }
                    {timerState === 5 &&
                        <>
                            <AttemptField helperText='Final Time' eventId='333' initialValue={attemptTime} onValue={val => setAttemptTime(val)} />
                            <FormControlLabel
                                control={<Checkbox checked={win} onChange={(e => setWin(e.target.checked))} name="win" />}
                                label="Win"
                            />
                            <Button onClick={handleSubmitAttempt} variant='contained'>{`Confirm & Submit Attempt`}</Button>
                        </>
                    }
                </Grid>
            </Grid>
        </Paper>
    )
}