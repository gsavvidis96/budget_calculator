import admin from 'firebase-admin';
import { getAuth, connectAuthEmulator, signInWithCredential, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { initializeApp } from 'firebase/app';

const app = admin.initializeApp({
    projectId: "budget-calculator-ceba6"
});

initializeApp({
    apiKey: "AIzaSyAQJ6Azmsy7Uf6mb8BfNxaYMPM4lcQVlPg"
});

const auth = admin.auth(app);

const clientAuth = getAuth();
connectAuthEmulator(clientAuth, "http://localhost:9099");


const test = async () => {
    // await auth.importUsers([
    //     {
    //         uid: "HiWn1X16EfUnozK1wTpSRMz3xuk1",
    //         email: 'savvigiannhs@gmail.com',
    //         emailVerified: true,
    //         providerData: [
    //             {
    //                 uid: '116146797878503344072',
    //                 email: "gsavvidis96@gmail.com",
    //                 displayName: 'Giannis Savvidis',
    //                 providerId: 'google.com',
    //             }
    //         ]
    //     }
    // ])

    const googleUser = await signInWithCredential(clientAuth, GoogleAuthProvider.credential('{"sub": "123", "email": "xaxa@kleo.comm", "email_verified": true}'))

    const facebookUser = await signInWithCredential(clientAuth, FacebookAuthProvider.credential('{"sub": "345", "email": "kleo@xaxa.comm", "email_verified": true}'))

    const googleUserIdToken = await googleUser.user.getIdToken();
    const facebookUserIdToken = await facebookUser.user.getIdToken();

    const googleUserDecoded = await auth.verifyIdToken(googleUserIdToken);
    const facebookUserDecoded = await auth.verifyIdToken(facebookUserIdToken);

    console.log(googleUserDecoded);
    console.log(facebookUserDecoded);
}

test();

export { auth, clientAuth }

