# 🚛 BharatTruck Driver App

The driver-facing mobile app for BharatTruck — a two-sided freight booking marketplace that connects truck drivers with shippers across India.

---

## What This App Does

This is the app used by **truck drivers**. With this app, a driver can:

- Register and log in to their driver account
- Browse all available truck booking jobs
- See pickup and drop locations, cargo details, and shipper contact
- Accept jobs with one tap
- Update trip status — Start Trip, Mark Delivered
- View all their current and past jobs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native with Expo |
| Navigation | Expo Router (file-based routing) |
| HTTP Client | Axios |
| Local Storage | AsyncStorage |
| Build System | EAS Build (Expo Application Services) |
| Backend | BharatTruck Backend API on Railway |

---

## Related Repositories

| Repo | Description |
|---|---|
| [bharattruck-backend](https://github.com/deltaos1997/bharattruck-backend) | Node.js + Fastify backend API |
| [bharattruck-shipper](https://github.com/deltaos1997/bharattruck-shipper) | Shipper mobile app |
| [bharattruck-driver](https://github.com/deltaos1997/bharattruck-driver) | This repo — driver mobile app |

---

## Project Structure

```
bharattruck-driver/
├── app/
│   ├── _layout.tsx          # Root layout — handles auth routing
│   ├── login.tsx            # Login screen
│   ├── register.tsx         # Registration screen
│   └── (tabs)/
│       ├── _layout.tsx      # Tab layout
│       └── index.tsx        # Home screen — available jobs + my jobs
├── src/
│   ├── context/
│   │   └── AuthContext.tsx  # Login state management
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── HomeScreen.tsx
│   └── services/
│       └── api.ts           # All API calls to the backend
├── assets/
│   └── images/              # App icons and splash screen
├── app.json                 # Expo app configuration
└── eas.json                 # EAS Build configuration
```

---

## Screens

| Screen | Description |
|---|---|
| Login | Enter email to log in |
| Register | Create a new driver account with truck details |
| Home — Available | Browse all pending jobs posted by shippers |
| Home — My Jobs | View accepted jobs and update trip status |

---

## Trip Status Flow

```
pending → accepted → in_progress → completed
```

| Action | Who | What happens |
|---|---|---|
| Accept job | Driver | Status changes from pending to accepted |
| Start Trip | Driver | Status changes to in_progress, pickup time recorded |
| Mark Delivered | Driver | Status changes to completed, delivery time recorded |

---

## Getting Started Locally

### Prerequisites
- Node.js v18 or higher
- Expo CLI
- EAS CLI

### 1. Clone the repo
```bash
git clone https://github.com/deltaos1997/bharattruck-driver.git
cd bharattruck-driver
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run in development
```bash
npx expo start
```

---

## Building the APK

```bash
eas build --platform android --profile preview
```

This takes about 10-15 minutes. When done, you get a download link for the APK.

---

## Development Roadmap

- [x] Driver registration with truck details
- [x] JWT authentication with persistent sessions
- [x] Browse available jobs
- [x] Accept bookings with one tap
- [x] Update trip status — start and complete
- [x] EAS Build — real Android APK
- [x] Connected to Railway backend
- [ ] Real-time GPS location sharing
- [ ] Push notifications for new jobs
- [ ] In-app chat with shipper
- [ ] Earnings dashboard
- [ ] Rating system after delivery

---

## License

Private — all rights reserved.
