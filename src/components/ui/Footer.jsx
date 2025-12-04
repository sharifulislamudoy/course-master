'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ChevronUp,
  Heart
} from 'lucide-react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const footerLinks = {
    main: [
      { name: 'Home', path: '/' },
      { name: 'Courses', path: '/courses' },
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ],
    resources: [
      { name: 'Blog', path: '/blog' },
      { name: 'FAQs', path: '/faqs' },
      { name: 'Support', path: '/support' },
      { name: 'Privacy Policy', path: '/privacy' },
    ],
    contact: [
      { icon: <Mail className="w-4 h-4" />, text: 'hello@coursemaster.com' },
      { icon: <Phone className="w-4 h-4" />, text: '+1 (555) 123-4567' },
      { icon: <MapPin className="w-4 h-4" />, text: '123 Education St, Learning City' },
    ],
    social: [
      { icon: <Facebook className="w-5 h-5" />, path: 'https://facebook.com' },
      { icon: <Twitter className="w-5 h-5" />, path: 'https://twitter.com' },
      { icon: <Instagram className="w-5 h-5" />, path: 'https://instagram.com' },
      { icon: <Linkedin className="w-5 h-5" />, path: 'https://linkedin.com' },
    ]
  };

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Show/hide scroll to top button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[#E2CC40] text-[#011F2F] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Footer */}
      <footer className="bg-[#011F2F] text-white">
        <div className="w-11/12 mx-auto md:px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <div className="p-2 bg-white/10 rounded-lg">
                  <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                </div>
                <div className="text-2xl font-bold">
                  <span className="text-[#E2CC40]">Course</span>
                  <span className="text-white">Master</span>
                </div>
              </motion.div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Empowering learners worldwide with high-quality courses and expert instructors. 
                Your journey to mastery starts here.
              </p>
              <div className="flex space-x-4 pt-2">
                {footerLinks.social.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 5,
                      backgroundColor: '#E2CC40',
                      color: '#011F2F'
                    }}
                    className="p-2 rounded-full bg-white/10 hover:bg-[#E2CC40] hover:text-[#011F2F] transition-all duration-300"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-xl font-bold mb-6 text-[#E2CC40]">Quick Links</h3>
              <ul className="space-y-3">
                {footerLinks.main.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.path}
                      className="flex items-center space-x-2 text-gray-300 hover:text-[#E2CC40] transition-all duration-300 group"
                    >
                      <motion.span
                        className="w-0 h-0.5 bg-[#E2CC40] group-hover:w-4 transition-all duration-300"
                        whileHover={{ width: 16 }}
                      />
                      <span>{link.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-6 text-[#E2CC40]">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.path}
                      className="flex items-center space-x-2 text-gray-300 hover:text-[#E2CC40] transition-all duration-300 group"
                    >
                      <motion.span
                        className="w-0 h-0.5 bg-[#E2CC40] group-hover:w-4 transition-all duration-300"
                        whileHover={{ width: 16 }}
                      />
                      <span>{link.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-6 text-[#E2CC40]">Contact Us</h3>
              <ul className="space-y-4">
                {footerLinks.contact.map((contact, index) => (
                  <motion.li
                    key={contact.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 text-gray-300"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-1.5 rounded-full bg-[#E2CC40]/20"
                    >
                      <div className="text-[#E2CC40]">
                        {contact.icon}
                      </div>
                    </motion.div>
                    <span className="text-sm pt-1">{contact.text}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-px bg-gradient-to-r from-transparent via-[#E2CC40] to-transparent my-8"
          />

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-gray-400 text-sm text-center md:text-left"
            >
              © {new Date().getFullYear()} CourseMaster. All rights reserved.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="flex items-center space-x-4 text-sm text-gray-400"
            >
              <Link href="/terms" className="hover:text-[#E2CC40] transition-colors">
                Terms of Service
              </Link>
              <span className="text-[#E2CC40]">•</span>
              <Link href="/privacy" className="hover:text-[#E2CC40] transition-colors">
                Privacy Policy
              </Link>
              <span className="text-[#E2CC40]">•</span>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;