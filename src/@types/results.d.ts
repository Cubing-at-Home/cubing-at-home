interface Round {
	id: string
	isOpen: boolean
	results?: Result[]
	format: '1' | '2' | '3' | 'a' | 'm'
	timeLimit: any
	cutoff: any
	adveancementCondition: any
	scrambleSetCount: number
	scrambleSets: ScrambleSet[]
}

interface Result {
	attempts: number[]
	average?: number
	best?: number
	name: string
	personId: string
	ranking?: number
	isStarted: boolean
	isSubmitted?: boolean
	lastUpdated: number
	videoURL?: string
	hasPrivateVideo?: boolean
	flagged: {
		isFlagged: boolean
		reason?: string
	}
}

interface FMCResult extends Result {
	attemptInfo: AttemptInfo[]
	solutionUrl?: string[]
}

interface AttemptInfo {
	started: boolean
	startedAt: number
}

interface ScrambleSet {
	id: number
	scrambles: string[]
	extraScrambles: string[]
}
