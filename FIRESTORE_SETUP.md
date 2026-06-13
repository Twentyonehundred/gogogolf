# Firestore Security Rules Setup

You're getting a "permission-denied" error because Firestore security rules need to be configured.

## Quick Fix (Development Only)

**Option 1: Test Mode (Temporary - 30 days)**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `gogogolf-f435d`
3. Go to **Firestore Database**
4. Click the **Rules** tab
5. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. Click **Publish**

This allows any authenticated user to read/write (fine for personal use).

---

## Proper Setup (Recommended)

**Option 2: Deploy the Security Rules from Code**

1. Install Firebase CLI (if not already installed):
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in this project:
```bash
firebase init firestore
```
- Select your existing project: `gogogolf-f435d`
- Accept the default `firestore.rules` file
- Accept the default `firestore.indexes.json` file

4. Deploy the rules:
```bash
firebase deploy --only firestore:rules
```

---

## Current Rules Explanation

The `firestore.rules` file in this project ensures:
- Only authenticated users can access data
- Users can only read/write their own courses and rounds
- Data is isolated by `userId`

Once deployed, the permission errors will stop.
