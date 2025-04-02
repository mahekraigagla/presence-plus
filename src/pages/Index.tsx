
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, LogIn, CheckSquare, ShieldCheck, BarChart3, Users, Camera, QrCode, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Navbar />
      
      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-6 mt-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
          
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center lg:text-left">
                <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">AI-Powered Attendance System</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient">
                  Presence+
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                  Using AI-powered face recognition for secure and efficient attendance tracking in educational institutions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link 
                    to="/signup" 
                    className="btn-primary flex items-center justify-center gap-2 group"
                  >
                    <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span>Register Now</span>
                  </Link>
                  <Link 
                    to="/login" 
                    className="btn-outline flex items-center justify-center gap-2"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp}
                className="relative hidden lg:block"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-3xl"></div>
                <img 
                  src="/placeholder.svg" 
                  alt="AI Attendance System" 
                  className="w-full h-auto rounded-3xl shadow-lg"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our intelligent attendance system simplifies the process with cutting-edge technology
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="card-gradient p-8 rounded-xl relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full"></div>
                <div className="relative">
                  <div className="bg-primary/10 p-4 rounded-xl w-fit mb-6">
                    <UserPlus className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute top-0 right-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">1</span>
                  <h3 className="text-xl font-semibold mb-3">Register</h3>
                  <p className="text-muted-foreground mb-4">
                    Students create an account and register their face during the sign-up process.
                  </p>
                  <Link to="/signup" className="text-primary hover:underline flex items-center">
                    <span>Get Started</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                className="card-gradient p-8 rounded-xl relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full"></div>
                <div className="relative">
                  <div className="bg-primary/10 p-4 rounded-xl w-fit mb-6">
                    <QrCode className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute top-0 right-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">2</span>
                  <h3 className="text-xl font-semibold mb-3">QR Generation</h3>
                  <p className="text-muted-foreground mb-4">
                    Teachers generate unique QR codes for their classes to track attendance.
                  </p>
                  <Link to="/about" className="text-primary hover:underline flex items-center">
                    <span>Learn More</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                className="card-gradient p-8 rounded-xl relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full"></div>
                <div className="relative">
                  <div className="bg-primary/10 p-4 rounded-xl w-fit mb-6">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute top-0 right-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">3</span>
                  <h3 className="text-xl font-semibold mb-3">Mark Attendance</h3>
                  <p className="text-muted-foreground mb-4">
                    Students mark attendance with a simple face scan - quick, secure, and reliable.
                  </p>
                  <Link to="/mark-attendance" className="text-primary hover:underline flex items-center">
                    <span>View Process</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our system combines cutting-edge AI technology with a user-friendly interface for seamless attendance management.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div 
                className="card-gradient p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Face Recognition</h3>
                <p className="text-muted-foreground">
                  State-of-the-art facial recognition with anti-spoofing protection ensures only genuine attendance.
                </p>
              </motion.div>
              
              <motion.div 
                className="card-gradient p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <CheckSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Automated Tracking</h3>
                <p className="text-muted-foreground">
                  Effortlessly track and manage attendance records with automatic data processing.
                </p>
              </motion.div>
              
              <motion.div 
                className="card-gradient p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
                <p className="text-muted-foreground">
                  Comprehensive reports and analytics to monitor attendance patterns and trends.
                </p>
              </motion.div>
              
              <motion.div 
                className="card-gradient p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
                <p className="text-muted-foreground">
                  Separate interfaces for students and faculty with appropriate access controls.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-6">
          <motion.div 
            className="container mx-auto max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass dark:glass-dark rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
              
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join our innovative attendance system and experience the future of attendance tracking today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/signup" 
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Create Account</span>
                </Link>
                <Link 
                  to="/login" 
                  className="btn-outline flex items-center justify-center gap-2"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Presence+ Attendance System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
