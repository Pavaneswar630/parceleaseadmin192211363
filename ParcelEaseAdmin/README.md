# Parcel Ease Admin - React Native App

This is a React Native mobile application converted from the web-based Parcel Ease Admin panel. The app provides comprehensive parcel management functionality optimized for mobile devices.

## Features

- **Dashboard**: Overview of key metrics with interactive charts
- **Bookings Management**: View, search, and manage parcel bookings
- **User Management**: Manage customer accounts and profiles
- **Shipment Tracking**: Real-time tracking with timeline updates
- **Settings**: App configuration and user preferences

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation

1. Navigate to the project directory:
   ```bash
   cd ParcelEaseAdmin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go app on your mobile device

### Running on Specific Platforms

- **Android**: `npm run android`
- **iOS**: `npm run ios`
- **Web**: `npm run web`

## Project Structure

```
ParcelEaseAdmin/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Dashboard screen
│   │   ├── bookings.tsx   # Bookings management
│   │   ├── users.tsx      # User management
│   │   ├── tracking.tsx   # Shipment tracking
│   │   └── settings.tsx   # App settings
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── KpiCard.tsx       # Key performance indicator cards
│   ├── StatusBadge.tsx   # Status display component
│   └── LoadingSpinner.tsx # Loading indicator
├── constants/            # App constants
│   └── Colors.ts         # Color scheme
└── assets/              # Images and other assets
```

## Key Components

### Dashboard
- Real-time KPI cards showing key metrics
- Interactive charts for revenue trends
- Booking status distribution

### Bookings Management
- Search and filter bookings
- View detailed booking information
- Update booking status (Confirm/Cancel)
- Pull-to-refresh functionality

### User Management
- User list with search functionality
- User profile information
- Delete user functionality
- Activity tracking

### Shipment Tracking
- Real-time parcel tracking
- Timeline view of shipment updates
- Manual status updates
- Location tracking

### Settings
- User profile management
- App preferences (notifications, theme)
- System configuration
- Logout functionality

## API Integration

The app is designed to work with the existing backend API. Update the API endpoints in the respective screen files to connect to your server:

```typescript
// Example API call
const response = await fetch('YOUR_API_ENDPOINT/api/bookings');
const data = await response.json();
```

## Customization

### Colors
Modify the color scheme in `constants/Colors.ts`:

```typescript
export const Colors = {
  primary: '#0066FF',
  secondary: '#F5F7FA',
  // ... other colors
};
```

### Navigation
The app uses Expo Router for navigation. Modify the tab structure in `app/(tabs)/_layout.tsx`.

## Building for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

## Dependencies

- **Expo**: React Native framework
- **Expo Router**: File-based navigation
- **React Native Chart Kit**: Charts and graphs
- **React Native Vector Icons**: Icon library
- **React Native Paper**: UI components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both platforms
5. Submit a pull request

## Support

For support and questions, please contact the development team or create an issue in the repository.

## License

This project is licensed under the MIT License.