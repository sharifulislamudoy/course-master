'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
  DollarSign,
  User,
  Tag,
  Clock,
  TrendingUp,
  X,
  Check,
  Loader2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  // Cloudinary upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState('');

  const router = useRouter();

  // Cloudinary configuration
  const cloudName = 'dohhfubsa';
  const uploadPreset = 'react_unsigned';

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    price: '',
    category: '',
    syllabus: '',
    duration: '',
    level: 'Beginner',
    thumbnail: '',
    batches: [{ name: 'Batch 1', startDate: '', endDate: '', maxStudents: 30}],
    isPublished: false
  });

  // Fetch courses and filters
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const [coursesRes, filtersRes] = await Promise.all([
        fetch('http://localhost:5000/api/courses', {
          credentials: 'include',
        }),
        fetch('http://localhost:5000/api/courses/filters/all', {
          credentials: 'include',
        })
      ]);
      
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      }
      
      if (filtersRes.ok) {
        const filtersData = await filtersRes.json();
        setCategories(filtersData.categories || []);
        setInstructors(filtersData.instructors || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle batch changes
  const handleBatchChange = (index, field, value) => {
    const updatedBatches = [...formData.batches];
    updatedBatches[index][field] = value;
    setFormData(prev => ({ ...prev, batches: updatedBatches }));
  };

  // Add new batch
  const addBatch = () => {
    setFormData(prev => ({
      ...prev,
      batches: [
        ...prev.batches,
        { 
          name: `Batch ${prev.batches.length + 1}`, 
          startDate: '', 
          endDate: '', 
          maxStudents: 30,
        }
      ]
    }));
  };

  // Remove batch
  const removeBatch = (index) => {
    if (formData.batches.length > 1) {
      const updatedBatches = formData.batches.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, batches: updatedBatches }));
    }
  };

  // Handle file upload to Cloudinary
  const handleFileUpload = async (file) => {
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'course_thumbnails');

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Update form data with Cloudinary URL
      setFormData(prev => ({
        ...prev,
        thumbnail: data.secure_url
      }));
      
      // Set preview image
      setPreviewImage(data.secure_url);
      
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);

      return data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      
      // Upload to Cloudinary
      const cloudinaryUrl = await handleFileUpload(file);
      
      // Clean up preview URL if upload successful
      if (cloudinaryUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    }
  };

  // Handle course creation
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setShowCreateModal(false);
        resetForm();
        fetchCourses();
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    }
  };

  // Handle course update
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${selectedCourse._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setShowEditModal(false);
        resetForm();
        fetchCourses();
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    }
  };

  // Handle course deletion
  const handleDeleteCourse = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${selectedCourse._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setShowDeleteModal(false);
        setSelectedCourse(null);
        fetchCourses();
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor: '',
      price: '',
      category: '',
      syllabus: '',
      duration: '',
      level: 'Beginner',
      thumbnail: '',
      batches: [{ name: 'Batch 1', startDate: '', endDate: '', maxStudents: 30 }],
      isPublished: false
    });
    setSelectedCourse(null);
    setPreviewImage('');
    setUploading(false);
    setUploadProgress(0);
  };

  // Open edit modal
  const openEditModal = (course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      instructor: course.instructor,
      price: course.price,
      category: course.category,
      syllabus: course.syllabus,
      duration: course.duration || '',
      level: course.level || 'Beginner',
      thumbnail: course.thumbnail || '',
      batches: course.batches.length > 0 ? course.batches : 
               [{ name: 'Batch 1', startDate: '', endDate: '', maxStudents: 30 }],
      isPublished: course.isPublished || false
    });
    setPreviewImage(course.thumbnail || '');
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesInstructor = selectedInstructor === 'all' || course.instructor === selectedInstructor;
    
    return matchesSearch && matchesCategory && matchesInstructor;
  });

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Stats
  const stats = {
    total: courses.length,
    published: courses.filter(c => c.isPublished).length,
    totalStudents: courses.reduce((sum, course) => 
      sum + course.batches.reduce((batchSum, batch) => batchSum + (batch.currentStudents || 0), 0), 0
    ),
    totalRevenue: courses.reduce((sum, course) => 
      sum + (course.batches.reduce((batchSum, batch) => batchSum + (batch.currentStudents || 0), 0) * course.price), 0
    )
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#E2CC40]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-50">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
            </div>
            <div className="p-2 rounded-lg bg-green-50">
              <Check className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-50">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-2 rounded-lg bg-yellow-50">
              <DollarSign className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Header and Actions */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
            <p className="text-gray-600">Create, manage, and monitor your courses</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E2CC40] to-[#F4D03F] text-[#011F2F] font-semibold rounded-lg hover:shadow-lg transition-shadow duration-300"
          >
            <Plus className="w-5 h-5" />
            Add New Course
          </motion.button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Instructor Filter */}
          <div>
            <select
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
            >
              <option value="all">All Instructors</option>
              {instructors.map((instructor) => (
                <option key={instructor} value={instructor}>{instructor}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedInstructor('all');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-900"
          >
            Reset Filters
          </motion.button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentCourses.map((course, index) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Course Image/Thumbnail */}
            <div className="h-48 bg-gradient-to-r from-[#E2CC40]/20 to-[#011F2F]/20 relative">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <BookOpen className="w-16 h-16 text-gray-400" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                course.isPublished 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {course.isPublished ? 'Published' : 'Draft'}
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                <span className="text-2xl font-bold text-[#E2CC40]">${course.price}</span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

              {/* Course Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Tag className="w-4 h-4 mr-2" />
                  <span>{course.category}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{course.duration || 'Flexible'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>{course.level}</span>
                </div>
              </div>

              {/* Batches Info */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Batches:</h4>
                <div className="space-y-2">
                  {course.batches.slice(0, 2).map((batch, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{batch.name}</span>
                    </div>
                  ))}
                  {course.batches.length > 2 && (
                    <p className="text-sm text-gray-500">+{course.batches.length - 2} more batches</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openEditModal(course)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openDeleteModal(course)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/courses/${course._id}`)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#011F2F] hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Courses Message */}
      {currentCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
          <p className="text-gray-500 mb-6">Create your first course to get started</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#E2CC40] to-[#F4D03F] text-[#011F2F] font-semibold rounded-lg hover:shadow-lg transition-shadow duration-300"
          >
            Create Course
          </motion.button>
        </div>
      )}

      {/* Pagination */}
      {filteredCourses.length > coursesPerPage && (
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-lg">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstCourse + 1} to {Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} courses
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            
            {[...Array(totalPages)].map((_, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === idx + 1
                    ? 'bg-[#E2CC40] text-[#011F2F] font-bold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {idx + 1}
              </motion.button>
            ))}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${
                currentPage === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowCreateModal(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <form onSubmit={handleCreateCourse} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                        placeholder="Enter course title"
                      />
                    </div>

                    {/* Instructor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructor *
                      </label>
                      <input
                        type="text"
                        name="instructor"
                        value={formData.instructor}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                        placeholder="Enter instructor name"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                        placeholder="Enter category name"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                        placeholder="e.g., 8 weeks, 3 months"
                      />
                    </div>

                    {/* Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Level
                      </label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thumbnail *
                      </label>
                      
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#E2CC40] transition-colors">
                        {previewImage ? (
                          <div className="space-y-4">
                            <div className="relative mx-auto w-48 h-48">
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              {uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                  <div className="text-white">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                                    <p className="text-sm">Uploading... {uploadProgress}%</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 justify-center">
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="hidden"
                                  disabled={uploading}
                                />
                                <span className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                  Change Image
                                </span>
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewImage('');
                                  setFormData(prev => ({ ...prev, thumbnail: '' }));
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={uploading}
                              />
                              <div className="space-y-4">
                                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                  <Upload className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                  <p className="text-gray-700 font-medium">
                                    Click to upload thumbnail
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    PNG, JPG, GIF up to 5MB
                                  </p>
                                </div>
                                {uploading && (
                                  <div className="space-y-2">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#E2CC40]" />
                                    <p className="text-sm text-gray-600">
                                      Uploading... {uploadProgress}%
                                    </p>
                                  </div>
                                )}
                              </div>
                            </label>
                          </div>
                        )}
                      </div>
                      
                      {/* Hidden input for Cloudinary URL */}
                      <input
                        type="hidden"
                        name="thumbnail"
                        value={formData.thumbnail}
                        required={!formData.thumbnail}
                      />
                      {!formData.thumbnail && !previewImage && (
                        <p className="text-red-500 text-sm mt-2">Please upload a thumbnail image</p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                        placeholder="Course description"
                      />
                    </div>

                    {/* Syllabus */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Syllabus *
                      </label>
                      <textarea
                        name="syllabus"
                        value={formData.syllabus}
                        onChange={handleInputChange}
                        required
                        rows="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                        placeholder="Enter course syllabus (topics, modules, etc.)"
                      />
                    </div>
                  </div>

                  {/* Batches Section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Course Batches</h3>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addBatch}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#E2CC40] hover:bg-yellow-50 rounded-lg"
                      >
                        <Plus className="w-4 h-4" />
                        Add Batch
                      </motion.button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.batches.map((batch, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">{batch.name}</h4>
                            {formData.batches.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBatch(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                              <input
                                type="date"
                                value={batch.startDate}
                                onChange={(e) => handleBatchChange(index, 'startDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">End Date</label>
                              <input
                                type="date"
                                value={batch.endDate}
                                onChange={(e) => handleBatchChange(index, 'endDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Max Students</label>
                              <input
                                type="number"
                                value={batch.maxStudents}
                                onChange={(e) => handleBatchChange(index, 'maxStudents', parseInt(e.target.value))}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Publish Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
                    <div>
                      <p className="font-medium text-gray-900">Publish Course</p>
                      <p className="text-sm text-gray-600">Make this course visible to students</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E2CC40]"></div>
                    </label>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!formData.thumbnail || uploading}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-shadow ${
                        !formData.thumbnail || uploading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#E2CC40] to-[#F4D03F] text-[#011F2F] hover:shadow-lg'
                      }`}
                    >
                      {uploading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </span>
                      ) : (
                        'Create Course'
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Course Modal */}
      <AnimatePresence>
        {showEditModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowEditModal(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Course</h2>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <form onSubmit={handleUpdateCourse} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                      />
                    </div>

                    {/* Instructor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructor *
                      </label>
                      <input
                        type="text"
                        name="instructor"
                        value={formData.instructor}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                      />
                    </div>

                    {/* Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Level
                      </label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thumbnail
                      </label>
                      
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#E2CC40] transition-colors">
                        {previewImage ? (
                          <div className="space-y-4">
                            <div className="relative mx-auto w-48 h-48">
                              <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              {uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                  <div className="text-white">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                                    <p className="text-sm">Uploading... {uploadProgress}%</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 justify-center">
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="hidden"
                                  disabled={uploading}
                                />
                                <span className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                  Change Image
                                </span>
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewImage('');
                                  setFormData(prev => ({ ...prev, thumbnail: '' }));
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={uploading}
                              />
                              <div className="space-y-4">
                                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                  <Upload className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                  <p className="text-gray-700 font-medium">
                                    Click to upload thumbnail
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    PNG, JPG, GIF up to 5MB
                                  </p>
                                </div>
                                {uploading && (
                                  <div className="space-y-2">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#E2CC40]" />
                                    <p className="text-sm text-gray-600">
                                      Uploading... {uploadProgress}%
                                    </p>
                                  </div>
                                )}
                              </div>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                      />
                    </div>

                    {/* Syllabus */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Syllabus *
                      </label>
                      <textarea
                        name="syllabus"
                        value={formData.syllabus}
                        onChange={handleInputChange}
                        required
                        rows="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E2CC40] focus:border-transparent text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Batches Section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Course Batches</h3>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addBatch}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#E2CC40] hover:bg-yellow-50 rounded-lg"
                      >
                        <Plus className="w-4 h-4" />
                        Add Batch
                      </motion.button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.batches.map((batch, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">{batch.name}</h4>
                            {formData.batches.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBatch(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                              <input
                                type="date"
                                value={batch.startDate}
                                onChange={(e) => handleBatchChange(index, 'startDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">End Date</label>
                              <input
                                type="date"
                                value={batch.endDate}
                                onChange={(e) => handleBatchChange(index, 'endDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Max Students</label>
                              <input
                                type="number"
                                value={batch.maxStudents}
                                onChange={(e) => handleBatchChange(index, 'maxStudents', parseInt(e.target.value))}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Publish Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
                    <div>
                      <p className="font-medium text-gray-900">Publish Course</p>
                      <p className="text-sm text-gray-600">Make this course visible to students</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E2CC40]"></div>
                    </label>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={uploading}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-shadow ${
                        uploading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#E2CC40] to-[#F4D03F] text-[#011F2F] hover:shadow-lg'
                      }`}
                    >
                      {uploading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </span>
                      ) : (
                        'Update Course'
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowDeleteModal(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <Trash2 className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Delete Course
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "<span className="font-semibold">{selectedCourse?.title}</span>"? This action cannot be undone.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteCourse}
                    className="flex-1 py-3 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseManagement;