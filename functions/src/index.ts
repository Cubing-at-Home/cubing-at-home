import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()
const db = admin.firestore()

import * as sgMail from '@sendgrid/mail'

const API_KEY = functions.config().sendgrid.key
const SEASON1_TEMPLATE_KEY = functions.config().sendgrid.season1_template_key

sgMail.setApiKey(API_KEY)

export const newRegistrant = functions.firestore
	.document('Users/{userId}/mails/s1')
	.onCreate(async (change, context) => {
		const userSnap = await db
			.collection('Users')
			.doc(context.params.userId)
			.get()
		const user = userSnap.data() || {}
		const msg: sgMail.MailDataRequired = {
			to: user.wca.email,
			from: 'sgrover@worldcubeassociation.org',
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
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
