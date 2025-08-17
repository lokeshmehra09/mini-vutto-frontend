# 🚴‍♂️ Mini Vutto - Used Bike Marketplace

A modern, responsive React-based frontend application for a used bike marketplace platform. Built with Material-UI, React Router, and modern React patterns, this application provides a seamless user experience for browsing, listing, and managing bike listings.

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration** with First Name (optional) and Last Name (required)
- **Role-based Access Control** - Choose between Buyer (customer) and Seller roles
- **Secure Login/Logout** with JWT token management
- **OTP Verification** for enhanced security during registration
- **Protected Routes** based on authentication status and user role

### 🚲 Bike Management
- **Browse Bike Listings** with advanced search and filtering
- **Add New Bikes** through an intuitive modal dialog
- **Edit & Delete Listings** for sellers managing their inventory
- **Bike Details** with comprehensive information display
- **My Listings** dashboard for sellers to manage their bikes

### 🎨 User Experience
- **Responsive Design** that works on all device sizes
- **Material-UI Components** for consistent, modern aesthetics
- **Real-time Updates** - bike list refreshes automatically after changes
- **Intuitive Navigation** with role-based menu options
- **Search & Filtering** by brand, model, year, price, and location

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.2.0** - Modern React with hooks and functional components
- **React Router DOM 7.8.0** - Client-side routing and navigation
- **React Scripts 5.0.1** - Create React App build tools

### UI Framework & Styling
- **Material-UI (MUI) 7.3.1** - Google's Material Design component library
- **Emotion** - CSS-in-JS styling solution
- **MUI Icons** - Comprehensive icon library

### State Management & Data
- **React Context API** - Global state management for authentication
- **Axios 1.11.0** - HTTP client for API communication
- **Local Storage** - Client-side token and user data persistence

### Development Tools
- **ESLint** - Code quality and consistency
- **Create React App** - Zero-configuration build setup

## 📁 Project Structure

