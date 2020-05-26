export const text = {}

export const rounds = [
	{
		id: '',
		name: 'Welcome',
		start: '11:00',
		end: '11:10',
		qualification: '',
	},
	{
		id: '222',
		name: '2x2 Final',
		start: '11:10',
		end: '11:35',
		qualification: '',
	},
	{
		id: '333mbf',
		name: '3x3 Multiple Blindfolded Final',
		start: '11:10',
		end: '12:30',
		qualification: '',
	},
	{
		id: 'pyram',
		name: 'Pyraminx Final ',
		start: '11:20',
		end: '11:55',
		qualification: '',
	},
	{
		id: '333',
		name: '3x3 Round 1',
		start: '12:30',
		end: '12:55',
		qualification: '',
	},
	{
		id: 'minx',
		name: 'Megaminx Final',
		start: '12:55',
		end: '13:25',
		qualification: '',
	},
	{
		id: '666',
		name: '6x6 Final',
		start: '13:25',
		end: '13:50',
		qualification: '',
	},
	{
		id: '333',
		name: '3x3 Final (Bracket Style)',
		start: '13:50',
		end: '14:50',
		qualification: 'Top 8',
	},
	{
		id: '',
		name: 'Awards',
		start: '14:50',
		end: '15:00',
		qualification: '',
	},
]

export const faq = {
	title: 'Frequently asked Questions',
	rows: [
		{
			title:
				'Is this competition official? Will the results be on my WCA Account?',
			content:
				'Cubing At Home is not an official WCA Competition. All results are unofficial and are not tracked or recognized by the WCA',
		},
		{
			title: 'Can I listen to music? Do I have to follow X WCA Regulation?',
			content:
				'We recommend that you follow WCA Regulations as close as possible. This means that you may not listen to music while solving.',
		},
		{
			title:
				'Am I registered for everything? Do I need to register for a specific event?',
			content:
				' You are registered for all events, if you plan on not competing in an event then just dont enter results for it',
		},
		{
			title: 'Do I need to film all my solves?',
			content:
				"You only need to film to claim a prize for podiuming or making it into Finals (Top 8)! If you don't think you will podium or make finals then there is no need to film",
		},
		{
			title: 'How am I supposed to time my solves? Keep track of inspection?',
			content:
				' We recommend using a stackmat to time solves but you can feel free to use any website or app to keep track of time. To keep track of inspection you can use built in app or timer features on your timer or alternatively you can go to https://cubing.net/inspection/',
		},
		{
			title: "Can I still compete if I don't know how to scramble?",
			content:
				"We require competitors to know how to scramble events they compete in. If you do not know how to scramble an event, please make sure to learn it. <a href='https://www.youtube.com/watch?v=QZ3jOJ6VKdw'>Here </a> is a good resource for learning notation and scrambling for most events.",
		},

		{
			title: 'Where will I submit my times?',
			content:
				"You will submit your times using a google form which can be found on the <a href='/scrambles'>scrambles</a> page",
		},
		{
			title: 'Where do I submit videos if I podium?',
			content:
				"We will reach out to you to get videos. Please make sure to be active on the <a href='/cubing-at-home-I/discord'>discord </a>",
		},
	],
}

export const admins = [
	'2008SAMP01',
	'2014NIEL03',
	'2016BAIR01',
	'2014GROV01',
	'2012ELLI01',
	'2016GRIT01',
	'2017RICH02',
	'2014SHIE03',
	'2017MILL04',
	'2019KELL11',
	'2015MCKE02',
	'2018SAMP01',
]

export const activityKey = {
	'222': '2x2x2',
	'333': '3x3x3',
	'444': '4x4x4',
	'555': '5x5x5',
	'666': '6x6x6',
	'777': '7x7x7',
	pyram: 'Pyraminx',
	'333oh': '3x3x3 One Handed',
	'333bf': '3x3x3 Blindfolded',
	'4bld': '4x4x4 Blindfolded',
	skewb: 'Skewb',
	clock: 'Clock',
	'333ft': '3x3x3 with Feet',
	'333mbf': '3x3x3 Multiple Blindfolded',
	'333fm': 'Fewest Moves',
	sq1: 'Square 1',
	minx: 'Megaminx',
}

export const TIER_KEY = {
	'222': 2,
	'333': 1,
	'444': 2,
	'555': 2,
	'666': 3,
	'777': 3,
	pyram: 2,
	'333oh': 2,
	'333bf': 2,
	'4bld': 3,
	skewb: 2,
	clock: 3,
	'333ft': 3,
	'333mbf': 3,
	'333fm': 3,
	sq1: 2,
	minx: 2,
}

export const LEADERBOARD_POINTS = {
	PARTICIPATION: 10,
	RANKING: {
		1: 70,
		2: 55,
		3: 30,
	},
	PODIUM: {
		1: 80,
		2: 65,
		3: 40,
	},
	WIN: {
		1: 100,
		2: 75,
		3: 50,
	},
	WR: {
		1: 250,
		2: 200,
		3: 150,
	},
	BEST_EVER: {
		1: 200,
	},
	BEST_COMPETITION: {
		1: 75,
		2: 50,
		3: 25,
	},
}
