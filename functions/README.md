This folder contains example Firebase Cloud Functions for the CareNexus project.

Quick start:
1. Install Firebase CLI: https://firebase.google.com/docs/cli
2. Login: firebase login
3. Initialize functions (if not already): firebase init functions
4. Install dependencies: npm install
5. Emulate locally: npm run serve
6. Deploy: npm run deploy

Included functions:
- echo (callable)
- helloWorld (HTTP endpoint)
- onUserCreate (auth trigger)
- dailyJob (scheduled Pub/Sub)
 - submitVolunteerSignup (callable) - add a volunteer signup to Firestore

Notes:
- Use Node 18 runtime as specified in package.json engines.
- Use Firestore for server-side data operations via firebase-admin.

submitVolunteerSignup (callable)
--------------------------------
Usage (client):

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';
const functions = getFunctions();
const submitSignup = httpsCallable(functions, 'submitVolunteerSignup');
const resp = await submitSignup({ name: 'Alice', email: 'a@a.com', activityId: 'v1', message: 'I can help' });
console.log(resp.data);
```

The function will write a document to `volunteerSignups` with `createdAt` server timestamp and `processed: false`.

Local testing with emulator:
- Start the functions emulator: `npm run serve` inside `functions/` folder.
- Configure your frontend to point to emulator using `connectFunctionsEmulator(functions, 'localhost', 5001)` when in dev.

