
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StudentSignup from '@/components/StudentSignup';
import TeacherSignup from '@/components/TeacherSignup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const SignUp = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignupComplete = () => {
    // Clear any previous errors
    setError(null);
    
    // Show success toast
    toast({
      title: 'Registration Complete',
      description: 'Your account has been created. Please log in to continue.',
      variant: 'default'
    });
    
    // Redirect to login page after signup
    navigate('/login');
  };

  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4 mt-16">
        <motion.div 
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative z-10">
            <div className="absolute -z-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"></div>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Signup Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
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
                  onComplete={handleSignupComplete} 
                  onCancel={handleCancel}
                />
              </TabsContent>
              
              <TabsContent value="teacher">
                <TeacherSignup 
                  onComplete={handleSignupComplete} 
                  onCancel={handleCancel}
                />
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SignUp;
