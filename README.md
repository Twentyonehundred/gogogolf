# Dashboard

Personal web app launcher.

## Setup

```bash
npm install
npm run dev
```

## Adding Apps

Edit `config/apps.ts`:

```typescript
{
  name: 'App Name',
  url: 'https://app-url.com',
  description: 'Brief description',
  color: 'bg-blue-600', // Tailwind color class
  icon: 'AN', // 1-2 letter abbreviation
}
```

Available colors: `bg-blue-600`, `bg-green-600`, `bg-purple-600`, `bg-red-600`, `bg-orange-600`, `bg-pink-600`, `bg-indigo-600`, `bg-teal-600`
