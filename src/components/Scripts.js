import React, { useEffect, useContext, useState } from 'react'
import { FirebaseContext } from '../utils/firebase'
import {
	updateRankings,
	updateLeaderboard,
	updateUsers,
} from '../database/scripts'
import TextField from '@material-ui/core/TextField'
import { buildCompetition } from '../database/builder'

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
	id: 'cah1.1',
	name: 'Cubing at Home 1.1',
	shortName: 'C@H 1.1',
	registrationEnd: '2020-05-29T04:00:00.000Z',
	registrationStart: '2020-05-04T04:00:00.000Z',
	start: '2020-05-28',
	end: '2020-05-28',
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
	persons: [],
	eventList: ['333', '222', 'pyra', '555', '333oh', 'sq1', '333mbf', 'mirror'],
	events: [
		{
			id: '333',
			rounds: [
				{
					id: '333-r1',
					format: 'a',
					scrambleSetCount: 1,
					scrambleSets: [
						{
							id: 2,
							scrambles: [
								"R D2 L2 U2 R B2 R U2 R' U2 R' U' F D2 R' F' D' B2 U'",
								"U2 R' B2 R2 B2 D2 L' B2 D2 U' F U2 L U' R D R2 B' D",
								"F R U2 L U2 B2 U2 R' U2 L2 R' U' F R F2 L' U F D' U",
								"L U' L F2 B' D' L' B D2 R2 L' F2 D2 F2 R' F2 L' U2 D F'",
								"U L2 D' F B' L F U2 R' L' D2 R' U2 F2 L U2 R D B D",
							],
							extraScrambles: [
								"U2 L' B R2 B2 D L2 U2 B2 D2 B2 U2 L' U' F' D2 R F L F",
								"F' R' U L D2 B D2 B' U' L2 D' F2 B2 D' B2 R2 U L2 D' R2",
							],
						},
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1,
							},
						},
					],
				},
				{
					id: '333-r2',
					format: 'a',
					scrambleSetCount: 1,
					scrambleSets: [
						{
							id: 3,
							scrambles: [
								"R2 B2 U' R2 U' B2 U' L2 U2 L2 R' D2 F D L' F D2 U R'",
								"F' D R2 U L2 D' B L2 B' U L D F' L D2 U2",
								"R F2 L2 R2 D B2 U' F2 U' L D2 L D' R' F' U2 L2 B D2",
								"L2 R U' R2 D L2 U' B2 U B2 L F2 D' B R2 B L' F L",
								"D' L F2 D R2 D' F2 D B2 L2 F' R U L2 D2 B2 F2 R2",
							],
							extraScrambles: [
								"U L F' U2 B U2 B2 U2 F L2 D' B2 D B D R2 U' L'",
								"F' D R D2 R' F2 R' D2 U2 L' B' L D' U2 B U B D'",
							],
						},
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1,
							},
						},
					],
				},
			],
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
							id: 4,
							scrambles: [
								"R' U2 R U' R' U2 R U' F' R U",
								"R U2 F' R2 F U' F' U2 R U' R'",
								"U2 R U' F' R2 U' F R2 U' F R",
								"R' F R U2 R' U R2 U2 R2 U' R2",
								"U' R U' F' R' U' F2 R U2 R U2",
							],
							extraScrambles: [
								"R' F' R2 U' R2 F' U2 F2 R U2 R",
								"R' U' F U2 R U2 F' R U2 R' U2",
							],
						},
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1,
							},
						},
					],
				},
			],
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
							id: 5,
							scrambles: [
								"L' R' B R' U' B L' R B' U B' u' r b",
								"B' U R' U R B' L B R' B R' l b'",
								"R B U' L R U' L B U L' B' u r",
								"U' L U R' B' R' U R' U L R' u' l' r",
								"B' R' B R' B' U R' L' U B L b'",
							],
							extraScrambles: [
								"R' U L' B' U R' L U R B L' u r' b",
								"R U R' B U B U' R' B U' R' u' b",
							],
						},
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1,
							},
						},
					],
				},
			],
		},
		{
			id: '555',
			rounds: [
				{
					id: '555-r1',
					format: 'a',
					scrambleSetCount: 1,
					scrambleSets: [
						{
							id: 6,
							scrambles: [
								"U Dw' B L2 Uw' L' R2 U B D Fw2 D' Rw2 U2 Dw' R F' Dw' Lw2 F Bw R2 F2 D' Rw Bw U F2 U Bw Uw U F2 Rw2 L2 Lw2 Uw' Lw' U' R2 Bw' Lw' Uw' B R' Dw' Rw' Bw2 Fw R' B' Fw2 R L2 Bw' U' F Uw B2 Dw",
								"L2 Bw' L' Bw' R' Lw Uw' L' D Uw' U Lw2 Uw R2 Uw' U2 Fw' Dw Uw2 D Rw2 Bw2 F' Lw' F2 Uw' B D Bw' R' B' F L Lw Bw' Uw2 U2 Lw2 Rw2 Fw F2 B' Dw2 Uw' Rw2 D2 L2 B' Rw' B' Bw' L2 Bw2 Fw2 B2 L D' R' B' Rw'",
								"Uw Bw2 F' Fw' D' Lw L Fw R' Rw' F D2 F' Rw B' Uw2 Fw2 Dw2 Rw' Bw B2 D2 U Rw2 D Lw2 Bw B' L2 Uw Dw2 B Lw' Uw' Fw U L R F2 B2 R2 D2 Fw B2 D2 Fw Rw B L2 Lw' D2 F' Lw2 Bw D2 Rw Lw' Bw2 B Fw2",
								"Fw2 Dw Uw2 Fw' Uw2 Lw2 Rw Uw2 B' Rw2 U2 Bw B L2 Lw2 U D2 R2 Bw2 Fw' Dw Bw L U2 Lw' Fw' D2 Bw2 F D U2 Rw2 Bw2 Fw L' D2 B Dw L2 R' Fw' Dw' Rw B' Bw' Lw' Fw2 Rw2 L2 Bw2 L2 U' F' Rw U2 F R2 D2 L2 Lw'",
								"Uw' R L U' Rw2 Dw2 U D2 F' Fw L' R U2 Fw2 Bw' R Rw' D2 Bw U Bw Dw' B Lw L' U' Fw' Lw2 R D L2 R' Uw2 U' B Rw2 F2 R' B' Fw' Rw' R2 U2 R' U2 F' Uw' L R2 Rw F Fw' B' L' U' Lw2 Uw' U R Rw'",
							],
							extraScrambles: [
								"R Lw2 Rw Dw D' L R Dw' Fw2 B2 U2 Fw Rw' Fw2 B2 R D Bw' Rw' B' R Uw' F2 U R2 F2 Dw2 Bw Uw' R Rw2 Dw2 Fw L2 U2 Bw2 Dw2 Rw R2 Fw L2 U D L2 Fw Uw L2 Bw' U2 B R2 Rw Lw' U Lw Fw' F2 B R2 B'",
								"Dw' B2 R F' Rw' F2 D' Rw2 Uw' B Uw D R' Dw' Fw' Lw Dw2 Lw' B2 R' B' D' R' D' Uw2 Bw B2 Fw Uw' B' Bw2 U F2 U F B R' Uw' D2 B' D' L Dw2 F2 R Uw Dw2 Lw2 Uw U' L' Uw U' Bw2 Lw2 B Dw F2 Fw' D'",
							],
						},
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1,
							},
						},
					],
				},
			],
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
							id: 7,
							scrambles: [
								"F' U2 L B2 D2 U B2 U' F2 R2 U B' F D2 L' F2 R B",
								"R' L' D F2 U' L' D2 L' F2 R F2 B' L2 B' R2 U2 B U2 L2 F'",
								"B2 D2 B L2 F' D2 L2 D R' U2 F' L B D R' D2 L2 R",
								"B U2 F L D2 R' U2 L2 B2 R2 F2 B L B U B2 L' B' D2",
								"D2 R U2 B2 L F2 L F2 D' F' U B' F R U2 B' F2 R' D2",
							],
							extraScrambles: [
								"F D2 F2 B L' B U' F' D2 R F U2 D F2 U' L2",
								"U2 F2 R2 U' L2 R2 B2 D R2 D' F' R D2 L' B2 F' D B D",
							],
						},
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1,
							},
						},
					],
				},
			],
		},
		{
			id: 'sq1',
			rounds: [
				{
					id: 'sq1-r1',
					format: 'a',
					scrambleSetCount: 1,
					scrambleSets: [
						{
							id: 8,
							scrambles: [
								'(0,-1) / (-2,-5) / (-1,5) / (3,0) / (0,-3) / (-2,-3) / (0,-3) / (-1,0) / (-2,0) / (2,0) / (3,-2) / (-4,0) / (2,-2)',
								'(0,-4) / (0,3) / (4,-5) / (-1,-1) / (4,0) / (-3,0) / (-1,0) / (2,-5) / (2,0) / (6,0) / (0,-4) / (-2,0) / (-3,-4) /',
								'(-5,0) / (0,3) / (3,-3) / (-4,-1) / (6,0) / (-3,0) / (0,-5) / (-3,-3) / (6,-5) / (0,-2) / (0,-2) / (-2,-5) / (-1,0)',
								'(0,5) / (-5,-2) / (5,5) / (3,-3) / (-5,-2) / (2,0) / (-3,-3) / (0,-1) / (0,-4) / (-4,-5) / (-2,0) / (1,0) /',
								'(-5,0) / (3,0) / (0,3) / (2,-4) / (3,0) / (-3,0) / (-2,0) / (-3,0) / (5,-3) / (-5,0) / (-2,0) / (0,-2) / (4,0) /',
							],
							extraScrambles: [
								'(-5,0) / (-3,6) / (-4,2) / (-3,0) / (3,0) / (3,-3) / (-2,0) / (-3,-3) / (1,0) / (-4,-2) / (-4,0) / (4,-2)',
								'(0,2) / (1,-2) / (0,-3) / (5,-1) / (3,0) / (-5,-2) / (-4,0) / (0,-3) / (4,0) / (0,-1) / (4,0) / (-3,-4) / (-4,0)',
							],
						},
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1,
							},
						},
					],
				},
			],
		},
		{
			id: '333mbf',
			rounds: [
				{
					id: 'mirror-r1',
					format: 'ao5',
					scrambleSetCount: 1,
					scrambleSets: [
						{
							id: 9,
							scrambles: [
								"L U2 R' D' F' U2 D2 B' U' F B' L2 U D L2 F2 L2 F' L' U",
								"U L D' L R2 U2 F L' U' D2 L2 D2 B R' U2 L' R2 D L R",
								"D R' L' B L R' F' U B D B' U' L2 D L B' F2 D2 F L'",
								"B' F' D R2 U D' R' U D2 B L' R2 F2 U D2 R U' R' F2 B2",
								"L D' L U' B' U2 F2 B' L F2 R' L' F' B' R B R F' R B",
							],
							extraScrambles: [
								"L U R' D2 R' U2 D2 R B2 U2 B' R' B L2 F L R2 F2 R B2",
								"U2 D' L' B U L' U' L2 B' L' B F2 L D L R' F' D2 B' U2",
							],
						},
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1,
							},
						},
					],
				},
			],
		},
		{
			id: '333mbf',
			rounds: [
				{
					id: '333mbf-r1',
					format: '1',
					scrambleSetCount: 1,
					scrambleSets: [
						{
							id: 9,
							scrambles: [
								"F U B R' U' R' D' F B L F2 B2 U D2 F2 D R2 U R Uw2\nL2 U' R2 D2 B' D2 R2 B F D' R U2 F L2 B2 D L D'\nU' R' D' F D2 B L2 D2 U2 F' L2 B U L' D U' R U' F\nB2 L2 U' L2 R2 D B2 D' U B2 F U B' U' R' B2 F2 L2 B' R' Fw Uw'\nD2 B L2 F2 U2 L2 F2 U2 B' L2 R2 U' B2 R D2 R F' R D R2\nL2 B2 L2 R2 D F2 R2 D' U2 F2 D2 L F D2 L F2 D' U R' B U' Fw' Uw2\nL' D2 R2 B' R2 F2 U' D B' D L U2 R' B2 L U2 B2 L' B2 Rw2 Uw'\nR' D' R' D2 R2 D2 B U2 B2 U2 B L2 F R' B' L' F2 L F2 L2 Fw' Uw\nB2 U2 R2 D' F' L2 U2 F U2 B' U2 B2 R D U' B' L' B F' Rw' Uw2\nD2 L' B L B L B D F2 R' L2 D2 F L2 F' R2 F' U2 B' Rw Uw\nF L' U R2 B2 U2 L D2 B2 R D2 F D2 R' U' B2 F' U2 Fw\nL B D L' F' B2 D F2 R' B U2 F' U2 L2 U2 D2 F' U2 B2 Uw\nL F2 D2 U2 L' F2 R2 D2 R' D' R' F' U L' U2 F' R' B' U2 R Fw Uw\nR2 U L2 D L2 F2 D' B2 U' R2 B' U' F2 R' F' D2 F2 R U2 Rw' Uw'\nL2 U R' B' L2 F' D F2 U R' B' D B2 R2 D R2 U L2 U D' Fw' Uw'\nL F2 B' R' U R D' L2 F L F' L U2 D2 F2 L D2 F2 R2 Fw'\nB U D2 B' R2 D2 L' B2 L2 B2 R2 D2 F2 B L2 U2 L' U R Fw' Uw\nR' L' U' F2 R F' B2 R B2 L D' B2 D2 F' U2 R2 B' R2 U2 Rw' Uw'\nU' L D2 B2 U B2 U' L2 D' F2 L F2 L B L R' D L2 F' Uw\nF R' D2 R D F' L2 F U' L F2 D2 R2 D2 F B L2 B' U2 Fw' Uw\nR' F2 R2 U2 F2 R U2 B2 R' F2 U' F' L B D2 B R2 F' U'\nL B2 U R2 B2 L' B2 D2 F2 D B2 D L2 B2 R' B R Fw' Uw2\nR' D B2 F2 U R2 B2 D F2 L' F R' D U R B R D B2 Rw Uw2\nL D' L' B' D' L' U R L' D' F B2 L2 D2 B R2 U2 B' U Rw\nD B L2 D' B2 D2 F2 L2 F2 R F' L2 U R' B' F' R2 D Fw' Uw\nR' U L' U2 L2 B2 U2 B' D2 F' D2 B' L U' B' D U' R D2 F2 Rw Uw2\nF2 L D2 L2 F2 U F2 D2 R2 D' R2 U2 L' F R2 D' L D' L2 R' Fw' Uw\nB U D' F U F' B2 D L' D' R U L2 B2 D2 B2 U' R2 D' Fw' Uw\nB U2 R' F2 D L' B' R2 D' R F2 R2 L2 U R2 F2 U2 D' B Rw\nU2 B2 D' U2 R D2 L U2 L' R U2 F' L' R' D B F' R' D' Fw' Uw\nR D2 L2 B' L' U2 F R2 B2 U2 D2 L2 F2 D2 F2 D R D B' U' Rw2 Uw'\nL2 U2 D2 B R L2 F U' R2 D2 L2 F' L2 U2 D R' D2 Fw Uw\nU2 B' D' B D' R2 U F2 U2 R2 D2 R' B2 D F R B L' F2 Rw Uw\nF' L D2 B2 R D2 L2 U2 B D' U F U L2 D' U L B' Uw2\nB2 U2 B' D2 L2 U2 R F2 L D2 B2 D' B' L2 F R' U2 F Rw Uw2\nU' L' B2 L' D2 B2 U F2 B U2 F' U2 D2 R2 F' L D2 B U Fw' Uw'\nD2 R' U' F' D F2 R2 B2 L2 U R2 D B L B2 D2 B' F R Fw Uw'\nD2 R2 L F' R2 U F2 D2 F R' U2 B2 R L' B2 U2 L D Fw Uw'\nF U B2 U' F2 R2 F2 R2 D' L2 F L' F2 U' B' R2 F2 R2 F' R Fw' Uw2\nL2 F L2 U' L2 R2 D' B2 F2 R2 D' F' R D B' D2 R' U' R B Rw\nD' F2 U L2 R2 D' R2 D2 R2 U2 B L D' R2 B' L' F2 R D' U' Fw\nB2 D' B2 U' L2 F2 U2 F2 D' U2 R' F2 U B2 F D' B2 F L' Fw'\nB' U L2 F U2 B2 R' F B2 D F2 L2 D2 B L2 U2 F' L2 F2 Rw2\nL2 F2 U2 R2 L U2 F U2 D L' F U2 L2 F R2 U2 F' R2 L2 Fw'\nU2 F2 L U L D' R' B' U F D2 F D2 B' L2 U2 B' R2 D2 F Rw2 Uw'\nF2 L2 D' L' D2 F' B L F2 U2 D' L2 D L2 F2 R2 D2 R' U2 R2 Fw Uw\nL' U2 L2 F2 D2 B2 U B2 D' L' F2 U' L F D F2 L' U' F' Rw'\nB2 U' B U' B2 U' L D2 F' U L' R2 D' R2 L2 F2 U' B2 L2 Uw\nR' L2 F U2 L2 B2 U2 R2 F D2 R2 F D' L2 B' R' D R' U' Rw\nF R' F' L2 F' D R2 U L2 F B2 R' B2 L2 F2 B2 L U Rw Uw'\nF2 R2 D2 B2 R2 F L2 R2 U2 R' U L2 B' R F' L2 U F D L Fw' Uw\nU2 L' B2 D' F2 L2 B2 R2 D2 F D' B F' L R' D' R' F' Rw Uw\nU R' B' U' D B' R2 U2 B2 R U L2 D2 F U2 B L2 F' U2 Fw Uw2\nB' D2 R' B' F2 R U2 B2 L' U2 R F2 B D2 L' D L2 R2 U2 Rw'\nD L' B U' R2 U2 F B' R' L2 D B2 U R2 U2 R2 D2 B2 U' L2 Fw Uw2\nD B2 F2 L2 B2 F2 L' D2 F2 U' R B L' U2 L' B2 L' D' F2 Rw\nB L' D' B2 L F' R2 F2 D B2 U2 R2 F2 L2 U R2 F L' U Fw Uw'\nF2 B2 L U2 R F B D U2 B2 R' L2 F2 L' U2 B2 U2 Rw Uw\nU2 F' L' R2 D' R2 D' B2 R2 F2 U B' L' D B' R' F2 U2 F2 Rw' Uw2\nU' B2 R U' F R' U' R' D2 F' B2 U2 B R2 B2 R U' F Rw",
								"L2 B2 D F2 U L2 U' F' U2 F2 U2 L2 D' R D F2 U2 R2 Fw' Uw'\nL U2 B' F U2 R2 F2 L2 F L2 R' F D2 F2 L D' U F L U' Fw'\nF' R' B L2 B U2 L2 F R2 U2 R U' F D' L' F' L B' U Fw Uw'\nR' U' L2 F L2 U2 R2 D2 B2 F2 D L U' L' B' L' B U F Rw Uw2\nB' L2 R2 F' D2 L2 F' L2 F2 L2 F' U2 L' B D2 B U B R D Rw2\nB U' D2 L2 D2 R' D2 U2 F2 L' U2 F2 D' U' F' L U' L2 B' F Uw2\nR L U2 L' D F' D' F2 D' F2 R2 B2 L2 D' B L2 U' Fw' Uw2\nL' D2 R B D2 B2 L2 D2 F' D2 B' U2 B R U R2 B R2 D U' Rw' Uw'\nD' L2 D2 F2 R' F' U B2 U2 F' B2 U2 F D' L' U L' Fw'\nF' D L' B' D2 F2 D2 B' D2 B U2 F' R' D U' F2 R' F2 D R Uw\nF' R2 D2 L2 D2 B2 F' R2 F2 R D R U B' D2 L' R' B' R' F Rw'\nF' D' F' D2 F' D2 U2 B' U2 F R' B2 R2 F2 L D' U B\nU F B' D' R D' F U R D2 F2 R2 L' U2 L' F2 R' D2 U' B' Rw Uw'\nF' B' D2 R L D L2 U F U2 R2 F2 U' D2 F2 U2 F L Fw' Uw'\nD' B' D2 R2 B2 D2 R2 U' L2 U R2 L' U F R B U L' R' Fw Uw\nR2 D2 R2 U D B2 R' U2 F' L D' R2 F' L2 F' B2 U2 D2 Fw\nB' R2 B' U2 L2 F2 L2 B L2 F L' R' F2 D L F' D U L2 F2 Rw2 Uw2\nF' D2 F' L2 F' L2 U2 R2 D B' R' F' L F U' B F2 L U' Fw' Uw2\nR' B2 L' F2 R2 U2 L F2 U2 R' U B D' R' D F L' U L U2 Fw Uw\nU F' D B U' D2 B L2 B R' L D2 F R2 L2 B' R2 L2 F2 Rw Uw\nU2 L2 F2 R F2 L' B2 L' U2 R2 F U B2 L2 F' U B2 F' R2 Uw2\nD R L2 U L2 B2 R2 F2 D2 R2 F2 R' D L2 B' D2 B U L2 F Rw Uw'\nR' B D' L R2 B2 U2 L2 D2 R2 F2 D2 R' U R' B' D U2 L2 Fw' Uw2\nL U2 B2 U2 L' D2 L B2 F' U2 L' U L' B L2 B' D B R2 Fw' Uw'\nR D F2 U' L B' R F U L' U' D2 B2 U2 D' F2 L2 F' Rw' Uw2\nF2 U2 B2 F2 R F2 D2 R D F U' F2 L2 U2 B2 R' U' L2 F' Rw2 Uw\nB2 U2 R2 U2 L2 B' F' U2 F2 D' R F2 L' B' F' U' B2 L' D2 R' Fw Uw2\nR' L2 D2 B2 R' B U F B2 D2 R' F U2 B' U2 L2 F2 Rw' Uw2\nD L U' B U' F2 U2 R' F2 D' B2 L2 U2 D' R2 U2 B' D' Rw' Uw\nL F2 B2 D2 R D B U' F' R D2 B2 U2 B2 R U2 R2 L' F2 Rw2 Uw\nR F' U2 F2 L2 D2 F2 R2 F' R F2 L U' R D U2 L D2 U' Rw Uw2\nF' D R' D B' R B' R2 D2 L2 D F2 R2 L2 B D' R2 B Uw2\nB2 U2 B2 U' R2 F2 U' B2 U2 L2 D' F' L2 U B' L B' D' R U2 Fw Uw'\nD' B' U2 F2 L D2 R' B2 F2 U2 L' D' F2 L2 U2 F' D' B D' Fw Uw2\nU B2 L D2 R B2 U2 R2 F2 R' B2 D2 U L2 B' D' L U2 B F' U Rw Uw'\nF2 R B2 R2 B2 U2 L U2 F' D2 U2 B' R D2 R F' U' F2 Rw'\nU B U' F L B2 L' F B2 R2 F2 B2 U' F2 R2 U' D' F2 Rw Uw\nU2 B' L2 F2 D R2 D' L2 R2 F2 U2 R' D' B2 D2 B2 R2 F D2 Rw\nD F' B2 U L2 F2 B2 U F' D F2 R2 F2 R2 U' L2 U' L U' Fw' Uw'\nF D L' B' D F2 U' L2 F B' L2 B' R2 L2 U' R2 F U' Fw Uw2\nB' D B' F' R2 D2 B R2 D2 R2 F2 R D' U' B' D2 F' L2 R Fw\nB U2 R U2 F2 D2 B2 R2 U2 L R2 F2 B' D' R2 D2 U B' L' Fw Uw\nF R D' F U L D L' F2 R' L' D2 B2 D' L2 U2 F2 U B2 Rw2 Uw'\nF R2 B2 L D2 F' D F2 U2 L2 U2 R2 F B2 L2 F' U' L' B\nR2 D' F D2 R' F2 L' U L2 D B' L2 B2 D2 L2 B' U2 B' L2 Uw'\nU' L2 U' F2 U' L2 U F2 D2 B2 U' B R B D' F2 L U' B2 L B Rw2\nF' L2 D2 F' D2 B2 U2 B' D2 L' D2 F' R' D' R2 B2 L F R' Fw'\nR U2 B2 D2 R2 F' D2 B' L2 B2 R2 L U2 L D2 F R U L2 Uw2\nR2 U' D' B2 L' F' B D' U2 F' B R2 B U2 B2 D2 L' D2 Rw2 Uw2\nL F U B' L2 B2 F U2 B' L2 F L' D F D U F2 L D2 Rw' Uw2\nF L F2 D' F U2 F' L2 F D2 L2 D2 F2 R' U2 L B' L2 B' D' Rw\nR' D' L D' B' L2 U2 F L2 F' U2 F2 R' B2 U' F2 L' U R2 Fw' Uw2\nU' R' D L D2 L2 F2 U' B' D' B2 D2 L2 D2 F' U2 D2 Rw Uw\nD' B F' L2 U2 B L2 B' R D2 F U2 L2 D R2 B2 L U2 Fw Uw2\nL2 D2 L2 F' D2 B U2 F' R' U2 L R2 B' U' F' L D B' R Fw' Uw\nB L2 D2 F2 U L2 D2 B2 U' F L2 U2 F' R' U2 F2 U L' B' Rw' Uw2\nU2 B' L2 R2 B F2 U2 F D L2 R B2 F' L' R2 U R B' L2 Fw Uw'\nR2 B D' B' R' B2 R2 U' L' R2 F D2 F' L2 F2 L2 F U2 L B2 Rw Uw2\nB' F2 R2 D2 U B2 U2 R2 B2 U' L U' B R B F2 D B2 F U' Fw Uw'\nD2 U' R2 F2 L2 B2 U F D' R' F' U' L' D' L2 B' F2 Uw2",
								"D' R B' D R' D' L B' D2 F U2 L2 F2 U2 F U2 F' R2 U L Uw\nL F2 D2 R2 B D' L B R F2 U2 F L2 F L2 D2 B U2 L2 D Fw Uw\nD R U' D B' L D' B' L U F2 R2 B2 U B2 D B2 D F Rw2 Uw\nF' D' R' F R2 U R2 F U' B U' B2 D' B2 U R2 U2 B2 D B2 Rw\nF2 R' L2 F U2 F' R2 U2 F2 U2 B2 U2 L B2 F U L D' F2 Uw'\nU' B2 D2 B2 U L2 B2 U' B2 U L2 F U B R2 B2 L' B2 U2 Rw2\nU R' B' L' D2 B' D' B2 D2 B U2 B R2 L2 B' D2 R2 D L2 Uw2\nB2 L2 R U2 B2 L2 R' B2 L2 U' R2 B F L' D2 B' L' R' F Rw2\nD2 B' U2 B2 F2 D' B2 D2 B2 U F' L B D' U' B L R' D2 Fw Uw\nR' F2 D U2 L' D2 R2 F2 R' D2 R U2 D' F L' D' B F D2 Rw Uw2\nB2 L2 R2 U2 L2 U' B2 D' U2 B2 L B R B2 F2 D R' F L' D Fw' Uw2\nR2 D2 F2 U2 B' F' D2 U2 F L' U R B' F' D2 L' F D2 B2 U' Fw' Uw2\nL2 B2 L2 D U' R2 D B' U2 R' F2 D2 F R2 F' D' F L U Rw2 Uw\nD' L2 B' R' L2 U2 L F2 B2 U R2 U' F2 R2 F2 B' R' B' L' Fw'\nL U R F2 R U2 R2 F D B R B2 D' L2 U' R2 D2 L2 U' Rw Uw\nR' B2 D' L U F2 L2 U' R' U F D2 L2 B D2 F L2 B' D2 Fw'\nD L B2 L' F L D' L U' F L' F2 D' F2 U2 R2 F2 R2 F2 U Rw Uw\nD U2 L2 B L2 R2 D2 R2 B L2 B L' B' D F' U' B2 D2 U2 Fw' Uw'\nU R F R' U2 R F2 D2 R U R' B U B' D2 R F' Rw'\nL' U B2 L2 D2 U' L2 F2 L2 B' D R' F U B F2 D R' D Fw Uw\nD R2 D L2 D2 U' R' F' D' U2 B R F2 L' D U' L F Rw' Uw'\nD' L' B' U R D F' D B' U R2 B2 U' B2 D2 B2 D' F2 R2\nU' R2 D' F2 L F' D R2 F2 R' D2 F2 R2 U2 D' R2 U' L2 U Rw\nU B D2 B R2 F' R L2 D2 F L2 D2 B U2 B' D' L2 B U' Rw'\nL' B' U F2 R D' R U F U B' L2 B' D2 F' L2 B R2 D2 Rw2\nL2 D2 B' R U F' U L' U B2 U L2 F2 D2 R2 D L U' F2 Rw2\nD' F2 D2 F U2 B U2 L2 U2 F' R' U2 L2 R U L2 B L' R' Fw Uw'\nR2 F' L' D L' U D2 B U' L B2 D2 L2 U' B2 U2 R2 B2 R2 D2 Rw' Uw'\nB L2 B' U' L U2 L B L' U2 D2 F2 R L U2 R' U F D Rw2 Uw\nL2 R2 B R2 F' U2 R2 L' F' L U F2 D2 B' D2 L' U B Rw Uw\nB2 L' F R D2 F2 U' D F' D' F2 R2 U2 B2 U2 L F Uw\nF2 U D B D R' D F U' L' F2 U2 B2 U2 R' L2 B2 U2 F2 U2 R' Fw' Uw2\nD B' L U2 D2 F' R2 F' R2 B' R D F2 R2 D2 F2 D L2 B2 Rw' Uw\nU2 B2 R' D B D R' B U2 D F' R2 F2 D2 L' F2 D2 B2 Uw2\nD' L2 F B2 L2 D F2 D F2 D F2 B U' F' U' B L' U F Rw' Uw'\nR2 F' U B2 D2 L' U2 F2 R U2 L F2 D2 U' L2 B2 F2 D' F L' Fw' Uw'\nL' R2 B2 U2 R B2 D2 U2 F2 D F U' L D' B' L2 U2 B' U2 Fw Uw\nF2 R2 F2 U L2 D2 U F' L R D U F' D L B' L D F' Uw\nU R F2 L' F' D' B' L D R' D R2 L2 B2 L2 U2 B U2 B' Uw2\nF L2 F' L F2 R' U F R F2 L2 F2 R B2 U2 R' F2 L U2 F' Rw' Uw'\nD2 L2 B2 D' R2 F2 D' L U' F' U F L F2 U2 L' U2 Rw' Uw\nD' B D2 B' R2 U2 L2 F2 D2 B' D B F L2 B' R U' B D Fw\nB' R' L U' R2 B L B2 R2 U' L2 F2 U L2 U2 B' R2 F U Fw' Uw'\nD' F D L' F D' F U2 R2 U' F2 R2 F2 D B' U R F2 Rw Uw\nB2 L U' F2 D2 L2 U' F2 D' L2 D' L' U' F2 U' B L' U' F R'\nB' U' R U B2 F2 L2 R2 D2 L2 D' R' D' L2 D B L' F2 D2 Rw2\nL F D L D' F2 R2 B U' R' B2 R' B2 R2 B2 L' U2 R' L' Fw' Uw2\nU2 B' D' R' U R B R D2 B' R2 U2 F R2 F L2 U2 F R2 Fw\nU2 B2 R2 B' U2 B L2 B' D2 F2 L' U L2 U R F' U L U' Rw2\nF' D2 L2 F' L2 B U2 F U2 D L' F' R' F R' U B' F' U' R2 Fw' Uw\nF' U' B' U2 F2 U R2 D' R2 U' F R' B R2 B L U2 F Rw' Uw\nD R' D2 L2 U2 R U2 L F2 B D R2 D L F' R2 D F' L Fw Uw2\nD L2 U' R2 D' F2 U' R F' U L' B U2 B2 F2 U B' L2 R' Fw' Uw'\nF' U2 L2 U2 B D2 F2 L2 D' B' U2 B' L2 D' B2 R F L' D' Rw' Uw'\nR F2 R D2 F2 L' R D2 R' U2 R U F R U R2 F2 R' U2\nD' B' L' U' L' B2 U2 L B2 D2 B2 L2 U F D R' F' U2 B Rw' Uw'\nU' F' D2 L2 U' B L' F D2 B2 R2 F R2 B' R2 D2 U' L2 U2 Fw'\nR' B' L B' L' U' D R D F2 U2 R2 F' R2 F2 D2 L2 F2 D2 F2 Rw2 Uw'\nF' U2 R U' L2 R2 U2 F2 D R2 D F' U R2 D2 U F' D' Fw'\nD B2 U2 L' F2 L' B2 R2 F2 U2 R B R2 F D L B' R' U Rw",
							],
							extraScrambles: [],
						},
					],
					extensions: [
						{
							id: 'org.worldcubeassociation.tnoodle.SheetCopyCount',
							specUrl: '',
							data: {
								numCopies: 1,
							},
						},
						{
							id: 'org.worldcubeassociation.tnoodle.MultiScrambleCount',
							specUrl: 'TODO',
							data: {
								requestedScrambles: 60,
							},
						},
					],
				},
			],
		},
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
			id: '555-r1',
			isOpen: false,
		},
		{
			id: '333oh-r1',
			isOpen: false,
		},
		{
			id: 'sq1-r1',
			isOpen: false,
		},
		{
			id: '333mbf-r1',
			isOpen: false,
		},
		{
			id: 'mirror-r1',
			isOpen: false,
		},
	],
	competitorCount: -1,
}
