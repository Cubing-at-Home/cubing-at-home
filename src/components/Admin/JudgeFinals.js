import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React from 'react';
import useFirebase from '../../hooks/useFirebase';
import JudgeRoom from './JudgeRoom';


export default function JudgeFinals() {
    const firebase = useFirebase()
    const [rooms, setRooms] = React.useState([])
    const [currRoom, setCurrRoom] = React.useState()
    const [competitorOne, setCompetitorOne] = React.useState()
    const [competitorTwo, setCompetitorTwo] = React.useState()

    React.useEffect(() => {
        const unsub = firebase.firestore().collection('timer-rooms').onSnapshot(querySnapshot => {
            let fRooms = []
            querySnapshot.forEach(doc => {
                fRooms.push({...doc.data(), id: doc.id})
            })
            setRooms(fRooms)
        })
        return () => unsub()
    }, [setRooms, setCurrRoom])

    React.useEffect(() => {
        if (currRoom) {
            const unsub1 = firebase.firestore().collection('timer-rooms').doc(currRoom).collection('runners').doc('runner1').onSnapshot(doc => setCompetitorOne({ ...doc.data(), id: doc.id }))
            const unsub2 = firebase.firestore().collection('timer-rooms').doc(currRoom).collection('runners').doc('runner2').onSnapshot(doc => setCompetitorTwo({ ...doc.data(), id: doc.id }))

            return () => {
                unsub1()
                unsub2()
            }
        }
    }, [currRoom, setCompetitorOne, setCompetitorTwo])

    const handleChange = (event) => {
        setCurrRoom(event.target.value);
    };

    const resetStates = (newAttempts1, newAttempts2) => {
        firebase.firestore().collection('timer-rooms').doc(currRoom).collection('runners').doc('runner1').update({
            'ready': false,
            'timer-state': -1,
            'time-started': 0,
            'current-time': 0,
            'state': 'waiting',
            'timer-started': false,
            'attempts': newAttempts1
        });
        firebase.firestore().collection('timer-rooms').doc(currRoom).collection('runners').doc('runner2').update({
            'ready': false,
            'timer-state': -1,
            'time-started': 0,
            'current-time': 0,
            'state': 'waiting',
            'timer-started': false,
            'attempts': newAttempts2
        });
    }

    const handleReset = () => {
        if (competitorOne['timer-state'] > -1 || competitorTwo['timer-state'] > -1) { // Don't reset only if both competitors are on timer-state -1
            let newAttempts1 = competitorOne.attempts.map(attempt => attempt);
            let newAttempts2 = competitorTwo.attempts.map(attempt => attempt);

            if ((competitorOne['timer-state'] === 5 || competitorOne['timer-state'] === -1) && (competitorTwo['timer-state'] === 5 || competitorTwo['timer-state'] === -1)) {
                newAttempts1 = newAttempts1.slice(0,-1);
                newAttempts2 = newAttempts2.slice(0,-1);
            }

            resetStates(newAttempts1, newAttempts2);
            firebase.firestore().collection('timer-rooms').doc(currRoom).set({currScramble: '', matchScramblePresent: false}, {merge: true});
        }
    }

    return (
        <>
            {rooms ?
                <Grid
                    container
                    spacing={2}
                    direction="column"
                    justify="center"
                    alignItems="center"
                    alignContent="center"
                    wrap="nowrap"

                >
                    <Grid item alignContent="center" alignItems="center" direction="column" container>
                        <InputLabel id='roomSelectLabel'>Select Room</InputLabel><br/>
                        <Select style={{minWidth: '10vw'}} value={currRoom} onChange={handleChange} placeholder='No room selected' labelId='roomSelectLabel' id='roomSelect'>
                            {rooms.map(room => <MenuItem value={room.id} key={room.wcaId}>{room.name}</MenuItem>)}
                        </Select>
                    </Grid>
                    {currRoom
                      &&
                    <Grid item>
                      <Button onClick={handleReset} variant='contained' style={{marginBottom: '10px'}}>RESET CURRENT ATTEMPT</Button>
                    </Grid>}
                    <Grid item>
                        <JudgeRoom room={rooms.find(r => r.id === currRoom)} />
                    </Grid>
                </Grid>
                :
                <></>
            }
        </>
    )
}
