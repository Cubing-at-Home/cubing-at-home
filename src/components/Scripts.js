import React, { useEffect, useContext, useState } from 'react'
import { FirebaseContext } from '../utils/firebase'
import {
	updateRankings,
	updateLeaderboard,
	updateUsers,
} from '../database/scripts'
import TextField from '@material-ui/core/TextField'
import { buildCompetition } from '../database/builder'
import { submitTime } from '../database/writes'

export default function Scripts() {
	const firebase = useContext(FirebaseContext)
	useEffect(() => {
		async function doLeaderboard() {
			for(const info of leaderboard) {
				let i = 1
				for(const person of info.rankings) {
					await submitTime(firebase, 'cah1.2',info.round, {personId: person, roundId: info.round, ranking: i, isSubmitted: true })
					i+=1
				}
			}
		}
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
		function getInfo(competitionInfo) {
			const competition = competitionInfo
			const events = competition.events
			events.forEach((event) => {
				event.qualification = null
				delete event.extensions
				event.rounds.forEach((round) => {
					delete round.extensions
					round.results = []
					round.cutoff = null
					round.timeLimit = null
					round.advancementCondition =
						round.id === '333-r1'
							? { type: 'percent', level: 50 }
							: round.id === '333-r2'
							? { type: 'ranking', level: 8 }
							: null
				})
			})
			competition.events = events
			return competition
		}
		buildCompetition(firebase, getInfo(competition))
		// doLeaderboard()
		// firebase.firestore().collection('Leaderboards').doc('s1').set({'cah1.2': cah12}, {merge: true})

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
	id: 'cah1.4',
	name: 'Cubing at Home 1.4',
	shortName: 'C@H 1.4',
	registrationEnd: '2020-08-02T04:00:00.000Z',
	registrationStart: '2020-05-04T04:00:00.000Z',
	start: '2020-08-01',
	end: '2020-08-01',
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
			id: 'clock',
			qualification: '',
			start: '13:10',
			end: '13:30',
			name: 'Clock Final',
		},
		{
			start: '13:30',
			end: '13:50',
			name: '3x3 Round 1',
			id: '555bf',
			qualification: '',
		},
		{
			start: '13:50',
			end: '14:10',
			name: '3x3 One Handed Round 1',
			id: '333oh',
			qualification: '',
		},
		{
			name: '4x4 Final',
			id: '444',
			qualification: '',
			start: '14:10',
			end: '14:30',
		},
		{
			qualification: 'Top 50%',
			start: '14:30',
			end: '14:50',
			name: '3x3 Round 2',
			id: '333',
		},
		{
			id: '333',
			qualification: 'Top 50%',
			start: '14:50',
			end: '15:10',
			name: '2x2 Final',
		},
		{
			qualification: '',
			start: '15:10',
			end: '15:30',
			name: 'Megaminx Final',
			id: '',
		},
		{
			id: 'kilominx',
			qualification: '',
			start: '15:30',
			end: '15:50',
			name: 'Kilominx Final',
		},
		{
			name: 'Pyraminx Finals',
			id: 'pyram',
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
	persons: [],
	eventList: ['333', '222', 'pyram', '444', 'minx', 'clock', 'kilominx', '333oh'],
	events: [
		{
			id: 'clock',
			rounds: [
				{
					id: 'clock-r1',
					format: 'a',
					scrambleSetCount: 1,
					scrambleSets: [
						{
							id: 2,
							scrambles: [
								'UR6+ DR0+ DL4+ UL2+ U5- R0+ D0+ L2+ ALL1+ y2 U6+ R5- D4+ L1- ALL5+ DR DL',
								'UR5+ DR6+ DL5+ UL1- U4- R5+ D1+ L2- ALL3- y2 U3- R3- D5- L4- ALL6+ DR DL UL',
								'UR1- DR4- DL4+ UL1+ U4+ R2- D4+ L1- ALL1- y2 U0+ R4- D4+ L2+ ALL5- UR DR DL',
								'UR0+ DR3+ DL0+ UL6+ U2+ R0+ D4- L0+ ALL1- y2 U6+ R4- D1- L3+ ALL1+ DR DL',
								'UR0+ DR0+ DL2- UL2+ U4+ R2+ D3+ L3+ ALL2- y2 U2+ R1+ D5- L3+ ALL3-'
							],
							extraScrambles: [
								'UR4+ DR4+ DL3+ UL3+ U1+ R6+ D5- L2- ALL4+ y2 U0+ R3- D4- L0+ ALL6+ UL',
								'UR4- DR5- DL2+ UL5- U2+ R3+ D4- L1- ALL1+ y2 U0+ R2+ D2+ L1+ ALL0+ DR'
							]
						}
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1
							}
						}
					]
				}
			]
		},
		{
			id: '333',
			rounds: [
				{
					id: '333-r1',
					format: 'a',
					scrambleSetCount: 1,
					scrambleSets: [
						{
							id: 3,
							scrambles: [
								'D F2 R L\' F U\' L\' F2 U R B\' R2 F2 L2 B L2 F L2 U\'',
								'U\' R2 F2 D R2 D2 B2 U\' B\' L\' F D\' F D F\' L R\' F\' D',
								'R2 U\' R2 L2 F U\' B R2 U B2 L2 D B2 L2 U D2 B L F',
								'F U R B\' L D2 R D\' B L F B R2 L2 F R2 B2 U\'',
								'R\' U2 B D\' R D\' F B\' L U2 F\' B\' R2 D2 F\' L2 U2 D2'
							],
							extraScrambles: [
								'D\' B\' U2 B2 L2 U2 L2 F\' U2 F R2 U\' R B2 F D\' L D2 U2 B2',
								'D2 B\' L\' B L2 B F\' L2 U2 L2 B D F\' D U L F U2 L2'
							]
						}
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1
							}
						}
					]
				},
				{
					id: '333-r2',
					format: 'a',
					scrambleSetCount: 1,
					scrambleSets: [
						{
							id: 4,
							scrambles: [
								'R\' U F L\' D L\' B D F D2 R2 F2 R F2 L2 U2 R2 B',
								'R2 U F2 D2 B2 U2 R2 U\' R2 B L2 D2 U L R F\' D U\' B',
								'R U B U R B L2 U L F2 U\' D\' F2 L2 F2 D R\' D2',
								'R2 D B2 L2 U\' B2 U\' B2 L\' U2 B2 R B\' D F2 R F2 D\'',
								'R D L\' F2 D2 R2 D2 R B2 R D2 F\' D F\' L\' D2 U\' R2'
							],
							extraScrambles: [
								'R\' D2 R U2 R2 F2 U2 B\' R2 F\' L U2 B2 L2 B\' F\'',
								'U2 F\' U2 L\' B2 R\' U2 B2 F2 R\' U2 B2 D\' F2 R F2 L\' D U'
							]
						}
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1
							}
						}
					]
				},
				{
					id: '333-r3',
					format: 'a',
					scrambleSetCount: 1,
					scrambleSets: [
						{
							id: 5,
							scrambles: [
								'F2 L U\' D2 F2 R2 D2 R\' D2 B2 R2 F2 B\' U B2 R\' U F2 R2',
								'U D\' F B\' U2 B\' U\' L2 U\' L2 F\' D2 B U2 B L\' U\'',
								'R\' B\' L U2 B2 R U F L\' D R2 L2 D\' F2 D2 F2 D\' B2 L2',
								'L2 D L2 D2 R2 F\' L2 F\' D2 B2 L2 R\' D B L D F U2 B\'',
								'U D2 B\' D\' F\' L F2 D B L F L2 F2 L2 U2 R2 F L2'
							],
							extraScrambles: [
								'D\' B R\' B\' U2 B2 R2 D\' B F2 U B2 U F2 L2 D\' R\' B2',
								'D B2 L F2 R B D L\' F B\' R2 L2 F R2 F2 U2 D2 R2 U B'
							]
						}
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1
							}
						}
					]
				}
			]
		},
		{
			id: '333oh',
			rounds: [
				{
					id: '333oh-r1',
					format: 'a',
					scrambleSetCount: 1,
					scrambleSets: [
						{
							id: 6,
							scrambles: [
								'D\' R F2 L2 D2 L R F\' D\' R2 B\' D B\' D2 B F\' D',
								'D2 B2 F D2 L2 B L2 D2 L\' B\' U F2 L\' F2 D F\' R2 D U\'',
								'D2 B2 R2 B2 F2 U L2 D\' R2 D\' F D\' L F\' L2 B D R\' U\' R\'',
								'B\' D F2 D2 R\' F R\' F2 U F B\' U2 L2 B R2 B L2 B L\'',
								'D2 U2 L2 U F2 D2 U\' L B L2 D\' R\' F2 R2 U2 F R\' B'
							],
							extraScrambles: [
								'D R2 B2 U2 R\' L2 D L U L2 F R B2 R L B2 R\' U2 B2',
								'R2 U\' R D\' L D2 F2 U2 D2 F\' U\' F\' R2 U2 F2 D2 F L2'
							]
						}
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1
							}
						}
					]
				}
			]
		},
		{
			id: '444',
			rounds: [
				{
					id: '444-r1',
					format: 'a',
					scrambleSetCount: 1,
					scrambleSets: [
						{
							id: 7,
							scrambles: [
								'F2 U\' D R\' F L2 B D\' L F2 L2 B\' R2 D2 F\' L2 D2 L2 D Fw2 Uw2 D R2 F\' Uw2 B\' Rw2 B2 U B F R2 Rw\' Uw2 Rw U F2 Fw\' U2 Rw L Uw\' B2 D2',
								'L2 F2 U\' B2 U2 L2 R2 B\' L U\' L D\' L B\' L\' B2 U\' F Fw2 Uw2 U\' Rw2 D Fw2 L2 F2 R\' Uw2 L D U\' F R Fw D\' Rw\' L Fw\' Uw2 B\' L\' Uw2 L\'',
								'U2 F\' U2 L2 R2 B2 R2 D2 F2 U2 R D\' B R\' U R2 B\' L\' U\' B\' Rw2 Uw2 R\' Fw2 Rw2 Uw2 F\' R B\' L2 Uw2 R B Uw B D\' F\' U Fw2 L Rw Uw\' Rw\' Fw2 D2 U2',
								'F\' D F2 D2 F2 U2 L2 D2 R F2 L B2 F D F2 R2 B D\' B\' Fw2 Uw2 F\' Rw2 F\' Rw2 L\' R2 F R\' Uw2 R L Uw B R F D R2 Rw\' Uw F2 Rw\' Uw\' B',
								'B\' R2 F U2 B\' F\' D2 F\' R2 U L\' F2 D B U B2 R2 B2 Fw2 Uw2 L D\' Rw2 R Uw2 L2 Fw2 U F2 D L F D\' R2 Fw R\' Rw\' F U Rw\' Uw\' B\' U2 Fw2'
							],
							extraScrambles: [
								'U\' B2 U\' R2 B2 U F\' R F U2 B2 R2 F2 U\' B2 L2 U L Fw2 Uw2 Rw2 R\' Uw2 U2 L F2 B Uw2 L\' R2 Uw\' L R2 U2 Rw\' D\' Fw B Rw\' R2 D B\'',
								'B\' D2 F L2 F2 U2 D R2 L B2 D2 R B2 L F2 D2 U\' L\' F\' Rw2 F\' Uw2 F\' U2 B\' D U\' Rw2 Uw2 B\' U\' R F2 Rw L\' F\' Uw\' R2 U\' Fw\' D Rw\''
							]
						}
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1
							}
						}
					]
				}
			]
		},
		{
			id: '222',
			rounds: [
				{
					id: '222-r1',
					format: 'a',
					scrambleSetCount: 1,
					scrambleSets: [
						{
							id: 8,
							scrambles: [
								'U R\' U\' F R2 F\' R\' U2 R\' U R',
								'R2 U\' F\' R U\' R U2 F\' U\' R\' U2',
								'U\' R\' F U\' R U\' R\' F R\' F2 U\'',
								'U R\' F R\' U R2 U\' R2 U\' R U2',
								'R\' U\' R2 F U\' F\' R U\' R U R'
							],
							extraScrambles: [
								'R\' U F R U R\' U\' F U2 F U\'',
								'U R\' U\' R U R\' U R2 U\' R2 F2'
							]
						}
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1
							}
						}
					]
				}
			]
		},
		{
			id: 'minx',
			rounds: [
				{
					id: 'minx-r1',
					format: 'a',
					scrambleSetCount: 1,
					scrambleSets: [
						{
							id: 9,
							scrambles: [
								'R++ D++ R-- D++ R-- D-- R-- D-- R++ D++ U\nR-- D-- R-- D++ R++ D++ R-- D++ R-- D-- U\'\nR++ D-- R-- D++ R++ D++ R-- D-- R-- D-- U\'\nR++ D++ R++ D++ R-- D++ R-- D++ R++ D++ U\nR-- D++ R++ D-- R++ D++ R++ D-- R-- D-- U\'\nR++ D++ R-- D-- R-- D-- R-- D-- R++ D++ U\nR++ D++ R-- D-- R-- D-- R++ D++ R-- D-- U\'',
								'R-- D-- R-- D++ R++ D-- R-- D-- R-- D++ U\nR-- D-- R++ D-- R++ D-- R-- D-- R++ D++ U\nR++ D++ R-- D-- R-- D-- R++ D++ R-- D-- U\'\nR++ D++ R-- D++ R++ D-- R++ D++ R++ D++ U\nR-- D-- R-- D-- R++ D++ R-- D-- R-- D++ U\nR++ D-- R-- D-- R++ D++ R++ D++ R++ D++ U\nR-- D-- R-- D++ R++ D-- R-- D-- R++ D++ U',
								'R++ D-- R-- D++ R-- D++ R++ D++ R-- D-- U\'\nR-- D++ R++ D++ R++ D++ R++ D++ R-- D++ U\nR-- D++ R++ D-- R++ D++ R-- D-- R++ D++ U\nR-- D++ R++ D-- R-- D-- R++ D-- R++ D++ U\nR-- D++ R-- D++ R++ D-- R++ D-- R++ D++ U\nR++ D-- R-- D++ R-- D-- R++ D-- R++ D++ U\nR++ D++ R++ D++ R-- D++ R-- D++ R-- D++ U',
								'R++ D++ R++ D-- R-- D++ R++ D-- R++ D++ U\nR-- D-- R-- D++ R++ D-- R++ D-- R++ D++ U\nR++ D-- R-- D-- R++ D-- R-- D++ R++ D++ U\nR-- D++ R-- D++ R++ D++ R++ D-- R-- D++ U\nR-- D-- R-- D-- R-- D++ R++ D-- R-- D++ U\nR++ D++ R++ D-- R++ D-- R-- D-- R++ D++ U\nR++ D++ R++ D++ R-- D-- R++ D++ R-- D++ U',
								'R++ D-- R-- D++ R-- D-- R-- D-- R++ D++ U\nR-- D++ R++ D++ R++ D-- R++ D++ R-- D++ U\nR-- D-- R-- D++ R++ D++ R-- D-- R++ D++ U\nR-- D++ R++ D-- R-- D++ R-- D++ R++ D-- U\'\nR-- D-- R-- D++ R++ D-- R++ D-- R-- D-- U\'\nR-- D-- R++ D++ R++ D-- R++ D-- R++ D-- U\'\nR-- D-- R-- D++ R-- D++ R++ D++ R++ D++ U'
							],
							extraScrambles: [
								'R-- D++ R-- D-- R-- D++ R-- D++ R-- D-- U\'\nR++ D-- R++ D++ R-- D++ R-- D++ R-- D-- U\'\nR++ D-- R-- D++ R++ D++ R-- D++ R-- D++ U\nR-- D++ R-- D++ R-- D++ R-- D++ R-- D-- U\'\nR++ D-- R++ D++ R++ D-- R++ D++ R++ D-- U\'\nR-- D++ R++ D++ R++ D++ R-- D++ R++ D++ U\nR++ D-- R++ D++ R-- D-- R++ D++ R-- D++ U',
								'R-- D-- R-- D++ R++ D++ R++ D++ R-- D++ U\nR-- D++ R++ D++ R++ D-- R-- D++ R++ D-- U\'\nR-- D-- R-- D++ R-- D-- R++ D++ R++ D++ U\nR++ D++ R++ D-- R++ D-- R-- D-- R-- D++ U\nR++ D++ R++ D-- R++ D++ R-- D-- R++ D-- U\'\nR-- D-- R-- D++ R-- D++ R-- D++ R++ D++ U\nR++ D-- R-- D-- R-- D++ R++ D-- R++ D++ U'
							]
						}
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1
							}
						}
					]
				}
			]
		},
		{
			id: 'pyram',
			rounds: [
				{
					id: 'pyram-r1',
					format: 'a',
					scrambleSetCount: 1,
					scrambleSets: [
						{
							id: 10,
							scrambles: [
								'L\' B\' R\' U\' B L U\' L\' R\' L\' U\' u\' l\' r b',
								'U\' L R L B R\' B L\' U R\' L\' b\'',
								'L\' B\' U R L R L\' U R\' L\' R\' u\' l r\' b',
								'B L R L U\' L\' R\' B\' U\' L\' R u\' l',
								'U\' L\' B U L\' R\' L U R L\' B u\' l\' b'
							],
							extraScrambles: [
								'R B U\' R U R\' L\' U\' B R L u l\' r\' b',
								'R L B R\' U\' R\' B\' R\' U L\' U r\''
							]
						}
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1
							}
						}
					]
				}
			]
		}
	],
	rounds: [
		{
			id: '333-r1',
			isOpen: false,
		},
		{
			id: '333-r2',
			isOpen: false,
		},
		{
			id: '333-r3',
			isOpen: false,
		},
		{
			id: 'pyram-r1',
			isOpen: false,
		},
		{
			id: '444-r1',
			isOpen: false,
		},
		{
			id: '333oh-r1',
			isOpen: false,
		},
		{
			id: 'minx-r1',
			isOpen: false,
		},
		{
			id: 'kilominx-r1',
			isOpen: false,
		},
		{
			id: 'clock-r1',
			isOpen: false,
		},
		{
			id: '222-r1',
			isOpen: false,
		},
	],
	competitorCount: -1,
}



const leaderboard = [{
	round: '666-r1',
	rankings: ['381','434','26954','23645','57927','20743']
},
{
	round: 'redi-r1',
	rankings: ['30903','31326','31945','54658','49728','30211','6569','383']
},
{
	round: 'skewb-r1',
	rankings: ['135258','117115','96758','24542']
},
{
	round: '444-r1',
	rankings: ['62406','20743','40578','381','22128','14216','41048','8918','5568']
},
{
	round: 'minx-r1',
	rankings: ['10467','51069','117949','21736','8012','106981','43512','24152']
},
{
	round: 'pyram-r1',
	rankings: ['47704','20743','69967','53351','31945','6569','27300','10276']
},
{
	round:'333-r3',
	rankings: ['14216','36435','41048','40578','9743','8918','48181','381']
},
{
	round: '333fm-r1',
	rankings: ['1762','10111','1320','20930','8790','126479','70503','7826']
}
]

const cah12 = {
		'333': ['41048'],
		'333fm': ['1762'],
		'666':['381'],
		'444':['62406'],
		'minx':['10467'],
		'pyram':['47704'],
		'skewb':['117115'],
		'redi':['30903']

}