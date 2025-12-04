'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { ArrowRight, Play, Star, Users, BookOpen, Award } from 'lucide-react';

const HeroSection = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const controls = useAnimation();

    // Mouse parallax effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX / window.innerWidth - 0.5,
                y: e.clientY / window.innerHeight - 0.5,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Start animations
        controls.start({
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [controls]);

    // Stats data
    const stats = [
        { icon: <Users className="w-5 h-5" />, value: '10,000+', label: 'Students Enrolled' },
        { icon: <BookOpen className="w-5 h-5" />, value: '500+', label: 'Courses' },
        { icon: <Award className="w-5 h-5" />, value: '98%', label: 'Success Rate' },
        { icon: <Star className="w-5 h-5" />, value: '4.9/5', label: 'Student Rating' },
    ];

    return (
        <section className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-[#E2CC40]/10 blur-3xl"
                    animate={{
                        x: mousePosition.x * 40,
                        y: mousePosition.y * 40,
                    }}
                    transition={{ stiffness: 100, damping: 30 }}
                />
                <motion.div
                    className="absolute bottom-20 -right-20 w-80 h-80 rounded-full bg-[#011F2F]/10 blur-3xl"
                    animate={{
                        x: mousePosition.x * -30,
                        y: mousePosition.y * -30,
                    }}
                    transition={{ stiffness: 100, damping: 30 }}
                />

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(to right, #011F2F 1px, transparent 1px),
                             linear-gradient(to bottom, #011F2F 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }} />
                </div>
            </div>

            <div className="w-11/12 mx-auto md:px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left content */}
                    <div className="text-center lg:text-left">

                        {/* Main heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={controls}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
                        >
                            <span className="text-[#011F2F]">Master Your Future</span>
                            <br />
                            <span className="text-[#E2CC40]">With Expert-Led</span>
                            <br />
                            <span className="text-[#011F2F]">Courses</span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={controls}
                            transition={{ delay: 0.1 }}
                            className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0"
                        >
                            Transform your career with our comprehensive online courses. Learn from industry experts,
                            work on real-world projects, and join a community of passionate learners.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={controls}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
                        >
                            <Link
                                href="/courses"
                                className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#011F2F] text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:bg-[#E2CC40] hover:text-[#011F2F] hover:scale-105"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Explore Courses
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-[#E2CC40]"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </Link>

                            <button className="group inline-flex items-center justify-center px-8 py-4 bg-transparent text-[#011F2F] font-semibold rounded-full border-2 border-[#011F2F] transition-all duration-300 hover:bg-[#011F2F] hover:text-white hover:scale-105">
                                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                Watch Demo
                            </button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={controls}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl"
                        >
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center lg:text-left group"
                                >
                                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                                        <div className="p-2 bg-[#E2CC40]/10 text-[#E2CC40] rounded-lg group-hover:scale-110 transition-transform">
                                            {stat.icon}
                                        </div>
                                        <span className="text-2xl font-bold text-[#011F2F] group-hover:text-[#E2CC40] transition-colors">
                                            {stat.value}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right content - Hero image/illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={controls}
                        transition={{ delay: 0.4 }}
                        className="relative hidden lg:flex"
                    >
                        <div className="relative w-full mx-auto">
                            {/* Main card */}
                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                {/* Card header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E2CC40] to-[#011F2F] p-0.5">
                                        <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                                            <BookOpen className="w-6 h-6 text-[#E2CC40]" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-[#011F2F]">Featured Course</h3>
                                        <p className="text-gray-600 text-sm">React Masterclass 2024</p>
                                    </div>
                                </div>

                                {/* Course image */}
                                <div className="relative rounded-2xl overflow-hidden mb-6">
                                    <div className="aspect-video bg-gradient-to-br from-[#E2CC40] to-[#011F2F] relative">
                                        <img src="/hero.jpg" alt="hero" className='w-full h-[400px] object-cover' />
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                                        <span className="text-sm font-semibold text-[#011F2F]">Free Preview</span>
                                    </div>
                                </div>

                                {/* Course info */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className="w-4 h-4 text-[#E2CC40] fill-current"
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-semibold text-[#011F2F]">4.9 (2.5k reviews)</span>
                                        </div>
                                        <span className="text-2xl font-bold text-[#E2CC40]">$99</span>
                                    </div>

                                    <button className="w-full bg-[#011F2F] text-white py-3 rounded-xl font-semibold hover:bg-[#E2CC40] hover:text-[#011F2F] transition-all duration-300 transform hover:scale-[1.02]">
                                        Enroll Now
                                    </button>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <motion.div
                                className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-lg border"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E2CC40] to-[#011F2F] flex items-center justify-center">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#011F2F]">Live Class</p>
                                        <p className="text-sm text-gray-600">Starts in 30min</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute hidden lg:flex bottom-8 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-gray-500">Scroll to explore</span>
                    <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
                        <motion.div
                            className="w-1 h-3 bg-[#E2CC40] rounded-full mt-2"
                            animate={{
                                y: [0, 12, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;