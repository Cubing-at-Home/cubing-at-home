import React, { useEffect, useContext, useState } from 'react'
import { FirebaseContext } from '../utils/firebase'
import {
	updateRankings,
	updateLeaderboard,
	updateUsers,
} from '../database/scripts'
import TextField from '@material-ui/core/TextField'

export default function Scripts() {
	const firebase = useContext(FirebaseContext)
	useEffect(() => {
		// 	async function getCompetition() {
		// 		const roundList = [
		// 			'333-r1',
		// 			'333-r2',
		// 			'minx-r1',
		// 			'555-r1',
		// 			'sq1-r1',
		// 			'pyram-r1',
		// 			'333oh-r1',
		// 			'2345relay-r1',
		// 		]
		// 		for (const round of roundList) {
		// 			const resultType = [
		// 				'333bf',
		// 				'444bf',
		// 				'555bf',
		// 				'333fm',
		// 				'333mbf',
		// 				'2345relay',
		// 			].includes(round.slice(0, round.indexOf('-')))
		// 				? 'best'
		// 				: 'average'
		// 			let results = cah2
		// 				.filter((person) => person[round] !== undefined)
		// 				.sort((personA, personB) => {
		// 					let aResult = personA[round][resultType]
		// 					let bResult = personB[round][resultType]
		// 					let aSingle = resultType === 'average' ? personA[round]['best'] : 0
		// 					let bSingle = resultType === 'average' ? personB[round]['best'] : 0
		// 					if (aResult <= 0 && bResult < 0) return aSingle - bSingle
		// 					if (aResult <= 0) return 1
		// 					if (bResult <= 0) return -1
		// 					return aResult === bResult ? aSingle - bSingle : aResult - bResult
		// 				})
		// 			results = results.map((result, index) => ({
		// 				...result[round],
		// 				ranking: index + 1,
		// 				name: result.name,
		// 				wcaId: result.wcaId ? result.wcaId : '',
		// 				personId: result.id,
		// 			}))
		// 			console.log(round.slice(0, round.indexOf('-')))
		// 			const eventIndex = competition.events.findIndex(
		// 				(e) => e.id === round.slice(0, round.indexOf('-'))
		// 			)
		// 			competition.events[eventIndex].rounds[0].results = results
		// 		}
		// 		buildCompetition(firebase, competition)
		// 	}
		async function getInfo(id) {
			const resp1 = await firebase.firestore().collection(id).doc('info').get()
			const info = resp1.data()
			const competition = {
				id: info.id,
				name: info.name,
				shortName: 'C@H V',
				registrationEnd: new Date('2020-05-28T00:00:00'),
				registrationStart: new Date('2020-05-04T00:00:00'),
				start: '2020-05-30',
				end: '2020-05-30',
				schedule: info.schedule,
				settings: {},
				competitorCount: info.competitors.length,
				persons: [],
				eventList: info.events,
			}
			const resp2 = await firebase
				.firestore()
				.collection(id)
				.doc('events')
				.get()
			const events = resp2.data().eventInfo
			events.forEach((event) => {
				event.qualification = null
				delete event.extensions
				event.rounds.forEach((round) => {
					delete round.extensions
					round.results = []
					round.cutoff = null
					round.timeLimit = null
					round.advancementCondition = null
				})
			})
			competition.events = events
			console.log(competition)
		}
	}, [])
	const [competitionId, setCompetitionId] = useState('')
	const [roundId, setRoundId] = useState('')
	const [roundIds, setRoundIds] = useState('')
	return (
		<>
			<TextField
				label='Competition ID'
				value={competitionId}
				onChange={(e) => setCompetitionId(e.target.value)}
			/>
			<TextField
				label='Round ID'
				value={roundId}
				onChange={(e) => setRoundId(e.target.value)}
			/>
			<TextField
				label='Round IDs (split by commas)'
				value={roundIds}
				onChange={(e) => setRoundIds(e.target.value.replace(/\s+/g, ''))}
			/>
			<button onClick={() => updateRankings(firebase, competitionId, roundId)}>
				Update Rankings
			</button>
			<button
				onClick={() =>
					updateLeaderboard(firebase, competitionId, roundIds.split(','))
				}
			>
				Update Leaderboard
			</button>
			<button
				onClick={() =>
					updateUsers(firebase, [
						{ name: competitionId, rounds: roundIds.split(',') },
					])
				}
			>
				Update Users
			</button>
		</>
	)
}

