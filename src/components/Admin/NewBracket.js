import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { addParticpant, createTournament } from '../../logic/challonge';


export default function NewBracket() {
    const [newBracketInfo, setNewBracketInfo] = React.useState({ name: '', url: '', hold_third_place_match: true })
    const [bracket, setBracket] = React.useState()
    const [competitors, setCompetitors] = React.useState(new Array(8).fill({ name: '', wcaId: '', confirmed: false }))
    const [err, setErr] = React.useState()
    const [loading, setLoading] = React.useState(false)

    async function handleTournamentCreate() {
        try {
            setLoading(true)
            const res = await createTournament({ tournament: newBracketInfo })
            setLoading(false)
            setBracket(res.tournament)
        }
        catch (error) {
            setErr(error.message)
        }

    }

    async function handleParticipantAdd(index) {
        const competitor = competitors[index]
        setLoading(true)
        const done = await addParticpant({ tournament: bracket.url, participant: { name: competitor.name, misc: competitor.wcaId } })
        setCompetitors(competitors.map((c, i) => i === index ? { ...c, confirmed: true } : c))
        setLoading(false)
    }

    const handleChange = (e) => setNewBracketInfo({ ...newBracketInfo, [e.target.name]: e.target.value })

    const handleCompetitorChange = (e, i) => {
        const newCompetiors = competitors.map((c, index) => index === i ? { ...c, [e.target.name]: e.target.value } : c)
        setCompetitors(newCompetiors)
    }

    return (
        <Grid
            container
            direction='column'
            alignContent='center'
            justify='center'
            spacing={3}
            xs={12}
            style={{ padding: '5vw' }}
        >
            <Grid item
            container
            direction='column'
            alignContent='center'
            justify='center'>
                <TextField value={newBracketInfo.name} name='name' label='Name' onChange={handleChange} />
                <br/>
                <TextField value={newBracketInfo.url} name='url' label='id used as URL' onChange={handleChange} />
                <Typography style={{color: '#f33'}}>link for the bracket, no spaces!</Typography>
                <br/><br/>
                <Button onClick={handleTournamentCreate} disabled={!newBracketInfo.name || !newBracketInfo.url || bracket || loading}>Create tournament</Button>
                {err && <p style={{ color: '#f33' }}>{err}</p>}
            </Grid>
            {bracket && competitors.map((competitor, i) =>
                <Grid item key={i}>
                    <h1>{`${competitor.confirmed ? `✔ ` : ''}Seed ${i + 1}`}</h1>
                    <TextField value={competitors[i].name} name='name' label='Name' onChange={(e) => handleCompetitorChange(e, i)} disabled={competitor.confirmed} />
                    <TextField value={competitors[i].wcaId} name='wcaId' label='WCA ID' onChange={(e) => handleCompetitorChange(e, i)} disabled={competitor.confirmed} />
                    <Button onClick={() => handleParticipantAdd(i)} disabled={competitor.confirmed || loading || !competitor.wcaId || !competitor.name}>Add Competitor</Button>
                </Grid>
            )}
        </Grid>
    )
}
