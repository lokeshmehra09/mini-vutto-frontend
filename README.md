# Mini Vutto Frontend

A modern React-based frontend application for a bike marketplace platform. This application allows users to browse, search, and manage bike listings with a clean and responsive user interface.

## 🚀 Features

### For Buyers
- **Browse Bikes**: View all available bike listings with search and filter functionality
- **Search & Filter**: Filter bikes by brand, year, price range, and location
- **Bike Details**: View detailed information about each bike listing
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### For Sellers
- **My Listings**: Manage your own bike listings
- **Add New Bikes**: Create new bike listings with detailed information
- **Edit Listings**: Update existing bike information
- **Delete Listings**: Remove bikes from your listings
- **Seller Dashboard**: Dedicated interface for managing your inventory

### Authentication
- **User Registration**: Secure user registration with email verification
- **OTP Verification**: Two-factor authentication for enhanced security
- **Login/Logout**: Secure authentication system
- **Session Management**: Persistent login sessions with automatic token refresh

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Authentication**: JWT Tokens
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── OTPVerification.js
│   ├── Bikes/
│   │   ├── BikeCard.js
│   │   ├── BikeDetail.js
│   │   ├── BikeList.js
│   │   └── MyListings.js
│   └── Layout/
│       └── Navbar.js
├── context/
│   └── AuthContext.js
├── services/
│   └── api.js
├── utils/
│   └── tokenManager.js
└── App.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lokeshmehra09/mini-vutto-frontend.git
   cd mini-vutto-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## 🔧 Configuration

### API Configuration

The application is configured to connect to a backend API. Update the API base URL in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000'; // Change this to your backend URL
```

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## 📱 Features in Detail

### Bike Browsing
- **Grid Layout**: Responsive grid display of bike cards
- **Search Functionality**: Real-time search with debouncing
- **Advanced Filters**: Filter by brand, year, price range
- **Consistent UI**: Uniform card sizes and layout

### Authentication System
- **JWT Token Management**: Secure token storage and refresh
- **Session Persistence**: Users stay logged in across page refreshes
- **Role-based Access**: Different interfaces for buyers and sellers
- **Network Resilience**: Handles network issues gracefully

### Seller Features
- **Inventory Management**: Add, edit, and delete bike listings
- **Own Listings Filter**: Sellers don't see their own bikes in browse results
- **Quick Actions**: Easy access to manage listings

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Token Refresh**: Automatic token renewal
- **Input Validation**: Client-side form validation
- **Error Handling**: Graceful error handling and user feedback
- **Session Management**: Secure session persistence

## 🎨 UI/UX Features

- **Material Design**: Modern Material-UI components
- **Responsive Design**: Works on all device sizes
- **Hover Effects**: Interactive card animations
- **Loading States**: Proper loading indicators
- **Error Messages**: Clear error communication
- **Consistent Styling**: Uniform design language

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📦 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Lokesh Mehra**
- GitHub: [@lokeshmehra09](https://github.com/lokeshmehra09)

## 🙏 Acknowledgments

- Material-UI for the excellent component library
- React team for the amazing framework
- Create React App for the development setup

## 📞 Support

If you have any questions or need support, please open an issue on GitHub or contact the maintainer.

---

**Note**: This is a frontend application that requires a backend API to function properly. Make sure your backend server is running and accessible at the configured API URL.
