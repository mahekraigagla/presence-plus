
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, Users, UserCheck, Calendar, Bookmark, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <QrCode className="h-10 w-10" />,
      title: 'QR Code Attendance',
      description: 'Secure and fast attendance marking with dynamic QR codes.'
    },
    {
      icon: <UserCheck className="h-10 w-10" />,
      title: 'Face Recognition',
      description: 'Verify identity with AI-powered face recognition.'
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: 'Live Monitoring',
      description: 'Track attendance in real-time and generate comprehensive reports.'
    },
    {
      icon: <Calendar className="h-10 w-10" />,
      title: 'Attendance Analytics',
      description: 'Visualize attendance patterns with detailed analytics.'
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Bookmark className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">Presence+</span>
            </div>
            <div className="hidden md:flex space-x-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/login')}>Get Started</Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { delayChildren: 0.3, staggerChildren: 0.2 }
                }
              }}
              className="text-left"
            >
              <motion.div variants={fadeInUp}>
                <span className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
                  AI-Powered Attendance System
                </span>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
              >
                Making Attendance <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Intelligent</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              >
                Secure, accurate, and efficient attendance tracking using QR codes and face recognition.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate('/login')} className="h-12 px-6">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="h-12 px-6">
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1573496546038-82f9c39f6365?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80" 
                alt="Students in classroom" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Smart Features</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the future of attendance management with our cutting-edge technologies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              >
                <div className="p-3 rounded-full bg-primary/10 mb-4 inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-white">Ready to Transform Attendance Management?</h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Join thousands of educational institutions already using Presence+ to streamline their attendance processes.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/login')} 
                className="h-12 px-8 bg-white text-blue-700 hover:bg-blue-50"
              >
                Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-12 mt-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center">
                <Bookmark className="h-6 w-6 text-primary" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Presence+</span>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Modern attendance solution for modern educational institutions.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Documentation</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Support</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Contact Us</h3>
              <ul className="mt-4 space-y-2">
                <li className="text-gray-600 dark:text-gray-300">info@presence-plus.com</li>
                <li className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              © {new Date().getFullYear()} Presence+. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
