'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === '/auth/login';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E2CC40]/5 via-white to-[#011F2F]/5">
      {/* Header */}
      <header className="py-4 px-4 md:px-8">
        <div className="container mx-auto">
          <Link href="/" className="inline-block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <div className="p-2 rounded-lg">
                <img src="/logo.png" alt="Logo" className="h-8 w-8" />
              </div>
              <span className="text-2xl font-bold text-[#E2CC40]">
                Course <span className="text-[#011F2F]">Master</span>
              </span>
            </motion.div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-11/12 mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="w-full max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
              {/* Left side - Animated Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:w-1/2 text-center lg:text-left hidden lg:flex lg:flex-col"
              >
                <h1 className="text-4xl lg:text-5xl font-bold text-[#011F2F] mb-6">
                  {isLogin ? 'Welcome Back!' : 'Join Our Community'}
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  {isLogin 
                    ? 'Sign in to access your personalized learning dashboard, track your progress, and continue your journey.'
                    : 'Start your learning journey today. Access thousands of courses and grow your skills with expert guidance.'
                  }
                </p>
                
                {/* Animated Features List */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#E2CC40]/20 flex items-center justify-center">
                      <span className="text-[#011F2F]">✓</span>
                    </div>
                    <span className="text-gray-700">Access to 1000+ courses</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#E2CC40]/20 flex items-center justify-center">
                      <span className="text-[#011F2F]">✓</span>
                    </div>
                    <span className="text-gray-700">Personalized learning paths</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#E2CC40]/20 flex items-center justify-center">
                      <span className="text-[#011F2F]">✓</span>
                    </div>
                    <span className="text-gray-700">Expert instructors & support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#E2CC40]/20 flex items-center justify-center">
                      <span className="text-[#011F2F]">✓</span>
                    </div>
                    <span className="text-gray-700">Certificate upon completion</span>
                  </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-12 grid grid-cols-3 gap-4"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#011F2F]">50K+</div>
                    <div className="text-sm text-gray-500">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#011F2F]">500+</div>
                    <div className="text-sm text-gray-500">Instructors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#011F2F]">4.9</div>
                    <div className="text-sm text-gray-500">Avg Rating</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right side - Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:w-1/2 w-full max-w-md"
              >
                {children}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}