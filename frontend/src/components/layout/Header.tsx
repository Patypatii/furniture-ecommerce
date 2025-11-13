'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface NavLink {
    href: string;
    label: string;
    submenu?: { href: string; label: string; }[];
}

interface SearchResult {
    _id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    images: { url: string; alt: string }[];
}

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
                setSearchQuery('');
                setSearchResults([]);
            }
        };

        const updateCartCount = () => {
            try {
                if (typeof window === 'undefined') return;

                const cartStr = localStorage.getItem('cart');
                if (!cartStr) {
                    setCartItemsCount(0);
                    return;
                }

                const cart = JSON.parse(cartStr);
                // Cart is stored as { items: [...] }
                const items = cart.items || [];
                const totalItems = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);

                setCartItemsCount(totalItems);
            } catch (error) {
                console.error('Error updating cart count:', error);
                setCartItemsCount(0);
            }
        };

        // Initial cart count on mount
        updateCartCount();

        // Set up event listeners
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('cartUpdated', updateCartCount);
        window.addEventListener('storage', updateCartCount);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('cartUpdated', updateCartCount);
            window.removeEventListener('storage', updateCartCount);
        };
    }, []);

    // Debug: Log cart count whenever it changes
    useEffect(() => {
        console.log('Cart items count changed to:', cartItemsCount);
    }, [cartItemsCount]);

    // Search products
    useEffect(() => {
        const searchProducts = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
                const response = await fetch(`${API_URL}/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
                const data = await response.json();

                if (data.success) {
                    setSearchResults(data.data);
                }
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(searchProducts, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // Focus search input when opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isSearchOpen) {
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    const handleSearchResultClick = () => {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const navLinks: NavLink[] = [
        { href: '/', label: 'Home' },
        {
            href: '/category/living-room',
            label: 'Living Room',
            submenu: [
                { href: '/products?category=accents', label: 'Accents' },
                { href: '/products?category=coffee-tables', label: 'Coffee Tables' },
                { href: '/products?category=consoles-cabinets', label: 'Consoles / Cabinets' },
                { href: '/products?category=sofas', label: 'Sofas' },
                { href: '/products?category=tv-stands', label: 'TV Stands' },
            ]
        },
        { href: '/products?category=dining-sets', label: 'Dining Sets' },
        { href: '/products?category=beds', label: 'Beds' },
        { href: '/products?category=hotel-restaurants', label: 'Hotel & Restaurants' },
        { href: '/furniture-in-nairobi-kenya', label: 'About Us' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            T
                        </div>
                        <span className="text-2xl font-bold text-gray-900">Tangerine</span>
                    </Link>



                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8" ref={dropdownRef}>
                        {navLinks.map((link) => (
                            <div key={link.href} className="relative group">
                                {link.submenu ? (
                                    <>
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                                            className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${pathname.startsWith(link.href) ? 'text-primary' : 'text-gray-700'
                                                }`}
                                        >
                                            {link.label}
                                            <svg
                                                className={`w-4 h-4 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {activeDropdown === link.label && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
                                            >
                                                {link.submenu.map((sublink) => (
                                                    <Link
                                                        key={sublink.href}
                                                        href={sublink.href}
                                                        onClick={() => setActiveDropdown(null)}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                                                    >
                                                        {sublink.label}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={link.href}
                                        className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-gray-700'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className="relative" ref={searchRef}>
                            <button
                                onClick={handleSearchToggle}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Search"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>

                            {/* Search Dropdown */}
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-100 z-50"
                                    >
                                        {/* Search Input */}
                                        <div className="p-4 border-b border-gray-100">
                                            <div className="relative">
                                                <input
                                                    ref={searchInputRef}
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Search products..."
                                                    className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                                />
                                                <svg
                                                    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Search Results */}
                                        <div className="max-h-96 overflow-y-auto">
                                            {isSearching && (
                                                <div className="p-8 text-center text-gray-500">
                                                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                                                    Searching...
                                                </div>
                                            )}

                                            {!isSearching && searchQuery.trim().length > 0 && searchResults.length === 0 && (
                                                <div className="p-8 text-center text-gray-500">
                                                    No products found for "{searchQuery}"
                                                </div>
                                            )}

                                            {!isSearching && searchResults.length > 0 && (
                                                <div className="py-2">
                                                    {searchResults.map((product) => (
                                                        <Link
                                                            key={product._id}
                                                            href={`/products/${product.slug}`}
                                                            onClick={handleSearchResultClick}
                                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                                                <Image
                                                                    src={product.images[0]?.url || '/placeholder.png'}
                                                                    alt={product.name}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="64px"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                                                    {product.name}
                                                                </h4>
                                                                <p className="text-sm text-primary font-semibold">
                                                                    {product.salePrice ? (
                                                                        <>
                                                                            <span>KES {product.salePrice.toLocaleString()}</span>
                                                                            <span className="ml-2 text-gray-400 line-through text-xs">
                                                                                KES {product.price.toLocaleString()}
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        <span>KES {product.price.toLocaleString()}</span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    ))}

                                                    {searchResults.length === 5 && (
                                                        <Link
                                                            href={`/products?search=${encodeURIComponent(searchQuery)}`}
                                                            onClick={handleSearchResultClick}
                                                            className="block text-center py-3 text-sm text-primary hover:bg-primary/10 font-medium"
                                                        >
                                                            View all results for "{searchQuery}"
                                                        </Link>
                                                    )}
                                                </div>
                                            )}

                                            {!isSearching && searchQuery.trim().length === 0 && (
                                                <div className="p-8 text-center text-gray-400 text-sm">
                                                    Start typing to search products...
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* User Icon with Dropdown */}
                        <div className="relative" ref={profileMenuRef}>
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Account"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </button>

                            {/* Profile Dropdown Menu */}
                            <AnimatePresence>
                                {showProfileMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
                                    >
                                        <Link
                                            href="/account"
                                            onClick={() => setShowProfileMenu(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Account
                                        </Link>

                                        <Link
                                            href="/account/orders"
                                            onClick={() => setShowProfileMenu(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            My Orders
                                        </Link>

                                        <Link
                                            href="/account/inbox"
                                            onClick={() => setShowProfileMenu(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            Inbox
                                        </Link>

                                        <Link
                                            href="/account/wishlist"
                                            onClick={() => setShowProfileMenu(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            Wishlist
                                        </Link>

                                        <div className="border-t border-gray-100 my-2"></div>

                                        <Link
                                            href="/login"
                                            onClick={() => setShowProfileMenu(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Sign In
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Cart Icon with Badge */}
                        <Link
                            href="/cart"
                            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Cart"
                        >
                            <svg
                                className="w-5 h-5 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t bg-white"
                    >
                        <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2">
                            {navLinks.map((link) => (
                                <div key={link.href}>
                                    {link.submenu ? (
                                        <div>
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                                                className={`w-full text-left text-base font-medium transition-colors hover:text-primary flex items-center justify-between py-2 ${pathname.startsWith(link.href) ? 'text-primary' : 'text-gray-700'
                                                    }`}
                                            >
                                                {link.label}
                                                <svg
                                                    className={`w-4 h-4 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            {activeDropdown === link.label && (
                                                <div className="pl-4 mt-2 space-y-2">
                                                    {link.submenu.map((sublink) => (
                                                        <Link
                                                            key={sublink.href}
                                                            href={sublink.href}
                                                            onClick={() => {
                                                                setIsMobileMenuOpen(false);
                                                                setActiveDropdown(null);
                                                            }}
                                                            className="block text-sm text-gray-600 hover:text-primary py-1"
                                                        >
                                                            {sublink.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`block text-base font-medium transition-colors hover:text-primary py-2 ${pathname === link.href ? 'text-primary' : 'text-gray-700'
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

