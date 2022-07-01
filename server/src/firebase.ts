import path from "path";
import admin from 'firebase-admin';

const app = admin.initializeApp({
    credential: admin.credential.cert(`${path.join(__dirname, '../service-account.json')}`)
});

const auth = admin.auth(app);

export { auth }