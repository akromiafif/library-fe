# 📚 Samsung Digital Library - Frontend

A modern, responsive frontend application for the Digital Library Management System built with **React 19**, **TypeScript**, **Material-UI**, and **Vite**.

## 🚀 Features

- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🎨 Material-UI**: Beautiful, consistent UI components with Material Design
- **⚡ Real-time Data**: Live updates with React Query for efficient data fetching
- **📊 Dashboard**: Interactive charts and statistics using ApexCharts
- **🔍 Advanced Search**: Multi-criteria search across books, authors, and members
- **📖 Book Management**: Complete CRUD operations with inventory tracking
- **👥 Member Management**: User-friendly member registration and profile management
- **📅 Due Date Tracking**: Visual indicators for overdue books and due dates
- **🔔 Notifications**: Real-time alerts for important library events
- **🌙 Modern UX**: Clean, intuitive interface with smooth animations

## 🏗️ Technology Stack

- **Framework**: React 19.1.0
- **Language**: TypeScript 5.8+
- **Build Tool**: Vite 6.2+
- **UI Framework**: Material-UI (MUI) 7.0+
- **State Management**: TanStack React Query 5.77+
- **HTTP Client**: Axios 1.9+
- **Routing**: React Router DOM 7.4+
- **Charts**: ApexCharts + React ApexCharts
- **Icons**: Iconify React
- **Fonts**: DM Sans Variable, Barlow
- **Date Handling**: Day.js
- **Styling**: Emotion (CSS-in-JS)

## 📦 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (Header, Footer, etc.)
│   ├── forms/          # Form components
│   └── charts/         # Chart components
├── pages/              # Page components
│   ├── dashboard/      # Dashboard page
│   ├── books/          # Book management pages
│   ├── authors/        # Author management pages
│   ├── members/        # Member management pages
│   └── borrowed/       # Borrowed books pages
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # Application constants
└── theme/              # MUI theme configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v20 or higher
- **Package Manager**: npm or yarn
- **Backend API**: Digital Library Backend running on port 5051

### 1. Clone Repository

```bash
git clone https://github.com/your-username/samsung-digital-library-frontend.git
cd samsung-digital-library-frontend
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5051/api
VITE_APP_NAME=Samsung Digital Library
VITE_APP_VERSION=3.0.0
```

### 4. Start Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

### 5. Access Application

- **Frontend**: http://localhost:3039
- **Backend API**: http://localhost:5051/api (must be running)

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Start the frontend
docker-compose up --build

# Run in background
docker-compose up --build -d

# Stop services
docker-compose down
```

### Manual Docker Commands

```bash
# Build image
docker build -t samsung-digital-library-frontend .

# Run container
docker run -p 3039:3039 samsung-digital-library-frontend
```

## 🛠️ Development Commands

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Check code formatting
npm run fm:check

# Format code
npm run fm:fix

# Fix all (lint + format)
npm run fix:all
```

### TypeScript

```bash
# Type checking with watch mode
npm run tsc:watch

# Development with type checking
npm run tsc:dev

# Show TypeScript configuration
npm run tsc:print
```

### Build & Clean

```bash
# Build for production
npm run build

# Preview production build
npm run start

# Clean all dependencies and builds
npm run clean

# Full rebuild (clean + install + dev)
npm run re:dev

# Full production rebuild
npm run re:build
```

## 🎨 UI Components & Features

### Dashboard

- **📊 Statistics Cards**: Total books, members, borrowings, overdue books
- **📈 Charts**: Borrowing trends, popular categories, member activity
- **📋 Recent Activity**: Latest borrowings, returns, and new registrations
- **⚠️ Alerts**: Overdue books, due today, low inventory warnings

### Book Management

- **📚 Book Catalog**: Grid and list views with search and filters
- **➕ Add/Edit Books**: Complete form with validation
- **🏷️ Category Management**: Organize books by categories
- **📦 Inventory Tracking**: Available/total copies management
- **🔍 Advanced Search**: Multi-field search with filters

### Author Management

- **👤 Author Profiles**: Detailed author information and biography
- **📖 Author's Books**: List of books by each author
- **🌍 Nationality Filter**: Filter authors by nationality
- **📅 Timeline View**: Authors by birth year/era

### Member Management

- **👥 Member Directory**: Searchable member list
- **📝 Registration**: New member signup with validation
- **📊 Member History**: Borrowing history and statistics
- **💰 Fine Management**: Outstanding fines and payment tracking

### Borrowing System

- **📖 Borrow Books**: Simple book borrowing interface
- **🔄 Return Process**: Easy book return with fine calculation
- **📅 Due Date Management**: Extend due dates, view overdue items
- **📊 Borrowing Statistics**: Personal and system-wide statistics

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5051/api
VITE_API_TIMEOUT=10000

