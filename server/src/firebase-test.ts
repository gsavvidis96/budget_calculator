import admin from 'firebase-admin';

const app = admin.initializeApp({
    projectId: "budget-calculator-ceba6"
});

const auth = admin.auth(app);

const test = async () => {
    const user = await auth.createUser({
        email: "xaxa@kleo.com",
        password: "123123"
    })

    console.log(user);
}

test();


export { auth }

