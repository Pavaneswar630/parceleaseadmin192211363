# Parcel Ease Mobile - React Native App with Server Integration

This is a React Native mobile application that connects to your existing server.js backend. The app provides comprehensive parcel management functionality optimized for mobile devices with real-time data from your MySQL database.

## 🚀 Features

### **📱 Real Server Integration**
- **Live API Connection**: Connects to your existing server.js backend
- **MySQL Database**: Real data from your parcelease database
- **Real-time Updates**: Pull-to-refresh functionality
- **Error Handling**: Comprehensive error handling and user feedback

### **📊 Dashboard**
- **Live KPI Data**: Real metrics from `/api/dashboard/kpis`
- **Revenue Charts**: Weekly revenue comparison from `/api/dashboard/revenue`
- **Booking Analytics**: Real booking status distribution
- **Recent Activity**: Latest bookings from your database

### **📦 Bookings Management**
- **Real Bookings**: Data from `/api/bookings`
- **Search & Filter**: Find bookings by ID, location, or type
- **Status Updates**: Confirm/Cancel bookings via API
- **Detailed Views**: Complete booking information

### **👥 User Management**
- **Live User Data**: From `/api/users` with booking counts
- **Search Users**: Find users by name, email, or phone
- **Delete Users**: Remove users with confirmation
- **User Statistics**: Join date and booking activity

### **🚛 Shipment Tracking**
- **Real Parcel Data**: From `/api/parcel/:parcelId`
- **Timeline Tracking**: From `/api/parcel_timeline/:parcelId`
- **Update Tracking**: Add new tracking updates via API
- **Detailed Info**: Sender, receiver, weight, amount details

## 🛠 **Setup Instructions**

### **1. Prerequisites**
- Node.js (v16 or later)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device
- Your existing server.js running on port 4000

### **2. Installation**
```bash
cd ParcelEaseMobile
npm install
```

### **3. Configure API Connection**

**For Local Development (Simulator):**
```typescript
// In services/api.ts
const API_BASE_URL = 'http://localhost:4000';
```

**For Physical Device Testing:**
```typescript
// In services/api.ts
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:4000';
// Example: 'http://192.168.1.100:4000'
```

To find your computer's IP address:
- **Windows**: `ipconfig` (look for IPv4 Address)
- **Mac/Linux**: `ifconfig` (look for inet address)

### **4. Start Your Backend Server**
```bash
# In your original project directory
node server.js
```
Make sure your server is running on port 4000 and accessible.

### **5. Start the Mobile App**
```bash
npm start
```

### **6. Test on Device**
- Scan the QR code with Expo Go app
- The app will connect to your server and load real data

## 📱 **API Endpoints Used**

The app connects to these endpoints from your server.js:

### **Dashboard**
- `GET /api/dashboard/kpis` - KPI metrics
- `GET /api/dashboard/revenue` - Revenue chart data

### **Bookings**
- `GET /api/bookings` - All bookings
- `PUT /api/bookings/:id/confirm` - Confirm booking
- `PUT /api/bookings/:id/cancel` - Cancel booking

### **Users**
- `GET /api/users` - All users with booking counts
- `DELETE /api/users/:id` - Delete user

### **Tracking**
- `GET /api/parcel/:parcelId` - Parcel details
- `GET /api/parcel_timeline/:parcelId` - Tracking timeline
- `POST /api/parcel_timeline` - Add tracking update

### **Additional**
- `GET /api/incity-bookings` - In-city bookings
- `GET /api/payments` - Payment transactions
- `GET /api/support-tickets` - Support tickets

## 🎨 **App Structure**

```
ParcelEaseMobile/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Dashboard with real KPIs & charts
│   │   ├── bookings.tsx       # Bookings management
│   │   ├── users.tsx          # User management
│   │   ├── tracking.tsx       # Shipment tracking
│   │   └── settings.tsx       # App settings
│   └── _layout.tsx
├── services/
│   └── api.ts                 # API service with all endpoints
├── components/
│   ├── KpiCard.tsx           # Dashboard KPI cards
│   ├── StatusBadge.tsx       # Status indicators
│   └── LoadingSpinner.tsx    # Loading states
└── constants/
    └── Colors.ts             # App color scheme
```

## 🔧 **Key Features**

### **Real-time Data**
- All data comes from your MySQL database
- Pull-to-refresh on all screens
- Automatic error handling for network issues

### **Mobile Optimized**
- Touch-friendly interface
- Responsive design for all screen sizes
- Native mobile components and interactions

### **Offline Handling**
- Graceful error messages when server is unavailable
- Loading states for all API calls
- Retry mechanisms for failed requests

## 🚀 **Testing**

### **1. Test Server Connection**
1. Start your server: `node server.js`
2. Test in browser: `http://localhost:4000/api/users`
3. Should return JSON data from your database

### **2. Test Mobile App**
1. Start the app: `npm start`
2. Open on device with Expo Go
3. Check if dashboard loads with real data
4. Test all features (bookings, users, tracking)

### **3. Test API Calls**
- Dashboard should show real KPI data
- Bookings should list actual parcels from database
- Users should show real user accounts
- Tracking should work with actual parcel IDs

## 🔧 **Troubleshooting**

### **Connection Issues**
- Ensure server.js is running on port 4000
- Check firewall settings for mobile device access
- Verify IP address in api.ts is correct
- Test API endpoints in browser first

### **CORS Issues**
Your server.js already has CORS enabled, but if you encounter issues:
```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### **Database Connection**
- Ensure MySQL is running
- Check database credentials in server.js
- Verify tables exist and have data

## 📱 **Building for Production**

### **Android**
```bash
expo build:android
```

### **iOS**
```bash
expo build:ios
```

## 🎯 **Next Steps**

1. **Test thoroughly** with your real data
2. **Customize styling** to match your brand
3. **Add authentication** if needed
4. **Deploy server** to production
5. **Update API URLs** for production

The app is now fully integrated with your existing backend and ready for production use! 🎉