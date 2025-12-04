'use client';

import { motion } from 'framer-motion';
import { Users, Target, Award, Sparkles, Globe, Rocket, BookOpen, Heart } from 'lucide-react';
import { useState } from 'react';

const AboutPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Passionate about transforming education through technology",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Head of Instruction",
      bio: "Former university professor with 10+ years teaching experience",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w-400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Marcus Rivera",
      role: "Tech Lead",
      bio: "Building scalable learning platforms for modern education",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
    {
      id: 4,
      name: "Priya Patel",
      role: "Content Director",
      bio: "Curriculum design expert specializing in interactive learning",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop"
    }
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Our Mission",
      description: "Democratize quality education by making learning accessible, engaging, and effective for everyone.",
      color: "from-[#E2CC40] to-yellow-400"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Our Vision",
      description: "Create a world where anyone, anywhere can transform their life through learning.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Impact",
      description: "Serving learners across 150+ countries with localized content and support.",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Student First",
      description: "Every decision is made with our learners' success and experience in mind.",
      color: "from-red-500 to-pink-400"
    }
  ];

  const milestones = [
    { year: "2018", event: "Founded with a vision to revolutionize online learning", icon: "🚀" },
    { year: "2019", event: "Launched first 10 courses with interactive features", icon: "📚" },
    { year: "2020", event: "Reached 10,000+ active learners worldwide", icon: "🌍" },
    { year: "2021", event: "Introduced AI-powered personalized learning paths", icon: "🤖" },
    { year: "2022", event: "Expanded to 500+ courses across multiple domains", icon: "📈" },
    { year: "2023", event: "Awarded 'Best EdTech Platform' of the year", icon: "🏆" },
    { year: "2024", event: "Welcomed 1 millionth learner to our platform", icon: "🎉" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E2CC40]/10 via-transparent to-[#011F2F]/5" />
        <div className="w-11/12 mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-[#E2CC40]/10 text-[#011F2F] font-semibold mb-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Transforming Education Since 2018
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="text-[#011F2F]">Learn Without</span>{' '}
              <span className="text-[#E2CC40]">Limits</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            >
              At CourseMaster, we believe that education should be accessible, engaging, and 
              transformative. Join our community of 1 million+ learners worldwide.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#011F2F] text-white font-semibold rounded-full hover:bg-[#E2CC40] hover:text-[#011F2F] transition-all duration-300"
              >
                Explore Courses
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-[#011F2F] text-[#011F2F] font-semibold rounded-full hover:bg-[#011F2F] hover:text-white transition-all duration-300"
              >
                Join Our Community
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: "1M+", label: "Active Learners", icon: <Users className="w-6 h-6" /> },
              { value: "500+", label: "Courses", icon: <BookOpen className="w-6 h-6" /> },
              { value: "150+", label: "Countries", icon: <Globe className="w-6 h-6" /> },
              { value: "98%", label: "Satisfaction Rate", icon: <Award className="w-6 h-6" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E2CC40]/10 text-[#E2CC40] mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold text-[#011F2F] mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="w-11/12 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#011F2F] mb-6">
              Our <span className="text-[#E2CC40]">Core Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at CourseMaster
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl" />
                <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 group-hover:shadow-2xl transition-all duration-300 h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} text-white mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#011F2F] mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#011F2F] mb-6">
              Our <span className="text-[#E2CC40]">Journey</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#E2CC40] to-[#011F2F] hidden md:block" />
            
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} mb-6 md:mb-0`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                  >
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">{milestone.icon}</span>
                      <h3 className="text-2xl font-bold text-[#011F2F]">{milestone.year}</h3>
                    </div>
                    <p className="text-gray-600">{milestone.event}</p>
                  </motion.div>
                </div>
                
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-[#E2CC40] shadow-lg hidden md:block" />
                
                <div className="w-full md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-11/12 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#011F2F] mb-6">
              Meet Our <span className="text-[#E2CC40]">Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate educators, technologists, and innovators working together to transform learning
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011F2F] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-[#011F2F] mb-2">{member.name}</h3>
                <p className="text-[#E2CC40] font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;