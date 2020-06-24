"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRegistrant = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const sgMail = require("@sendgrid/mail");
exports.newRegistrant = functions.firestore
    .document('Users/{userId}/mails/s1')
    .onCreate(async (change, context) => {
    const API_KEY = functions.config().sendgrid.key;
    const SEASON1_TEMPLATE_KEY = functions.config().sendgrid
        .season1_template_key;
    console.log(API_KEY);
    console.log(SEASON1_TEMPLATE_KEY);
    sgMail.setApiKey('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');
    const userSnap = await db
        .collection('Users')
        .doc(context.params.userId)
        .get();
    const user = userSnap.data() || {};
    const msg = {
        to: user.wca.email,
        from: 'sgrover@worldcubeassociation.org',
        templateId: 'd-5e479460316a4b98b191a29e97a3697b',
        dynamicTemplateData: {
            name: user.wca.name.split(' ')[0],
        },
    };
    return sgMail.send(msg);
});
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//# sourceMappingURL=index.js.map