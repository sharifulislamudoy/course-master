'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Users,
    Clock,
    TrendingUp,
    DollarSign,
    User,
    Calendar,
    CheckCircle,
    ChevronLeft,
    Share2,
    Bookmark,
    Star,
    FileText,
    ListChecks,
    Award,
    Globe,
    Mail,
    Phone,
    Facebook,
    Twitter,
    Linkedin,
    ArrowRight,
    Check,
    X
} from 'lucide-react';

const CourseDetailsPage = () => {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrollmentModal, setEnrollmentModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [enrollmentData, setEnrollmentData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const params = useParams();
    const router = useRouter();

    // Fetch course details
    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`https://course-master-server-woad.vercel.app/api/courses/${params.id}`);

            if (!response.ok) {
                throw new Error('Course not found');
            }

            const data = await response.json();
            setCourse(data);

            // Set first available batch as default
            if (data.batches && data.batches.length > 0) {
                setSelectedBatch(data.batches[0]);
            }
        } catch (error) {
            console.error('Error fetching course:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchCourseDetails();
        }
    }, [params.id]);

    // Handle enrollment form input changes
    const handleEnrollmentInputChange = (e) => {
        const { name, value } = e.target;
        setEnrollmentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle enrollment form submission
    const handleEnrollmentSubmit = (e) => {
        e.preventDefault();
        // For now, just show success message
        alert('Enrollment request submitted successfully! We will contact you shortly.');
        setEnrollmentModal(false);
        setEnrollmentData({
            name: '',
            email: '',
            phone: '',
            message: ''
        });
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Flexible';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Calculate batch availability
    const getBatchAvailability = (batch) => {
        const currentStudents = batch.currentStudents || 0;
        const maxStudents = batch.maxStudents || 30;
        const available = maxStudents - currentStudents;

        if (available <= 0) return { text: 'Full', color: 'text-red-600', bg: 'bg-red-50' };
        if (available <= 5) return { text: `${available} seats left`, color: 'text-yellow-600', bg: 'bg-yellow-50' };
        return { text: `${available} seats available`, color: 'text-green-600', bg: 'bg-green-50' };
    };

    // Share course
    const shareCourse = () => {
        if (navigator.share) {
            navigator.share({
                title: course?.title,
                text: `Check out this course: ${course?.title}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Course link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <BookOpen className="w-12 h-12 animate-pulse text-[#E2CC40] mx-auto mb-4" />
                        <p className="text-gray-600">Loading course details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div>
                <div className="container mx-auto px-4 md:px-6 py-16">
                    <div className="text-center">
                        <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
                        <p className="text-gray-600 mb-6">{error || 'The course you are looking for does not exist.'}</p>
                        <button
                            onClick={() => router.push('/courses')}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E2CC40] to-[#F4D03F] text-[#011F2F] font-semibold rounded-lg hover:shadow-lg transition-shadow duration-300 mx-auto"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Browse All Courses
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Course Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    {course.thumbnail ? (
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover opacity-20"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-[#011F2F] to-[#033048]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 w-11/12 mx-auto px-4 md:px-6 py-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <button
                            onClick={() => router.push('/courses')}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#E2CC40] mb-6 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back to Courses
                        </button>

                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left Column */}
                            <div className="lg:w-2/3 w-full">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-[#E2CC40]/10 text-[#011F2F] rounded-full text-sm font-medium">
                                        {course.category}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${course.isPublished
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {course.isPublished ? 'Enrollment Open' : 'Coming Soon'}
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    {course.title}
                                </h1>

                                <p className="text-lg text-gray-600 mb-6">
                                    {course.description || 'No description available'}
                                </p>

                                {/* Instructor Info */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#E2CC40] to-[#F4D03F] flex items-center justify-center">
                                        <User className="w-6 h-6 text-[#011F2F]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Instructor</h3>
                                        <p className="text-gray-600">{course.instructor}</p>
                                    </div>
                                </div>


                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-4 mb-3">

                                    <button
                                        onClick={shareCourse}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        Share
                                    </button>
                                </div>

                                {/* Course Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-white rounded-xl p-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-blue-50">
                                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Level</p>
                                                <p className="font-semibold text-gray-900">{course.level}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl p-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-green-50">
                                                <Clock className="w-5 h-5 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Duration</p>
                                                <p className="font-semibold text-gray-900">{course.duration || 'Flexible'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl p-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-purple-50">
                                                <Users className="w-5 h-5 text-purple-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Students</p>
                                                <p className="font-semibold text-gray-900">
                                                    {course.batches.reduce((sum, batch) => sum + (batch.currentStudents || 0), 0)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl p-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-yellow-50">
                                                <DollarSign className="w-5 h-5 text-yellow-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Price</p>
                                                <p className="font-semibold text-gray-900">${course.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Main Content */}
                                <div className="container mx-auto">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Left Column - Syllabus and Details */}
                                        <div className="lg:col-span-3">

                                            {/* Batches Section */}
                                            {course.batches && course.batches.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="bg-white rounded-xl shadow-lg p-6"
                                                >
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="p-2 rounded-lg bg-blue-50">
                                                            <Calendar className="w-6 h-6 text-blue-500" />
                                                        </div>
                                                        <h2 className="text-2xl font-bold text-gray-900">Available Batches</h2>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {course.batches.map((batch, index) => {
                                                            const availability = getBatchAvailability(batch);
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={`border rounded-xl p-5 hover:border-[#E2CC40] transition-colors ${selectedBatch?.name === batch.name ? 'border-[#E2CC40] bg-[#E2CC40]/5' : 'border-gray-200'
                                                                        }`}
                                                                    onClick={() => setSelectedBatch(batch)}
                                                                >
                                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                                        <div>
                                                                            <div className="flex items-center gap-3 mb-2">
                                                                                <h3 className="font-semibold text-gray-900">{batch.name}</h3>
                                                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${availability.bg} ${availability.color}`}>
                                                                                    {availability.text}
                                                                                </span>
                                                                            </div>

                                                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                                                {batch.startDate && (
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Calendar className="w-4 h-4" />
                                                                                        <span>Starts: {formatDate(batch.startDate)}</span>
                                                                                    </div>
                                                                                )}
                                                                                {batch.endDate && (
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Calendar className="w-4 h-4" />
                                                                                        <span>Ends: {formatDate(batch.endDate)}</span>
                                                                                    </div>
                                                                                )}
                                                                                <div className="flex items-center gap-2">
                                                                                    <Users className="w-4 h-4" />
                                                                                    <span>{batch.maxStudents || 30} seats total</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <button
                                                                            onClick={() => {
                                                                                setSelectedBatch(batch);
                                                                                setEnrollmentModal(true);
                                                                            }}
                                                                            disabled={!course.isPublished}
                                                                            className={`px-3 py-2 rounded-lg font-medium transition-colors ${course.isPublished
                                                                                ? 'bg-[#E2CC40] text-[#011F2F] hover:bg-[#F4D03F]'
                                                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                                }`}
                                                                        >
                                                                            Enroll Now
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Right Column - Price Card */}
                            <div className="lg:w-1/3 w-full">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white rounded-xl shadow-xl p-6 sticky top-24"
                                >
                                    <div className="text-center mb-6">
                                        <div className="text-5xl font-bold text-[#E2CC40] mb-2">${course.price}</div>
                                        <p className="text-gray-600">One-time payment</p>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span className="text-gray-700">Lifetime access to course materials</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span className="text-gray-700">Certificate of completion</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span className="text-gray-700">Instructor support</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span className="text-gray-700">Access to community forum</span>
                                        </div>
                                    </div>

                                    <p className="text-center text-sm text-gray-500 mt-4">
                                        30-day money-back guarantee
                                    </p>
                                </motion.div>
                                {/* Syllabus Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white rounded-xl shadow-lg p-6 mt-19 overflow-hidden"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 rounded-lg bg-[#E2CC40]/10">
                                            <FileText className="w-6 h-6 text-[#E2CC40]" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Course Syllabus</h2>
                                    </div>

                                    <div className="prose max-w-none">
                                        {course.syllabus ? (
                                            <div className="text-gray-700 whitespace-pre-line">
                                                {course.syllabus}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic">No syllabus available for this course.</p>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>


            {/* Enrollment Modal */}
            {enrollmentModal && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
                        onClick={() => setEnrollmentModal(false)}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">Enroll in Course</h2>
                                    <button
                                        onClick={() => setEnrollmentModal(false)}
                                        className="p-2 rounded-lg hover:bg-gray-100"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                {selectedBatch && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        Selected: <span className="font-semibold">{selectedBatch.name}</span>
                                    </p>
                                )}
                            </div>

                            <form onSubmit={handleEnrollmentSubmit} className="p-6">
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={enrollmentData.name}
                                            onChange={handleEnrollmentInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={enrollmentData.email}
                                            onChange={handleEnrollmentInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={enrollmentData.phone}
                                            onChange={handleEnrollmentInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setEnrollmentModal(false)}
                                        className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-[#E2CC40] to-[#F4D03F] text-[#011F2F] hover:shadow-lg transition-shadow font-semibold"
                                    >
                                        Submit Enrollment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
};

export default CourseDetailsPage;