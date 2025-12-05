'use client';

import { motion } from 'framer-motion';
import { BookOpen, Users, Clock, User, Calendar, ChevronRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CourseCard = ({ course, index = 0 }) => {
    const router = useRouter();

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

    return (
        <motion.div
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
                {course.category && (
                    <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-[#011F2F]">
                            {course.category}
                        </span>
                    </div>
                )}
            </div>

            {/* Course Content */}
            <div className="p-6">
                {/* Title and Price */}
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-[#E2CC40] transition-colors">
                        {course.title}
                    </h3>
                    <span className="text-2xl font-bold text-[#E2CC40] ml-2">
                        ${course.price || 0}
                    </span>
                </div>

                {/* Instructor */}
                {course.instructor && (
                    <div className="flex items-center text-gray-600 mb-4">
                        <User className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm truncate">{course.instructor}</span>
                    </div>
                )}

                {/* Description */}
                {course.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.description}
                    </p>
                )}

                {/* Course Details */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {course.level && (
                        <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <span className="text-sm">{course.level}</span>
                        </div>
                    )}
                    
                    {course.duration && (
                        <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">{course.duration}</span>
                        </div>
                    )}
                    
                    <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">{getUpcomingBatchStart(course.batches || [])}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">
                            {(course.batches || []).reduce((sum, batch) => sum + (batch.currentStudents || 0), 0)} enrolled
                        </span>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-col-reverse items-center justify-between gap-3">
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
    );
};

export default CourseCard;