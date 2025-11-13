# 🎛️ Tangerine Furniture - Admin Dashboard

Modern React admin dashboard built with Vite, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:5173
```

## 🔑 Demo Login

Use any email and password to login (demo mode).

## 📦 Features

- ✅ React 18 + TypeScript
- ✅ Vite for fast development
- ✅ Tailwind CSS styling
- ✅ React Router v6
- ✅ React Query for data fetching
- ✅ Recharts for analytics
- ✅ Responsive design
- ✅ Hot reload

## 📁 Structure

```
src/
├── components/
│   └── Layout.tsx          # Main layout with sidebar
├── pages/
│   ├── Dashboard.tsx       # Main dashboard with stats
│   ├── Products/           # Product management
│   ├── Orders/             # Order management
│   ├── AI/                 # AI chatbot management
│   └── Login.tsx           # Authentication
├── App.tsx                 # Routes configuration
└── main.tsx                # Entry point
```

## 🎨 Pages

- **Dashboard** - Overview with stats and charts
- **Products** - Product CRUD operations
- **Orders** - Order management
- **Customers** - Customer database
- **Analytics** - Advanced analytics (coming soon)
- **AI Training** - Chatbot configuration (coming soon)
- **Settings** - System configuration (coming soon)

## 🔄 API Integration

Connect to backend API:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
```

## 🏗️ Build for Production

```bash
npm run build
```

Output in `dist/` directory.

