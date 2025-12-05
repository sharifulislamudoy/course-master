'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, LayoutDashboard, LogOut, User, Home, BookOpen, Info, Phone } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Course Listing', path: '/courses', icon: BookOpen },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  // Fetch current user on mount and route change
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/me', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      }
    };

    fetchUser();
  }, [pathname]);

  // Check if a link is active
  const isActive = (path) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        setUser(null);
        setShowDrawer(false);
        setShowLogoutModal(false);
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-gradient-to-br from-[#E2CC40]/10 via-transparent to-[#011F2F]/5 backdrop-blur-md shadow-lg py-2' 
            : 'bg-gradient-to-br from-[#E2CC40]/10 via-transparent to-[#011F2F]/5 py-2'
        }`}
      >
        <div className="w-11/12 mx-auto md:px-4">
          <div className="flex items-center justify-between">
            {/* Logo - Left Side */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <div className="p-2 rounded-lg">
                <img src="/logo.png" alt="Logo" className='h-8 w-8'/>
              </div>
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-[#E2CC40]">
                  Course <span className='text-[#011F2F]'>Master</span>
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation - Middle */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.path}
                    className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
                      isActive(item.path)
                        ? 'text-[#E2CC40]'
                        : 'text-gray-700 hover:text-[#E2CC40]'
                    }`}
                  >
                    {item.name}
                    {isActive(item.path) && (
                      <motion.span
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E2CC40]"
                        layoutId="activeTab"
                        transition={{ stiffness: 300, damping: 30 }}
                      />
                    )}
                    {!isActive(item.path) && (
                      <motion.span
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-[#011F2F] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                        initial={false}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Side - User Icon or Login Button */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <button
                    onClick={() => setShowDrawer(true)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#E2CC40] to-[#011F2F] text-white font-bold hover:shadow-lg transition-shadow duration-300"
                  >
                    {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/auth/login"
                    className={`flex items-center space-x-2 px-6 py-3 font-semibold rounded-full transition-all duration-300 ${
                      pathname === '/auth/login'
                        ? 'bg-[#E2CC40] text-[#011F2F]'
                        : 'bg-[#011F2F] text-white hover:bg-[#E2CC40] hover:text-[#011F2F]'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 z-40 md:hidden bg-white shadow-xl border-t"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={item.path}
                      className={`flex items-center py-3 px-4 text-lg font-medium rounded-lg transition-all duration-300 ${
                        isActive(item.path)
                          ? 'bg-[#011F2F] text-[#E2CC40]'
                          : 'text-gray-700 hover:text-[#E2CC40] hover:bg-[#011F2F]/5'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile User Info or Login */}
                {user ? (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="pt-4 border-t"
                  >
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E2CC40] to-[#011F2F] flex items-center justify-center text-white font-bold">
                          {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.fullName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      href="/dashboard"
                      className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5 mr-3" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-5 h-5 mr-3" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setShowLogoutModal(true);
                        setIsOpen(false);
                      }}
                      className="flex items-center w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="pt-4 border-t"
                  >
                    <Link
                      href="/auth/login"
                      className={`flex items-center justify-center space-x-2 w-full py-3 font-semibold rounded-lg transition-all duration-300 ${
                        pathname === '/auth/login'
                          ? 'bg-[#E2CC40] text-[#011F2F]'
                          : 'bg-[#011F2F] text-white hover:bg-[#E2CC40] hover:text-[#011F2F]'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Login</span>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowDrawer(false)}
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Profile</h2>
                    <button
                      onClick={() => setShowDrawer(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* User Info */}
                <div className="p-6 border-b">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E2CC40] to-[#011F2F] flex items-center justify-center text-white text-2xl font-bold">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user?.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 p-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors mb-2"
                    onClick={() => setShowDrawer(false)}
                  >
                    <LayoutDashboard className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-700">Dashboard</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors mb-2"
                    onClick={() => setShowDrawer(false)}
                  >
                    <User className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-700">My Profile</span>
                  </Link>
                </div>

                {/* Footer - Logout Button */}
                <div className="p-6 border-t">
                  <button
                    onClick={() => {
                      setShowDrawer(false);
                      setShowLogoutModal(true);
                    }}
                    className="flex items-center justify-center w-full py-3 px-4 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowLogoutModal(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <LogOut className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Confirm Logout
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to logout from your account?
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-3 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;