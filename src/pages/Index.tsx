import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, Users, UserCheck, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <QrCode className="h-10 w-10" />,
      title: 'QR Code Attendance',
      description: 'Secure and fast attendance marking with dynamic QR codes that prevent proxy attendance.'
    },
    {
      icon: <UserCheck className="h-10 w-10" />,
      title: 'Face Recognition',
      description: 'Verify identity with AI-powered face recognition that ensures authenticity.'
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: 'Live Monitoring',
      description: 'Teachers can track attendance in real-time and generate comprehensive reports.'
    },
    {
      icon: <Calendar className="h-10 w-10" />,
      title: 'Attendance Analytics',
      description: 'Visualize attendance patterns with detailed analytics and actionable insights.'
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-10 pb-20 md:pt-20 md:pb-32">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center space-y-6 md:space-y-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { delayChildren: 0.3, staggerChildren: 0.2 }
                }
              }}
            >
              <motion.div variants={fadeInUp}>
                <span className="inline-block py-1 px-3 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
                  AI-Powered Attendance System
                </span>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-bold tracking-tight"
              >
                Attendance Made <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Intelligent</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
              >
                Secure, accurate, and efficient attendance tracking using QR codes, face recognition, and location validation.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <Button size="lg" onClick={() => navigate('/signup')} className="h-12 px-6">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="h-12 px-6">
                  Live Demo
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Presence+ combines cutting-edge technologies to create a seamless attendance experience for both students and teachers.
              </p>
            </div>
            
            <motion.div 
              className="grid md:grid-cols-2 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="glass dark:glass-dark p-6 rounded-lg flex flex-col items-center text-center card-hover"
                >
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto glass dark:glass-dark rounded-2xl p-8 md:p-12">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Transform Attendance Management?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of educational institutions already using Presence+ to streamline their attendance processes.
              </p>
              <Button size="lg" onClick={() => navigate('/login')} className="h-12 px-6 mt-4">
                Get Started Today
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="font-bold text-xl">Presence+</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Presence+. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
