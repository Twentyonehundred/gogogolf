# GoGoGolf

Personal golf score tracker with Firebase authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project (or use existing)
   - Enable **Google Authentication**: 
     - Go to Authentication > Sign-in method
     - Enable "Google" provider
   - Enable **Firestore Database**:
     - Go to Firestore Database
     - Click "Create database"
     - Start in test mode (or use the security rules from `firestore.rules`)

3. Configure Firebase:
   - In Firebase Console, go to Project Settings (gear icon)
   - Scroll down to "Your apps" and click the web icon (</>)
   - Copy your Firebase configuration object
   - Create `.env.local` (copy from `.env.example`)
   - Fill in your Firebase credentials in `.env.local`

4. Deploy Firestore Security Rules (optional but recommended):
   ```bash
   firebase deploy --only firestore:rules
   ```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Features

- **Google Authentication** - Secure sign-in to keep your data private
- **Course Management** - Add and track your local golf courses
- **Score Tracking** - Log scores hole-by-hole with quick number buttons
- **Running Totals** - See your total score and position vs par in real-time
- **Round History** - View all your past rounds at each course
- **Mobile Friendly** - Track scores on the course with your phone

## Usage

1. Sign in with your Google account
2. Add a golf course (name, par, holes)
3. Start a new round at any course
4. Enter scores for each hole as you play
5. View running totals and your score vs par
6. Complete the round when finished
7. Browse your round history on each course page
