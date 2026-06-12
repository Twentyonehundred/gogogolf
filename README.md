# GoGoGolf

Personal golf score tracker with Firebase authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Google Authentication in Authentication > Sign-in method
   - Enable Firestore Database

3. Configure Firebase:
   - Copy your Firebase config from Project Settings
   - Update `.env.local` with your Firebase credentials

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Features

- Google authentication
- Track golf courses
- Log scores per hole
- View score history
- Running total during rounds
