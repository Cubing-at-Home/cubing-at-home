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

     const completeRoom = () => {
         const oldRoom = currRoom
         setCurrRoom()
        firebase.firestore().collection('timer-rooms').doc(oldRoom).set({completed: true}, { merge: true })
    }

    React.useEffect(() => {
        const unsub = firebase.firestore().collection('timer-rooms').where('completed','!=',true).onSnapshot(querySnapshot => {
            let fRooms = []
            querySnapshot.forEach(doc => {
                fRooms.push({...doc.data(), id: doc.id})
            })
            setRooms(fRooms)
            setCurrRoom(fRooms.length > 0 ? fRooms[0].id : undefined)
        })
        return () => unsub()
    }, [])

    const handleChange = (event) => {
        setCurrRoom(event.target.value);
    };
    return (
        <>
            {currRoom ?
                <Grid
                    container
                    spacing={2}
                    direction="column"
                    justify="center"
                    alignItems="center"
                    alignContent="center"
                    wrap="nowrap"

                >
                    <Grid item>
                        <InputLabel id='roomSelectLabel'>Select Room</InputLabel>
                        <Select style={{minWidth: '10vw'}} value={currRoom} onChange={handleChange} labelId='roomSelectLabel' id='roomSelect'>
                            {rooms.map(room => <MenuItem value={room.id} key={room.wcaId}>{room.name}</MenuItem>)}
                        </Select>
                    </Grid>
                    <Grid item>
                        <JudgeRoom completeRoom={completeRoom} room={rooms.find(r => r.id === currRoom)} />
                    </Grid>
                </Grid>
                :
                <></>
            }
        </>
    )
}