# Application Settings
VITE_APP_NAME=Samsung Digital Library
VITE_APP_VERSION=3.0.0
VITE_APP_DESCRIPTION=Modern Digital Library Management System

# Features
VITE_ENABLE_DEV_TOOLS=true
VITE_ENABLE_QUERY_DEVTOOLS=true
VITE_DEFAULT_PAGE_SIZE=10
VITE_MAX_FILE_SIZE=10485760

# Theme
VITE_DEFAULT_THEME=light
VITE_PRIMARY_COLOR=#1976d2
VITE_SECONDARY_COLOR=#dc004e
```

### API Integration

The frontend communicates with the Digital Library Backend API:

```typescript
// API Base Configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Endpoints
const API_ENDPOINTS = {
  authors: '/authors',
  books: '/books',
  members: '/members',
  borrowedBooks: '/borrowed-books',
  dashboard: '/dashboard/stats',
};
```

## 📱 Responsive Design

### Breakpoints

- **xs**: 0px - 599px (Mobile)
- **sm**: 600px - 899px (Tablet)
- **md**: 900px - 1199px (Desktop)
- **lg**: 1200px - 1535px (Large Desktop)
- **xl**: 1536px+ (Extra Large)

### Mobile Features

- **🍔 Collapsible Navigation**: Hamburger menu for mobile
- **📱 Touch-Friendly**: Optimized touch targets and gestures
- **🔄 Pull-to-Refresh**: Native mobile refresh behavior
- **📋 Swipe Actions**: Swipe to edit/delete items

## 🎯 Performance Optimizations

### React Query Caching

```typescript
// Optimized data fetching with caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

### Code Splitting

- **Route-based**: Lazy loading for each page
- **Component-based**: Dynamic imports for heavy components
- **Vendor Splitting**: Separate chunks for third-party libraries

### Bundle Optimization

- **Tree Shaking**: Remove unused code
- **Minification**: Compressed production builds
- **Gzip Compression**: Reduced bundle sizes

## 🧪 Testing & Quality

### Code Quality Tools

- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Import Sorting**: Organized imports with perfectionist

### Testing Strategy

```bash
# Run tests (when implemented)
npm run test

# Test coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 🌐 Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run start
```

### Docker Production

```dockerfile
# Multi-stage production build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment-Specific Configs

```bash
# Development
npm run dev

# Staging
npm run build:staging

# Production
npm run build:prod
```

## 🔒 Security Features

- **🛡️ XSS Protection**: Sanitized user inputs
- **🔐 CORS Handling**: Proper cross-origin configuration
- **🌐 HTTPS Ready**: SSL/TLS support
- **🔒 Environment Variables**: Sensitive data protection

## 📊 Monitoring & Analytics

### Performance Monitoring

- **Web Vitals**: Core web vitals tracking
- **Bundle Analyzer**: Bundle size monitoring
- **Memory Usage**: React DevTools Profiler

### Error Handling

```typescript
// Global error boundary
const ErrorBoundary: React.FC = ({ children }) => {
  // Error handling logic
  return <ErrorFallback />;
};
```

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Install** dependencies: `npm install`
5. **Start** development server: `npm run dev`
6. **Make** your changes
7. **Lint** and format: `npm run fix:all`
8. **Test** your changes
9. **Commit** with conventional commits
10. **Push** and create a Pull Request

### Code Standards

- **TypeScript**: Strict type checking
- **ESLint**: Follow configured rules
- **Prettier**: Auto-formatting
- **Conventional Commits**: Structured commit messages

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Author**: techakromiafif.cc
- **Version**: 3.0.0
- **License**: MIT

## 📞 Support & Links

- **Frontend Repository**: [Samsung Digital Library Frontend](https://github.com/your-username/samsung-digital-library-frontend)
- **Backend Repository**: [Digital Library Backend](https://github.com/your-username/digital-library-backend)
- **Issues**: [Report Issues](https://github.com/your-username/samsung-digital-library-frontend/issues)
- **Documentation**: [Full Documentation](docs/README.md)

## 🚀 Quick Links

| Resource              | URL                                         |
| --------------------- | ------------------------------------------- |
| **Live Demo**         | https://samsung-digital-library.netlify.app |
| **API Documentation** | http://localhost:5051/api                   |
| **Storybook**         | https://storybook.samsung-library.com       |
| **Design System**     | https://figma.com/samsung-library-design    |

## 🎉 Acknowledgments

- **React Team**: For the amazing React 19 features
- **Material-UI**: For the beautiful component library
- **Vite Team**: For the lightning-fast build tool
- **TanStack**: For the excellent React Query library
- **Open Source Community**: For all the wonderful packages

---

**⭐ If you find this project helpful, please consider giving it a star!**

**🔗 Don't forget to star the [Backend Repository](https://github.com/your-username/digital-library-backend) too!**
