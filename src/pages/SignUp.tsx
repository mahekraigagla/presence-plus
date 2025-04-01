
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StudentSignup from '@/components/StudentSignup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';

const SignUp = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const navigate = useNavigate();

  const handleStudentSignupComplete = () => {
    navigate('/student-dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative z-10">
            <div className="absolute -z-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"></div>
            
            <Tabs 
              defaultValue="student" 
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'student' | 'teacher')}
              className="w-full"
            >
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2 text-gradient">Create Your Account</h1>
                <p className="text-muted-foreground">Join our attendance tracking system</p>
              </div>
              
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
              </TabsList>
              
              <TabsContent value="student">
                <StudentSignup 
                  onComplete={handleStudentSignupComplete} 
                  onCancel={() => navigate('/login')}
                />
              </TabsContent>
              
              <TabsContent value="teacher">
                <div className="glass dark:glass-dark p-8 rounded-2xl text-center">
                  <div className="py-12 px-4">
                    <h3 className="text-2xl font-semibold mb-4">Teacher Registration</h3>
                    <p className="text-muted-foreground mb-6">
                      Teacher registration is currently available through the administrator.
                      Please contact your institution's admin for an account.
                    </p>
                    <button 
                      onClick={() => navigate('/login')}
                      className="btn-primary"
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SignUp;
