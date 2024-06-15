/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.orderStatusChangedNotification = functions.firestore
    .document('orders/{orderId}')
    .onUpdate((change, context) => {
        const orderId = context.params.orderId;
        const newData = change.after.data();
        const oldData = change.before.data();

        if (newData.status !== oldData.status) {
            const userId = newData.userId; // Assuming userId is stored in order document
            const message = `Your order with ID ${orderId} has a status change. New status: ${newData.status}`;

            return db.collection('notifications').add({
                userId: userId,
                message: message,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        return null;
    });

