'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
import CourseCard from './CourseCard';
import Link from 'next/link';

const CoursesSection = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [featuredCourses, setFeaturedCourses] = useState([]);

    // Fetch courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/courses');
                
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                    // Get only published courses and limit to 4
                    const published = data
                        .filter(course => course.isPublished)
                        .slice(0, 4);
                    setFeaturedCourses(published);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="w-11/12 mx-auto px-4">
                    <div className="text-center">
                        <BookOpen className="w-12 h-12 animate-pulse text-[#E2CC40] mx-auto mb-4" />
                        <p className="text-gray-600">Loading courses...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="w-11/12 mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-[#011F2F] mb-4"
                    >
                        Featured Courses
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 max-w-2xl mx-auto mb-8"
                    >
                        Discover our most popular courses taught by industry experts. 
                        Start your learning journey today!
                    </motion.p>
                    
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 text-[#E2CC40] font-semibold hover:gap-3 transition-all"
                    >
                        View All Courses
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                {/* Courses Grid */}
                {featuredCourses.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No courses available yet
                        </h3>
                        <p className="text-gray-500">
                            Check back soon for new courses!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredCourses.map((course, index) => (
                            <CourseCard 
                                key={course._id} 
                                course={course} 
                                index={index}
                            />
                        ))}
                    </div>
                )}

                {/* CTA Button */}
                {featuredCourses.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-center mt-12"
                    >
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#E2CC40] to-[#F4D03F] text-[#011F2F] font-semibold rounded-lg hover:shadow-lg transition-shadow duration-300"
                        >
                            Browse All Courses
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default CoursesSection;