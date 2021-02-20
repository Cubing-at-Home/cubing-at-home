import * as sgMail from '@sendgrid/mail'
import axios from 'axios'
import * as cors from 'cors'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp()
const db = admin.firestore()
const CORS = cors({ origin: true })
const API_KEY = functions.config().sendgrid.key
const SEASON1_TEMPLATE_KEY = functions.config().sendgrid.season1_template_key
const CHALLONGE_API_KEY = functions.config().challonge.key

sgMail.setApiKey(API_KEY)

export const newRegistrant = functions.firestore
	.document('Users/{userId}/mails/s2')
	.onCreate(async (change, context) => {
		const userSnap = await db
			.collection('Users')
			.doc(context.params.userId)
			.get()
		const user = userSnap.data() || {}
		const msg: sgMail.MailDataRequired = {
			to: user.wca.email,
			from: 'cubingathome@cubingusa.org',
			templateId: SEASON1_TEMPLATE_KEY,
			dynamicTemplateData: {
				name: user.wca.name.split(' ')[0] as string,
			},
		}
		return sgMail.send(msg)
	})
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.helloWorld = functions.https.onRequest((request, response) => {
	response.send('Hello from Firebase!')
})

// @ts-ignore
exports.createTournament = functions.https.onRequest(async (req, res) => {
	CORS(req, res, async () => {
		if (req.method === 'POST') {
			try {
				const tournament = await challongeApiPost(
					'tournaments.json',
					req.body
				)
				res.json(tournament)
			} catch (err) {
				console.log(err)
				res.status(500).send(err)
			}
		}
		res.status(400)
	})
})

exports.addParticipant = functions.https.onRequest(async (req, res) => {
	CORS(req, res, async () => {
		if (req.method === 'POST') {
			try {
				const participant = await challongeApiPost(
					`tournaments/${req.body.tournament}/participants.json`,
					req.body
				)
				res.json(participant)
			} catch (err) {
				console.log(err)
				res.status(500).send(err)
			}
		}
		res.status(400)
	})
})


const challongeApiPost = async (path: string, data = {}, opts = {}) => {
	const CHALLONGE_ORIGIN = 'https://api.challonge.com/v1/'
	const url = `${CHALLONGE_ORIGIN}${path}`
	try {
		const response = await axios.post(
			url,
			{ ...data, api_key: CHALLONGE_API_KEY }, // body data type must match "Content-Type" header
			{
				headers: {
					'Content-Type': 'application/json',
				},
				...opts,
			}
		)
		return response.data // parses JSON response into native JavaScript objects
	} catch (err) {
		throw err
	}
}
