'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BookOpen, LogIn } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '@/lib/redux/slices/authSlice';
import UserDropdown from '@/components/UserDropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Course Listing', path: '/courses' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Fetch current user on mount
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

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

            {/* Right Side - Login Button or User Dropdown */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoading ? (
                <div className="w-8 h-8 border-2 border-[#E2CC40] border-t-transparent rounded-full animate-spin" />
              ) : isAuthenticated && user ? (
                <UserDropdown />
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
                      className={`block py-3 px-4 text-lg font-medium rounded-lg transition-all duration-300 ${
                        isActive(item.path)
                          ? 'bg-[#011F2F] text-[#E2CC40]'
                          : 'text-gray-700 hover:text-[#E2CC40] hover:bg-[#011F2F]/5'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile User Info or Login */}
                {isAuthenticated && user ? (
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
                      className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        dispatch(logoutUser());
                        setIsOpen(false);
                      }}
                      className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg"
                    >
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

      {/* Spacer for fixed navbar */}
      <div className="h-15" />
    </>
  );
};

export default Navbar;