'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Users,
    Clock,
    TrendingUp,
    DollarSign,
    Search,
    Filter,
    ChevronRight,
    Star,
    User,
    Calendar,
    CheckCircle
} from 'lucide-react';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState(['Beginner', 'Intermediate', 'Advanced']);
    const [sortBy, setSortBy] = useState('newest');

    const router = useRouter();

    // Fetch courses
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://course-master-server-woad.vercel.app/api/courses');
            
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
                setFilteredCourses(data);
                
                // Extract unique categories
                const uniqueCategories = [...new Set(data.map(course => course.category).filter(Boolean))];
                setCategories(uniqueCategories);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Filter and sort courses
    useEffect(() => {
        let result = [...courses];

        // Apply search filter
        if (searchTerm) {
            result = result.filter(course =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (selectedCategory !== 'all') {
            result = result.filter(course => course.category === selectedCategory);
        }

        // Apply level filter
        if (selectedLevel !== 'all') {
            result = result.filter(course => course.level === selectedLevel);
        }

        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'popular':
                // For now, sort by number of batches (can be replaced with enrollment count later)
                result.sort((a, b) => b.batches.length - a.batches.length);
                break;
            default:
                break;
        }

        setFilteredCourses(result);
    }, [searchTerm, selectedCategory, selectedLevel, sortBy, courses]);

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedLevel('all');
        setSortBy('newest');
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Get upcoming batch start date
    const getUpcomingBatchStart = (batches) => {
        if (!batches || batches.length === 0) return 'Flexible';
        
        const upcomingBatches = batches
            .filter(batch => batch.startDate)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        
        if (upcomingBatches.length === 0) return 'Flexible';
        
        const nextBatch = upcomingBatches.find(batch => new Date(batch.startDate) >= new Date());
        if (!nextBatch) return 'Flexible';
        
        return formatDate(nextBatch.startDate);
    };

    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <BookOpen className="w-12 h-12 animate-pulse text-[#E2CC40] mx-auto mb-4" />
                        <p className="text-gray-600">Loading courses...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Main Content */}
            <div className="w-11/12 mx-auto px-4 md:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:w-1/4"
                    >
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Filters
                                </h2>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`block w-full text-left px-3 py-2 rounded-lg ${selectedCategory === 'all'
                                            ? 'bg-[#E2CC40]/10 text-[#011F2F] font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`block w-full text-left px-3 py-2 rounded-lg ${selectedCategory === category
                                                ? 'bg-[#E2CC40]/10 text-[#011F2F] font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Level */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Difficulty Level</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedLevel('all')}
                                        className={`block w-full text-left px-3 py-2 rounded-lg ${selectedLevel === 'all'
                                            ? 'bg-[#E2CC40]/10 text-[#011F2F] font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        All Levels
                                    </button>
                                    {levels.map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setSelectedLevel(level)}
                                            className={`block w-full text-left px-3 py-2 rounded-lg ${selectedLevel === level
                                                ? 'bg-[#E2CC40]/10 text-[#011F2F] font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort By */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Sort By</h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="popular">Most Popular</option>
                                </select>
                            </div>

                            {/* Stats */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-600 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Courses Found</span>
                                        <span className="font-semibold text-gray-900">{filteredCourses.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Categories</span>
                                        <span className="font-semibold text-gray-900">{categories.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Course Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:w-3/4"
                    >
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Available Courses</h2>
                                <p className="text-gray-600">
                                    Showing {filteredCourses.length} of {courses.length} courses
                                </p>
                            </div>
                            <div className="flex items-center gap-2 mt-4 sm:mt-0">
                                <span className="text-sm text-gray-600">Showing:</span>
                                <span className="font-semibold text-gray-900">{filteredCourses.length} courses</span>
                            </div>
                        </div>

                        {/* Course Cards */}
                        {filteredCourses.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
                                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                                <button
                                    onClick={resetFilters}
                                    className="px-6 py-3 bg-gradient-to-r from-[#E2CC40] to-[#F4D03F] text-[#011F2F] font-semibold rounded-lg hover:shadow-lg transition-shadow duration-300"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {filteredCourses.map((course, index) => (
                                    <motion.div
                                        key={course._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => router.push(`/courses/${course._id}`)}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                    >
                                        {/* Course Image */}
                                        <div className="h-48 relative overflow-hidden bg-gradient-to-r from-[#E2CC40]/20 to-[#011F2F]/20">
                                            {course.thumbnail ? (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <BookOpen className="w-16 h-16 text-gray-400" />
                                                </div>
                                            )}

                                            {/* Status Badge */}
                                            <div className="absolute top-4 right-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.isPublished
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {course.isPublished ? 'Available' : 'Coming Soon'}
                                                </span>
                                            </div>

                                            {/* Category Badge */}
                                            <div className="absolute bottom-4 left-4">
                                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-[#011F2F]">
                                                    {course.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Course Content */}
                                        <div className="p-6">
                                            {/* Title and Price */}
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-[#E2CC40] transition-colors">
                                                    {course.title}
                                                </h3>
                                                <span className="text-2xl font-bold text-[#E2CC40] ml-2">
                                                    ${course.price}
                                                </span>
                                            </div>

                                            {/* Instructor */}
                                            <div className="flex items-center text-gray-600 mb-4">
                                                <User className="w-4 h-4 mr-2 flex-shrink-0" />
                                                <span className="text-sm truncate">{course.instructor}</span>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {course.description || 'No description available'}
                                            </p>

                                            {/* Course Details */}
                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                <div className="flex items-center text-gray-600">
                                                    <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
                                                    <span className="text-sm">{course.level}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                                                    <span className="text-sm">{course.duration || 'Flexible'}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                                                    <span className="text-sm">{getUpcomingBatchStart(course.batches)}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                                                    <span className="text-sm">{course.batches.reduce((sum, batch) => sum + (batch.currentStudents || 0), 0)} enrolled</span>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="flex items-center justify-between">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/courses/${course._id}`);
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-[#011F2F] text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
                                                >
                                                    View Details
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>

                                                {course.isPublished && (
                                                    <span className="flex items-center text-green-600 text-sm">
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Enrollment Open
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;