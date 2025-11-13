# Role-Based Access Control (RBAC) Guide

## Overview

This document explains the Role-Based Access Control (RBAC) system implemented in the Tangerine Furniture e-commerce platform. The system provides granular permissions for three user roles: **Customer**, **Admin**, and **Superadmin**.

---

## 🔐 User Roles

### 1. **Customer** 
Regular users who can browse products and make purchases.

**Key Permissions:**
- View products
- Manage own cart
- View and cancel own orders
- View and update own profile

### 2. **Admin**
Store managers who can manage products, orders, and customers.

**Key Permissions:**
- All customer permissions
- Create, update, and delete products
- Manage categories
- View and update all orders
- View and manage customer information
- Access analytics and sales reports

### 3. **Superadmin**
Full system access including admin user management.

**Key Permissions:**
- All admin permissions
- Create, update, and delete admin users
- Manage user roles
- View system logs
- Manage chatbot settings
- Full customer management (including deletion)

---

## 📋 Permission Matrix

| Permission | Customer | Admin | Superadmin |
|------------|----------|-------|------------|
| **Products** |
| View Products | ✅ | ✅ | ✅ |
| Create Products | ❌ | ✅ | ✅ |
| Update Products | ❌ | ✅ | ✅ |
| Delete Products | ❌ | ✅ | ✅ |
| **Categories** |
| View Categories | ✅ | ✅ | ✅ |
| Create Categories | ❌ | ✅ | ✅ |
| Update Categories | ❌ | ✅ | ✅ |
| Delete Categories | ❌ | ✅ | ✅ |
| **Orders** |
| View Own Orders | ✅ | ✅ | ✅ |
| View All Orders | ❌ | ✅ | ✅ |
| Cancel Own Order | ✅ | ✅ | ✅ |
| Update Order Status | ❌ | ✅ | ✅ |
| Process Refunds | ❌ | ✅ | ✅ |
| **Customers** |
| View Own Profile | ✅ | ✅ | ✅ |
| Update Own Profile | ✅ | ✅ | ✅ |
| View All Customers | ❌ | ✅ | ✅ |
| Update Customer Info | ❌ | ✅ | ✅ |
| Delete Customer | ❌ | ❌ | ✅ |
| **Analytics** |
| View Analytics | ❌ | ✅ | ✅ |
| View Sales Reports | ❌ | ✅ | ✅ |
| Export Data | ❌ | ✅ | ✅ |
| **Admin Management** |
| View Admins | ❌ | ❌ | ✅ |
| Create Admin | ❌ | ❌ | ✅ |
| Update Admin | ❌ | ❌ | ✅ |
| Delete Admin | ❌ | ❌ | ✅ |
| Manage Roles | ❌ | ❌ | ✅ |
| **System Settings** |
| View System Settings | ❌ | ❌ | ✅ |
| Update System Settings | ❌ | ❌ | ✅ |
| View Logs | ❌ | ❌ | ✅ |
| Manage Chatbot | ❌ | ❌ | ✅ |

---

## 🔧 Backend Implementation

### Permission Configuration
Location: `backend/src/config/permissions.ts`

```typescript
export enum UserRole {
    CUSTOMER = 'customer',
    ADMIN = 'admin',
    SUPERADMIN = 'superadmin',
}

export enum Permission {
    VIEW_PRODUCTS = 'view_products',
    CREATE_PRODUCTS = 'create_products',
    // ... more permissions
}
```

### Middleware

#### 1. **Basic Authentication**
```typescript
protect // Ensures user is authenticated
```

#### 2. **Role-Based Authorization**
```typescript
authorize('admin', 'superadmin') // Requires specific roles
```

#### 3. **Permission-Based Authorization**
```typescript
checkPermission(Permission.CREATE_PRODUCTS) // Requires specific permission
```

#### 4. **Admin Access**
```typescript
requireAdminAccess // Requires admin or superadmin role
```

#### 5. **Superadmin Access**
```typescript
requireSuperAdmin // Requires superadmin role only
```

### Route Protection Examples

```typescript
// Product routes
router.post('/', 
    protect, 
    requireAdminAccess, 
    checkPermission(Permission.CREATE_PRODUCTS), 
    createProduct
);

// Admin management routes (superadmin only)
router.use('/api/v1/admin', protect, requireSuperAdmin, adminRoutes);
```

---

## 💻 Frontend Implementation

### Admin Panel Access Control

The admin dashboard (`admin/`) automatically handles role-based UI rendering:

1. **Navigation Menu**: Dynamically shows/hides menu items based on user role
2. **Page Protection**: Redirects unauthorized users
3. **Feature Visibility**: Shows/hides features based on permissions

### Layout Component Logic

```typescript
// Get current user
const currentUser = JSON.parse(localStorage.getItem('admin-user') || '{}');
const isSuperAdmin = currentUser.role === 'superadmin';

// Build navigation based on role
const navigation = useMemo(() => {
    const nav = [...baseNavigation];
    if (isSuperAdmin) {
        nav.push(...superadminNavigation); // Add Admin Management
    }
    return nav;
}, [isSuperAdmin]);
```

---

## 🚀 Admin Management Features (Superadmin Only)

### Access Admin Management
Navigate to: `/admins` in the admin dashboard

### Features Available:

1. **View All Admins**
   - List of all admin and superadmin users
   - View creation date, last login, and status

2. **Create New Admin**
   - Set role (admin or superadmin)
   - Auto-verified email
   - Secure password requirement (min 8 chars)

3. **Update Admin**
   - Change user information
   - Update role
   - Activate/deactivate account
   - **Note**: Cannot demote or deactivate own account