const competition = {
	id: 'cah5',
	name: 'Cubing at Home V',
	shortName: 'C@H V',
	registrationEnd: '2020-05-28T04:00:00.000Z',
	registrationStart: '2020-05-04T04:00:00.000Z',
	start: '2020-05-30',
	end: '2020-05-30',
	schedule: [
		{
			start: '12:00',
			end: '13:00',
			name: 'Twitch Solves',
			id: 'twitch',
			qualification: '',
		},
		{
			qualification: '',
			start: '13:00',
			end: '13:10',
			name: 'Welcome',
			id: '',
		},
		{
			id: 'skewb',
			qualification: '',
			start: '13:10',
			end: '13:30',
			name: 'Skewb Final',
		},
		{
			start: '13:30',
			end: '13:50',
			name: '5x5 Blindfolded Final',
			id: '555bf',
			qualification: '',
		},
		{
			start: '13:50',
			end: '14:10',
			name: '3x3 Round 1',
			id: '333',
			qualification: '',
		},
		{
			name: 'Kilominx',
			id: 'kilominx',
			qualification: '',
			start: '14:10',
			end: '14:30',
		},
		{
			qualification: '',
			start: '14:30',
			end: '14:50',
			name: '4x4 Final',
			id: '444',
		},
		{
			id: '333',
			qualification: 'Top 50%',
			start: '14:50',
			end: '15:10',
			name: '3x3 Round 2',
		},
		{
			qualification: '',
			start: '15:10',
			end: '15:30',
			name: 'Statistical Showdown with Kit Clement',
			id: '',
		},
		{
			id: '333bf',
			qualification: '',
			start: '15:30',
			end: '15:50',
			name: '3x3 Blindfolded Final',
		},
		{
			name: '2x2 Final',
			id: '222',
			qualification: '',
			start: '15:50',
			end: '16:10',
		},
		{
			qualification: 'Top 8',
			start: '16:10',
			end: '17:20',
			name: '3x3 Final',
			id: '333',
		},
		{
			id: '',
			qualification: '',
			start: '17:20',
			end: '17:30',
			name: 'Awards',
		},
	],
	settings: {},
	competitorCount: 2081,
	persons: [],
	eventList: ['333', 'skewb', '444', '222', '333bf', 'kilominx', '555bf'],
	events: [
		{
			rounds: [
				{
					scrambleSetCount: 1,
					id: '555bf-r1',
					scrambleSets: [
						{
							extraScrambles: [
								"Lw U' L' Fw2 D' Bw U' L2 U Uw' Lw' Fw2 B U2 F D2 Rw2 F2 Lw L2 Fw2 U' L' Bw2 U F2 D' B' L U' Bw2 F' Uw' Dw' Lw' Dw F U' Uw F' Fw B D L U' L Bw' F' D Fw Rw2 U D2 Rw F2 Bw Rw2 Dw U' Bw2 3Rw2",
								"F2 Bw Lw' L2 Fw2 Dw' U Fw2 Bw2 Rw B' Bw2 Dw2 Bw' B' R2 Lw' Bw F Fw' U Dw2 Rw B' R' B2 Dw2 R Rw Fw2 Bw2 R2 Lw2 Fw Lw' U2 B' R Rw2 U' B2 U' Rw2 D B' D2 Uw B L Rw F' Lw D' Dw2 B2 Fw' Lw' Fw' D2 Fw 3Rw'",
							],
							scrambles: [
								"Fw' Lw D2 Uw U2 Fw' D' Dw Bw' Fw' D Dw Bw' Uw2 R' Dw2 Lw Fw' Bw F2 Uw' Dw Fw Uw' L' Lw2 Bw2 R Bw' Fw Lw' D Uw Bw R' Lw2 Fw L' B' Bw' F2 R Bw' R' U2 Rw' B Uw' Bw' U Dw2 Lw Rw2 F2 B L2 R' Uw2 Bw L' 3Rw2",
								"Rw B R Bw2 Uw2 Bw Lw' D' L2 Bw2 B2 Fw2 F2 U Lw2 Uw2 Dw' Lw B2 U L' Uw2 B2 L' B' F Rw' Lw2 Uw2 D Fw Lw Bw2 Uw' F' Bw' Dw Uw2 Bw2 B2 Rw Dw Uw Rw2 Uw' B' R2 Fw' Rw' F Fw' Uw L2 Uw2 Lw L' Fw2 D' L 3Rw2 3Uw",
								"U2 L Rw R Fw2 R L' U' Uw2 Lw' Fw F' R2 Fw' R Lw Bw2 B' D' Dw Uw2 Fw R' F L2 F2 D Lw F2 Dw Rw Lw Fw2 F Bw2 U Lw' D' F2 B2 U2 Fw2 Bw Uw' F' B' U2 Dw L2 F2 Bw' D' B' Lw' L R2 Uw' L U2 Uw' 3Rw2 3Uw'",
							],
							id: 2,
						},
					],
					format: '3',
					results: [],
					cutoff: null,
					timeLimit: null,
					advancementCondition: null,
				},
			],
			id: '555bf',
			qualification: null,
		},
		{
			rounds: [
				{
					format: 'a',
					scrambleSetCount: 1,
					id: 'skewb-r1',
					scrambleSets: [
						{
							extraScrambles: [
								"B L B' U B R' L U R' B U",
								"B L B L B' L' R B' R' B U'",
							],
							scrambles: [
								"U R L B' R U' B L B L' R",
								"U B L R B L' U' L R U B",
								"U L R' U B U' B L B' U B'",
								"R U R L' R' B' R' L R' L' B",
								"R B U R U' R U B L B U'",
							],
							id: 3,
						},
					],
					results: [],
					cutoff: null,
					timeLimit: null,
					advancementCondition: null,
				},
			],
			id: 'skewb',
			qualification: null,
		},
		{
			id: '444',
			rounds: [
				{
					scrambleSetCount: 1,
					id: '444-r1',
					scrambleSets: [
						{
							extraScrambles: [
								"F' D' R2 F2 D2 R L2 D2 R2 D2 L' F' U' R2 L2 F2 U F' U2 R' Uw2 L D F2 L' Fw2 F2 Rw2 L' U' Fw2 L U2 Fw L F' U2 Fw B' Uw' B' L2 Uw L",
								"U' B D' B2 L2 D2 F2 L' U2 R2 B2 L U2 D F B' R2 F L' F Rw2 Fw2 R Uw2 L2 D' L F2 D2 Rw2 U' F' U' Fw' F U2 R Uw' Rw F' Uw L' F' Uw' B2",
							],
							scrambles: [
								"D' R2 D' R2 D2 B2 R2 U R2 D B2 R' F' D B L' B2 L' R U' Uw2 L' Uw2 Fw2 U2 F' Rw2 R D2 Rw2 R L' Uw L' F2 L2 F' Fw' R2 Fw' Uw2 Rw' L2 Uw Fw",
								"R2 F2 U2 L2 B' L2 F' L F L' U F2 D' R U F2 R2 L Rw2 B' L2 D' F Rw2 R2 F Uw2 Fw2 D B' Uw2 Rw' D2 L2 F' Rw U2 Uw' B' Rw Uw' Rw U2 Fw'",
								"D2 U' R D2 U' B' R' D' L U2 R F2 L' R F2 D2 B2 D2 R' D' Uw2 F' Uw2 D2 B' Uw2 R2 Fw2 D2 L' B D2 R2 Uw' R B' R2 U Fw Uw' D' R' F' Rw' Fw' B'",
								"L U2 L F2 B' U F' L2 U2 L2 D F2 U' L2 U F2 L2 U' L2 Rw2 D' B L2 U2 B Uw2 Rw2 F' U2 Rw2 U2 Fw2 Rw Fw2 D L' B Fw R2 Fw Rw2 B' Uw' B",
								"B2 L' F' D L' D' F2 U2 L D2 B' L2 B' D2 F2 B U2 R Fw2 Uw2 U Fw2 D B' U2 Rw2 F' B U B' Rw D R' B2 Rw Fw' D Fw Uw D' Rw2 U'",
							],
							id: 4,
						},
					],
					format: 'a',
					results: [],
					cutoff: null,
					timeLimit: null,
					advancementCondition: null,
				},
			],
			qualification: null,
		},
		{
			id: '333oh',
			rounds: [
				{
					scrambleSetCount: 1,
					id: '333oh-r1',
					scrambleSets: [
						{
							extraScrambles: [
								"F L B F2 U' B2 D' U2 L2 F2 U2 L2 B' U' L R' F2 D' L R",
								"F' U B U2 F L' F' D' F2 R' U B2 R L U2 F2 U2 F2",
							],
							scrambles: [
								"D2 B2 L2 R2 D B2 F2 U2 L2 F2 U' L B R' U' R' B' D B'",
								"L' B2 U' L' R' B2 L' D2 B2 L F2 U2 L D F2 L B' D' R' F'",
								"F D2 L D2 L2 F2 R F2 U2 F2 B' R' F D2 U' L' B' L2",
								"U L R F2 U2 L' D2 L2 F2 D' F L2 B D' B2 U2 L R B2",
								"R D' F B2 L F2 D2 R2 F2 L' R' D2 R' U L' F' D' B' F L",
							],
							id: 5,
						},
					],
					format: 'a',
					results: [],
					cutoff: null,
					timeLimit: null,
					advancementCondition: null,
				},
			],
			qualification: null,
		},
		{
			rounds: [
				{
					scrambleSetCount: 1,
					id: '222-r1',
					scrambleSets: [
						{
							extraScrambles: [
								"U R' U2 F U' R' U2 F U R2 U2",
								"U2 R' F' U F2 R U' R' U2 F U'",
							],
							scrambles: [
								"U' R' U' F' U2 R2 F' U2 R' U R",
								"R' F2 R U R' F U2 F R' U2 R",
								"U R' U' F2 R2 U' F R U' R U'",
								"R U2 R' U' R U2 R2 U F U' R2",
								"U R' U2 F R U' F U2 F R U",
							],
							id: 6,
						},
					],
					format: 'a',
					results: [],
					cutoff: null,
					timeLimit: null,
					advancementCondition: null,
				},
			],
			id: '222',
			qualification: null,
		},
		{
			rounds: [
				{
					format: 'a',
					scrambleSetCount: 1,
					id: '333-r1',
					scrambleSets: [
						{
							extraScrambles: [
								"L2 F' U' L D' L' B2 L' F' B2 D B2 D' R2 B2 R2 D2 R2 U' B'",
								"U2 B R2 B D2 B' F U' B2 D B2 L2 F' L' R D F' R",
							],
							scrambles: [
								"U F2 L' F' D2 L' F' L D2 F B' R2 D F2 R2 U B2 L2 U",
								"U D R' B' R D2 R D' B2 L2 F2 R2 U2 B2 D F2 D' F' R2 U2",
								"B2 R' D2 L' U2 B2 D2 U2 L' F' D2 U2 F D2 L' B2 D' U2 F",
								"L2 F' L D2 B2 R U2 F2 D2 B2 R2 D' F L U' F D' B2 D2",
								"L2 D2 B2 D' F2 U' L2 D2 F2 R2 F R B' L2 R D R' B L2 F'",
							],
							id: 7,
						},
					],
					results: [],
					cutoff: null,
					timeLimit: null,
					advancementCondition: null,
				},
				{
					scrambleSetCount: 1,
					id: '333-r2',
					scrambleSets: [
						{
							extraScrambles: [
								"D' R2 B' L2 F' R' B U B L' B' U2 F R2 F2 D2 F U2",
								"U' L2 R2 U2 F2 D' U2 F2 L B2 R D' R2 B2 R2 F' U' B L'",
							],
							scrambles: [
								"F U2 F' D2 R2 D2 B R U B' L' R' D' R2 F2 L D' F2",
								"U B' L' D R2 D B2 L2 R2 D2 R2 U' L U B2 U2 F' D L'",
								"B2 U B' F2 U F2 R2 U2 F2 U' F2 B R' D R D' B2 R' D'",
								"R F' L2 F' U2 F2 R U2 L' D2 U2 L2 D' B L R2 D2 B2 F",
								"U' L B' L' D2 R D2 R B2 D2 B2 U' F' R' D L2 D F' D'",
							],
							id: 8,
						},
					],
					format: 'a',
					results: [],
					cutoff: null,
					timeLimit: null,
					advancementCondition: null,
				},
				{
					scrambleSetCount: 8,
					id: '333-r3',
					scrambleSets: [
						{
							extraScrambles: [
								"D2 R2 U2 L2 R2 U2 B D' R' D' B F' R' F' L2 F' R' U2",
								"D' B' L U2 F2 B2 L D F B R2 U2 B' U2 F' B' D2 R2 U'",
							],
							scrambles: [
								"U2 F B2 R D2 F' D L F B2 L2 F' U2 D2 F2 D2 F' D2 L2",
								"B2 R2 U' B2 R2 F2 D B2 U' L D' B' U' B2 R' F2 U2 R' U",
								"R L2 D2 R2 U L2 F2 D2 F U2 L D2 B2 R' F2 R2 F2 D2 R'",
								"R' F L' U B' U' D2 F2 D L U R2 B2 D2 L2 B2 D2 L2 U",
								"B' U2 R' F' R' U' B D B2 U2 R2 U R2 F2 D2 B2 U' F L' U",
							],
							id: 9,
						},
						{
							extraScrambles: [
								"U2 F' U L2 R B2 L2 F2 D2 L' D' L F' D2 B2 L2 F' L'",
								"R' L' B' R2 L U2 F D' R2 L2 B2 L2 U2 D R2 B2 D F' R'",
							],
							scrambles: [
								"R2 U B D B' R D' B U' L' B2 R' F2 U2 L' B2 D2 B2 D2 R2",
								"U F2 U2 L D2 U2 L' D2 L' D2 L2 B2 L F U B' L' R F D",
								"D B2 U' F2 L2 U' L2 F2 B' R' U2 B' D' R' U2 L' D2",
								"D2 B' R2 B2 F' L2 F' L U2 R F' D' R U F U' L' B'",
								"R' U' R2 F2 L F' L' B U' B2 R' D2 R2 B2 U2 D2 L U2 L2 U2",
							],
							id: 10,
						},
						{
							extraScrambles: [
								"D2 L' R2 F2 L2 R2 F' L2 R2 U2 L B F2 R U R D' L' B2",
								"L2 F2 B2 U' B D2 B2 U2 R' L2 D2 B' L2 U2 F U2 R",
							],
							scrambles: [
								"L' F2 D2 F' U2 R2 B2 D2 L2 F' L2 D' U' L F' R B2 L2 R B'",
								"D L2 F2 R D2 B U2 R2 B R2 D2 F2 L' D' F U L2 U' L",
								"L B2 U2 B2 U2 R D2 L D2 F U' L D R' B' D' L2 B' U'",
								"F2 B' L U' F' D R' D R' F2 L' D2 F2 R U2 L2 U2 R' B",
								"R' F' U2 R L' U2 L2 D' F2 L2 F R2 F R2 B' D2 L2 B' D2",
							],
							id: 11,
						},
						{
							extraScrambles: [
								"R2 D U2 F2 L2 U2 R2 D2 F R' B2 D' R2 B' L F2 D2 R' U'",
								"U2 R2 U2 B' F2 D2 F' U2 L2 B2 L' D B' D' R2 F' D U2 R' U",
							],
							scrambles: [
								"U L' F L' D U B2 U R2 F2 L2 U' F' D2 R' U' F2 L' R'",
								"R F U2 R2 B' U F R U2 F2 U2 F2 U' B2 L2 U R2 B U'",
								"R2 D2 R F2 L B2 R' F2 U2 L D U F' U' L' B2 L' B' L' U",
								"L U D' R F' R' L' U2 L2 D2 F2 R2 B2 U' L2 U2 L2 B'",
								"F2 U D F' D F2 D' R' L F U' R2 U R2 B2 U R2 U' F'",
							],
							id: 12,
						},
						{
							extraScrambles: [
								"U B' U L B2 U' L2 U L2 U B2 D' F R B2 L' B R' D2",
								"D2 L2 U' B2 U2 F L' B2 L2 U2 B2 U2 F2 R2 U' L D2 L'",
							],
							scrambles: [
								"D L R2 D2 B' R2 D2 B U2 B L' U' B' L' R' F' L' R' F",
								"U F' D2 B2 D2 R2 F R2 F L2 D2 L' U2 F D' B F D' L'",
								"B U D2 L2 D2 R2 B2 L' U2 R' F' L D R B R' U2 F'",
								"D2 R U L D F2 D2 L' U F U2 F' D2 L2 F' L2 B U2 B2 U'",
								'D R2 D2 R2 B2 U2 B2 U2 R B L U2 L B D2 L2 R D',
							],
							id: 13,
						},
						{
							extraScrambles: [
								"D' R F' L' U' B2 D2 R F R' L F2 U2 R2 D2 R D2 L' U'",
								"F2 L' F' U2 D B D2 F2 L2 B2 R2 D' R2 D' F2 R2 D' B2 R U",
							],
							scrambles: [
								"F L D2 B2 L R F2 L' B2 D2 R2 U R' F U' L2 D2 B2 F'",
								"F D' R2 D B2 L U2 F2 R2 F2 L B' R D R F2 D2 F2",
								"B' D L' F' R' B2 L' F' L D L U2 B' U2 F2 B' D2 F D2",
								"U2 R D2 L R B2 F2 U B R' B R2 F' D2 B' U L' F2",
								"R U' L2 B U2 F2 R B U' F' L R2 U F2 D' B2 D2",
							],
							id: 14,
						},
						{
							extraScrambles: [
								"F2 D2 F2 U F L' F' L' F' U2 B2 R2 L U2 R' F2 L' F'",
								"U2 B2 L' B2 R2 B2 D2 R' U2 F2 B R F' D R' D' U' F2 L D2",
							],
							scrambles: [
								"B' L2 B2 D2 L2 D2 R F L2 F D2 L2 F' L2 F2 B' L' D B'",
								"F' U' R' D F' D2 L2 F2 R2 B' F2 U R B U2 L2 U' F'",
								"D' R' D2 L' F B2 R' D' R2 U2 R2 F B2 U2 B2 U2 D' F2",
								"R2 B' D2 B2 U2 B' U2 F' U2 D' B L2 F U2 F' U' L2 F L'",
								"R D R B' L' D R' D F R' L' B2 L D2 L' U2 D2 R",
							],
							id: 15,
						},
						{
							extraScrambles: [
								"R2 B2 R2 F' R2 F U2 F' U R' U2 L' F U' L2 U B U' L'",
								"R2 D' B2 R2 U B2 U' R2 D2 B' L F2 R B F L2 B' U L' U",
							],
							scrambles: [
								"F2 U F D2 U2 L F2 L D2 L2 F2 L' F2 B' L2 R' D B2 U' L",
								"U2 D F' D B' R2 B R' L2 U2 F2 U F2 U2 L2 F2 D B' R'",
								"R2 L F2 U2 D' R F2 D' B R2 L U2 L2 D2 L' B2 R F",
								"R' F2 L2 B2 U2 B2 D' B2 F2 U F' L' D' R' F R' B2 U'",
								"D' F' D' F2 U2 F2 R' B2 D2 U2 L' D B' L B2 L' B2 L",
							],
							id: 16,
						},
					],
					format: 'a',
					results: [],
					cutoff: null,
					timeLimit: null,
					advancementCondition: null,
				},
			],
			id: '333',
			qualification: null,
		},
		{
			rounds: [
				{
					format: 'a',
					scrambleSetCount: 1,
					id: 'kilominx-r1',
					scrambleSets: [
						{
							extraScrambles: [
								"R flip U2' R F2 U F R BR' U flip R2 U' L2 BR2 U' L2 BR2 U' BL2' U F' R2 U' F2 R2' F U2' R2 U' F U2",
								"R flip R' F2' L' BL BR2 R F flip R BL L2 BR2' U2 BL2 L U R2 F2 R U2 F' R' F U R2 U2 F2'",
							],
							scrambles: [
								"flip R2' U' R2 U' F2 BR2 R2 flip F L2' U' BR2' BL' L2 BL2' BR R' U2' F2' U2' R F U2 F' R F2' U2'",
								"U2 F' L' U F2 BL2' U' R2 flip U R' BR' BL U BR2' BL L2' U' R' U F' R2 U F2 R2' U' R2 F2' R2",
								"U R2' L BR' U' R L U' flip U BL L2 F' U2' L2 U2' BR2 U2 R' U2' F' R' U' R2' F2 U F2' U2' R' U2'",
								"R flip F2' U2' F2' BL2 L2' U' R2 flip F2 BL2 U' L2 BR2' R U' BL2' L2 U2' R2' U F2 R' U2' F' R2 U' F' U' R'",
								"R flip U BR2' R' BR U2 BR BL' flip F' R F' L2 U2 BR2 BL U F2' U2 F2' R F2' U2' R2 F2 R F2' U2'",
							],
							id: 17,
						},
					],
					results: [],
					cutoff: null,
					timeLimit: null,
					advancementCondition: null,
				},
			],
			id: 'kilominx',
			qualification: null,
		},
		{
			rounds: [
				{
					id: '333bf-r1',
					scrambleSetCount: 1,
					results: [],
					scrambleSets: [
						{
							extraScrambles: [
								"D2 R2 U2 L2 R2 U2 B D' R' D' B F' R' F' L2 F' R' U2",
								"D' B' L U2 F2 B2 L D F B R2 U2 B' U2 F' B' D2 R2 U'",
							],
							scrambles: [
								"U2 F B2 R D2 F' D L F B2 L2 F' U2 D2 F2 D2 F' D2 L2",
								"B2 R2 U' B2 R2 F2 D B2 U' L D' B' U' B2 R' F2 U2 R' U",
								"R L2 D2 R2 U L2 F2 D2 F U2 L D2 B2 R' F2 R2 F2 D2 R'",
								"R' F L' U B' U' D2 F2 D L U R2 B2 D2 L2 B2 D2 L2 U",
								"B' U2 R' F' R' U' B D B2 U2 R2 U R2 F2 D2 B2 U' F L' U",
							],
							id: 9,
						},
					],
				},
			],
			id: '333bf',
			qualification: null,
		},
	],
}
