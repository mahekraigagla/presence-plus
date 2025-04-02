
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Check, QrCode, BarChart4, ShieldCheck, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';

const AboutPage = () => {
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { delayChildren: 0.2, staggerChildren: 0.2 }
                }
              }}
              className="text-center mb-16"
            >
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
                About Presence+
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                A cutting-edge attendance tracking system using AI face recognition technology
              </motion.p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass dark:glass-dark rounded-2xl p-8 md:p-12"
            >
              <div className="grid grid-cols-1 gap-10">
                <div className="mb-8">
                  <img 
                    src="/lovable-uploads/487a721c-b459-448c-99bf-4bfb8e8447a3.png" 
                    alt="AI Technology for Attendance Tracking" 
                    className="w-full h-auto rounded-xl shadow-lg mb-8"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">How It Works</h2>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-primary">1</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Student Registration</h3>
                          <p className="text-muted-foreground">Students create accounts and register their faces during the sign-up process.</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-primary">2</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Teacher QR Generation</h3>
                          <p className="text-muted-foreground">Teachers generate unique QR codes for their classes and subjects.</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-primary">3</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Face Recognition</h3>
                          <p className="text-muted-foreground">Students mark attendance using AI face recognition when they arrive.</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-primary">4</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Attendance Tracking</h3>
                          <p className="text-muted-foreground">The system automatically records and tracks attendance data.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="order-first md:order-last">
                    <div className="relative rounded-xl overflow-hidden aspect-video">
                      <img src="/lovable-uploads/43e91292-ab5b-4ed9-b72b-08ba9d1560b4.png" alt="How Face Recognition Works" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our system combines cutting-edge technology with a user-friendly interface
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card-gradient p-6 rounded-xl">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Face Recognition</h3>
                <p className="text-muted-foreground">
                  Advanced facial recognition technology ensures accurate and secure identity verification.
                </p>
              </div>
              
              <div className="card-gradient p-6 rounded-xl">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Anti-Spoofing</h3>
                <p className="text-muted-foreground">
                  Sophisticated liveness detection prevents photos or video impersonation attempts.
                </p>
              </div>
              
              <div className="card-gradient p-6 rounded-xl">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">QR Code Integration</h3>
                <p className="text-muted-foreground">
                  Teachers can easily generate QR codes for specific classes and subjects.
                </p>
              </div>
              
              <div className="card-gradient p-6 rounded-xl">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <BarChart4 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
                <p className="text-muted-foreground">
                  Comprehensive reports and analytics to monitor attendance patterns and trends.
                </p>
              </div>
              
              <div className="card-gradient p-6 rounded-xl">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
                <p className="text-muted-foreground">
                  Separate interfaces for students and faculty with appropriate access controls.
                </p>
              </div>
              
              <div className="card-gradient p-6 rounded-xl">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Attendance</h3>
                <p className="text-muted-foreground">
                  Simple, user-friendly process for marking attendance with minimal steps.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Technology Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="glass dark:glass-dark rounded-2xl p-8 md:p-12 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Technology</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Presence+ uses sophisticated AI algorithms to recognize and verify student identities with exceptional accuracy. Our system can:
                  </p>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="bg-primary/10 p-1 rounded-full mt-1">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span>Detect and recognize faces with 99.8% accuracy</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-primary/10 p-1 rounded-full mt-1">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span>Differentiate between real faces and photos/videos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-primary/10 p-1 rounded-full mt-1">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span>Work in various lighting conditions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-primary/10 p-1 rounded-full mt-1">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span>Process attendance marking in under 2 seconds</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-primary/10 p-1 rounded-full mt-1">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span>Maintain privacy and security of biometric data</span>
                    </li>
                  </ul>
                </div>
                
                <div className="order-first lg:order-last">
                  <div className="relative rounded-xl overflow-hidden aspect-square">
                    <img 
                      src="/lovable-uploads/35d1030f-80da-44af-9bdb-e17e5adfaea8.png" 
                      alt="OpenCV AI Technology" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/20 to-transparent flex items-end">
                      <div className="p-6">
                        <span className="text-sm text-white/80 bg-black/30 px-2 py-1 rounded-full">
                          AI-Powered OpenCV Technology
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default AboutPage;