4. **Delete Admin**
   - Remove admin user from system
   - **Note**: Cannot delete own account

5. **Change Admin Password**
   - Superadmin can reset any admin's password
   - Useful for account recovery

---

## 🔑 Default Credentials

### Admin Account
```
Email:    admin@tangerinefurniture.co.ke
Password: Admin@123456
Role:     admin
```

### Superadmin Account
```
Email:    superadmin@tangerinefurniture.co.ke
Password: SuperAdmin@123456
Role:     superadmin
```

⚠️ **IMPORTANT**: Change these credentials in production!

---

## 🛠️ API Endpoints

### Authentication
```
POST   /api/v1/auth/register    - Register new user
POST   /api/v1/auth/login       - Login
GET    /api/v1/auth/me          - Get current user profile
```

### Admin Management (Superadmin Only)
```
GET    /api/v1/admin/admins              - Get all admins
POST   /api/v1/admin/admins              - Create new admin
GET    /api/v1/admin/admins/:id          - Get single admin
PUT    /api/v1/admin/admins/:id          - Update admin
DELETE /api/v1/admin/admins/:id          - Delete admin
PUT    /api/v1/admin/admins/:id/password - Change admin password
GET    /api/v1/admin/stats               - Get admin statistics
```

### Products (Admin/Superadmin)
```
GET    /api/v1/products          - Get all products
POST   /api/v1/products          - Create product (Admin+)
PUT    /api/v1/products/:id      - Update product (Admin+)
DELETE /api/v1/products/:id      - Delete product (Admin+)
```

### Orders (Admin/Superadmin)
```
GET    /api/v1/orders/all/orders    - Get all orders (Admin+)
PUT    /api/v1/orders/:id/status    - Update order status (Admin+)
PUT    /api/v1/orders/:id/payment   - Update payment status (Admin+)
```

### Customers (Admin/Superadmin)
```
GET    /api/v1/users          - Get all customers (Admin+)
PUT    /api/v1/users/:id      - Update customer (Admin+)
DELETE /api/v1/users/:id      - Delete customer (Superadmin only)
```

### Analytics (Admin/Superadmin)
```
GET    /api/v1/analytics/dashboard      - Dashboard stats (Admin+)
GET    /api/v1/analytics/sales          - Sales data (Admin+)
GET    /api/v1/analytics/top-products   - Top products (Admin+)
GET    /api/v1/analytics/recent-orders  - Recent orders (Admin+)
```

---

## 🔒 Security Best Practices

### 1. **Token Management**
- JWTs stored in localStorage
- Tokens expire after 7 days
- Automatic logout on 401 errors

### 2. **Password Requirements**
- Minimum 8 characters
- Hashed with bcrypt (12 salt rounds)
- Never stored in plain text

### 3. **Permission Checks**
- All routes protected with middleware
- Frontend validation + backend enforcement
- Granular permission checking

### 4. **Self-Protection**
- Superadmins cannot delete their own account
- Superadmins cannot demote themselves
- Prevents accidental lockout

---

## 📝 Adding New Permissions

### 1. Add Permission Enum
```typescript
// backend/src/config/permissions.ts
export enum Permission {
    // ... existing permissions
    NEW_FEATURE = 'new_feature',
}
```

### 2. Assign to Roles
```typescript
const adminPermissions: Permission[] = [
    ...customerPermissions,
    Permission.NEW_FEATURE, // Add here
];
```

### 3. Protect Route
```typescript
router.post('/new-feature', 
    protect, 
    checkPermission(Permission.NEW_FEATURE), 
    newFeatureController
);
```

### 4. Update Frontend (if needed)
```typescript
// Check permission in component
if (currentUser.role === 'admin' || currentUser.role === 'superadmin') {
    // Show feature
}
```

---

## 🧪 Testing Permissions

### Test Admin Access
1. Login with admin credentials
2. Try to access `/admins` - should be denied
3. Access `/products`, `/orders`, `/analytics` - should work

### Test Superadmin Access
1. Login with superadmin credentials
2. Access `/admins` - should work
3. Create/edit/delete admin users
4. All other admin features should work

### Test Customer Access (via frontend)
1. Register as customer
2. Should not see admin panel link
3. Can only access shopping features

---

## 🐛 Troubleshooting

### "Access Denied" Error
- Verify user role in localStorage: `admin-user`
- Check token validity: `admin-token`
- Ensure backend permissions are correctly configured

### Admin Management Not Visible
- Confirm user role is `superadmin` (not just `admin`)
- Clear browser cache and localStorage
- Re-login to refresh token

### 401 Unauthorized
- Token expired - login again
- Token invalid - clear localStorage and login
- Backend not running - start backend server

---

## 📚 Related Files

### Backend
- `backend/src/config/permissions.ts` - Permission definitions
- `backend/src/middleware/auth.middleware.ts` - Auth middleware
- `backend/src/controllers/admin.controller.ts` - Admin management
- `backend/src/routes/admin.routes.ts` - Admin routes
- `backend/src/models/User.ts` - User model with roles

### Frontend
- `admin/src/pages/AdminManagement.tsx` - Admin management UI
- `admin/src/components/Layout.tsx` - Navigation with role-based menu
- `admin/src/services/api.ts` - API client with admin endpoints
- `admin/src/App.tsx` - Route configuration

---

## 📞 Support

For issues or questions about RBAC:
1. Check this documentation
2. Review the permission configuration
3. Test with provided default credentials
4. Check browser console for errors

---

**Last Updated**: 2025-01-17
**Version**: 1.0

