/**
 * Role-Based Access Control (RBAC) Configuration
 * 
 * Defines permissions for different user roles:
 * - customer: Regular users who can browse and purchase
 * - admin: Store managers who can manage products, orders, customers
 * - superadmin: Full system access including admin management
 */

export enum UserRole {
    CUSTOMER = 'customer',
    ADMIN = 'admin',
    SUPERADMIN = 'superadmin',
}

export enum Permission {
    // Product Management
    VIEW_PRODUCTS = 'view_products',
    CREATE_PRODUCTS = 'create_products',
    UPDATE_PRODUCTS = 'update_products',
    DELETE_PRODUCTS = 'delete_products',

    // Category Management
    VIEW_CATEGORIES = 'view_categories',
    CREATE_CATEGORIES = 'create_categories',
    UPDATE_CATEGORIES = 'update_categories',
    DELETE_CATEGORIES = 'delete_categories',

    // Order Management
    VIEW_OWN_ORDERS = 'view_own_orders',
    VIEW_ALL_ORDERS = 'view_all_orders',
    UPDATE_ORDER_STATUS = 'update_order_status',
    CANCEL_ORDER = 'cancel_order',
    PROCESS_REFUNDS = 'process_refunds',

    // Customer Management
    VIEW_OWN_PROFILE = 'view_own_profile',
    UPDATE_OWN_PROFILE = 'update_own_profile',
    VIEW_ALL_CUSTOMERS = 'view_all_customers',
    UPDATE_CUSTOMER_INFO = 'update_customer_info',
    DELETE_CUSTOMER = 'delete_customer',

    // Analytics & Reports
    VIEW_ANALYTICS = 'view_analytics',
    VIEW_SALES_REPORTS = 'view_sales_reports',
    EXPORT_DATA = 'export_data',

    // Admin Management (Superadmin only)
    VIEW_ADMINS = 'view_admins',
    CREATE_ADMIN = 'create_admin',
    UPDATE_ADMIN = 'update_admin',
    DELETE_ADMIN = 'delete_admin',
    MANAGE_ROLES = 'manage_roles',

    // System Settings (Superadmin only)
    VIEW_SYSTEM_SETTINGS = 'view_system_settings',
    UPDATE_SYSTEM_SETTINGS = 'update_system_settings',
    VIEW_LOGS = 'view_logs',
    MANAGE_CHATBOT = 'manage_chatbot',

    // Cart Management
    MANAGE_OWN_CART = 'manage_own_cart',
}

// Define customer permissions first
const customerPermissions: Permission[] = [
    // Products
    Permission.VIEW_PRODUCTS,

    // Orders
    Permission.VIEW_OWN_ORDERS,
    Permission.CANCEL_ORDER,

    // Profile
    Permission.VIEW_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,

    // Cart
    Permission.MANAGE_OWN_CART,
];

// Define admin permissions (includes all customer permissions)
const adminPermissions: Permission[] = [
    ...customerPermissions,

    // Product Management
    Permission.CREATE_PRODUCTS,
    Permission.UPDATE_PRODUCTS,
    Permission.DELETE_PRODUCTS,

    // Category Management
    Permission.VIEW_CATEGORIES,
    Permission.CREATE_CATEGORIES,
    Permission.UPDATE_CATEGORIES,
    Permission.DELETE_CATEGORIES,

    // Order Management
    Permission.VIEW_ALL_ORDERS,
    Permission.UPDATE_ORDER_STATUS,
    Permission.PROCESS_REFUNDS,

    // Customer Management
    Permission.VIEW_ALL_CUSTOMERS,
    Permission.UPDATE_CUSTOMER_INFO,

    // Analytics
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_SALES_REPORTS,
    Permission.EXPORT_DATA,
];

// Define superadmin permissions (includes all admin permissions)
const superadminPermissions: Permission[] = [
    ...adminPermissions,

    // Admin Management
    Permission.VIEW_ADMINS,
    Permission.CREATE_ADMIN,
    Permission.UPDATE_ADMIN,
    Permission.DELETE_ADMIN,
    Permission.MANAGE_ROLES,

    // System Settings
    Permission.VIEW_SYSTEM_SETTINGS,
    Permission.UPDATE_SYSTEM_SETTINGS,
    Permission.VIEW_LOGS,
    Permission.MANAGE_CHATBOT,

    // Customer Management (full access)
    Permission.DELETE_CUSTOMER,
];

// Role to Permissions mapping
export const rolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.CUSTOMER]: customerPermissions,
    [UserRole.ADMIN]: adminPermissions,
    [UserRole.SUPERADMIN]: superadminPermissions,
};

// Helper function to check if a role has a specific permission
export const hasPermission = (role: UserRole, permission: Permission): boolean => {
    const permissions = rolePermissions[role];
    return permissions.includes(permission);
};

// Helper function to get all permissions for a role
export const getPermissionsForRole = (role: UserRole): Permission[] => {
    return rolePermissions[role];
};

// Helper to check if a role can access admin panel
export const canAccessAdminPanel = (role: UserRole): boolean => {
    return role === UserRole.ADMIN || role === UserRole.SUPERADMIN;
};

// Helper to check if user is superadmin
export const isSuperAdmin = (role: UserRole): boolean => {
    return role === UserRole.SUPERADMIN;
};

export default {
    UserRole,
    Permission,
    rolePermissions,
    hasPermission,
    getPermissionsForRole,
    canAccessAdminPanel,
    isSuperAdmin,
};