```
mini-vutto-frontend/
├── public/                     # Static assets
│   ├── index.html             # Main HTML template
│   └── manifest.json          # PWA manifest
├── src/                       # Source code
│   ├── components/            # React components
│   │   ├── Auth/             # Authentication components
│   │   │   ├── Login.js      # User login form
│   │   │   ├── Register.js   # User registration form
│   │   │   └── OTPVerification.js # OTP verification
│   │   ├── Bikes/            # Bike-related components
│   │   │   ├── BikeList.js   # Main bike browsing page
│   │   │   ├── BikeCard.js   # Individual bike card
│   │   │   ├── BikeDetail.js # Detailed bike view
│   │   │   └── MyListings.js # Seller's bike management
│   │   └── Layout/           # Layout components
│   │       └── Navbar.js     # Navigation bar
│   ├── context/              # React Context providers
│   │   └── AuthContext.js    # Authentication state management
│   ├── services/             # API services
│   │   └── api.js           # HTTP client configuration
│   ├── utils/                # Utility functions
│   │   └── tokenManager.js   # JWT token management
│   ├── App.js               # Main application component
│   └── index.js             # Application entry point
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **Backend API** running and accessible

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mini-vutto-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```
   
   **Note**: Replace with your actual backend API URL

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000` | Yes |

### API Configuration

The application expects a backend API with the following endpoints:

#### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

#### Bike Endpoints
- `GET /bikes` - Get all bikes (with search/filtering)
- `GET /bikes/:id` - Get specific bike details
- `POST /bikes` - Create new bike listing
- `PUT /bikes/:id` - Update bike listing
- `DELETE /bikes/:id` - Delete bike listing
- `GET /bikes/my/listings` - Get user's own listings

#### User Endpoints
- `GET /profile` - Get user profile
- `PUT /auth/users/:id` - Update user information

## 🎯 Implementation Approach

### Architecture Design

The application follows a **component-based architecture** with clear separation of concerns:

1. **Component Layer**: Reusable UI components organized by feature
2. **Context Layer**: Global state management using React Context
3. **Service Layer**: API communication and data fetching
4. **Utility Layer**: Helper functions and utilities

### State Management Strategy

- **Local State**: Component-specific state using React hooks
- **Global State**: Authentication and user data via React Context
- **Persistent State**: JWT tokens and user data in localStorage
- **Real-time Updates**: Automatic refresh of bike listings after changes

### Authentication Flow

1. **Registration**: User fills form → API call → OTP verification → Account creation
2. **Login**: User credentials → API validation → JWT token storage → Route protection
3. **Route Protection**: Check authentication status → Redirect if unauthorized
4. **Token Management**: Automatic token validation and refresh

### User Experience Features

- **Progressive Enhancement**: Core functionality works without JavaScript
- **Responsive Design**: Mobile-first approach with Material-UI breakpoints
- **Accessibility**: Semantic HTML and ARIA labels
- **Performance**: Lazy loading and optimized re-renders

## 🎨 UI/UX Design Principles

### Material Design
- **Consistent Components**: All UI elements follow Material Design guidelines
- **Visual Hierarchy**: Clear information architecture and typography
- **Interactive Feedback**: Hover states, loading indicators, and animations
- **Color System**: Accessible color palette with primary/secondary themes

### Responsive Layout
- **Mobile-First**: Designed for mobile devices first, then enhanced for larger screens
- **Flexible Grid**: CSS Grid and Flexbox for adaptive layouts
- **Touch-Friendly**: Appropriate touch targets and gesture support
- **Cross-Platform**: Consistent experience across all devices

## 🔒 Security Features

### Authentication Security
- **JWT Tokens**: Secure, stateless authentication
- **Token Expiration**: Automatic token validation and refresh
- **Route Protection**: Protected routes based on authentication status
- **Role-Based Access**: Different permissions for buyers and sellers

### Data Security
- **HTTPS Only**: Secure communication with backend API
- **Input Validation**: Client-side validation for all form inputs
- **XSS Protection**: Sanitized data rendering
- **CSRF Protection**: Token-based request validation

## 📱 Component Architecture

### Authentication Components

#### Login Component
- Form validation and error handling
- Remember me functionality
- Automatic redirect after successful login

#### Register Component
- Multi-step registration with OTP verification
- Role selection (Buyer/Seller)
- Form validation and error display

#### OTP Verification
- 6-digit OTP input with auto-focus
- Countdown timer for resend functionality
- Automatic navigation after verification

### Bike Management Components

#### BikeList Component
- Advanced search and filtering
- Responsive grid layout
- Add bike functionality for sellers
- Real-time updates after changes

#### BikeCard Component
- Compact bike information display
- Action menu for sellers
- Responsive image handling
- Click navigation to details

#### BikeDetail Component
- Comprehensive bike information
- Seller contact details
- Image gallery support
- Edit/delete actions for owners

## 🚀 Available Scripts

### Development
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run test suite
npm run eject      # Eject from Create React App
```

### Production
```bash
npm run build      # Create optimized production build
npm start          # Start production server (if configured)
```

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Configure environment variables

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
- **Node Version**: Ensure you're using Node.js 16+
- **Dependencies**: Delete `node_modules` and run `npm install`
- **Environment Variables**: Check `.env` file configuration

#### Runtime Errors
- **API Connection**: Verify backend API is running and accessible
- **CORS Issues**: Check backend CORS configuration
- **Authentication**: Clear localStorage and re-login

#### Performance Issues
- **Bundle Size**: Check for large dependencies
- **Re-renders**: Optimize component memoization
- **API Calls**: Implement proper caching strategies

### Debug Steps
1. Check browser console for error messages
2. Verify environment variables are loaded
3. Test API endpoints directly
4. Check network tab for failed requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and hooks patterns
- Use Material-UI components consistently
- Maintain responsive design principles
- Write clean, readable code with proper comments

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the component documentation

## 🔮 Future Enhancements

### Planned Features
- **Real-time Chat**: Direct messaging between buyers and sellers
- **Push Notifications**: Browser notifications for new listings
- **Advanced Analytics**: User behavior and listing performance metrics
- **Mobile App**: React Native version for mobile platforms
- **Payment Integration**: Secure payment processing for bike purchases

### Technical Improvements
- **TypeScript Migration**: Add type safety to the codebase
- **Testing Suite**: Comprehensive unit and integration tests
- **Performance Optimization**: Code splitting and lazy loading
- **PWA Features**: Offline support and app-like experience

---

