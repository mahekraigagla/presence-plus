
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import FaceRecognition from '@/components/FaceRecognition';

const AttendancePage = () => {
  const [searchParams] = useSearchParams();
  const { classId } = useParams();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const { toast } = useToast();
  
  const lectureId = searchParams.get('lecture') || '';
  const timestamp = searchParams.get('timestamp') || '';

  useEffect(() => {
    // Check if user has registered face before
    // In a real app, this would check against user data in the backend
    const hasRegisteredFace = localStorage.getItem('faceRegistered') === 'true';
    setIsRegistered(hasRegisteredFace);
  }, []);

  const handleRegistrationComplete = (success: boolean) => {
    if (success) {
      localStorage.setItem('faceRegistered', 'true');
      setIsRegistered(true);
      toast({
        title: "Face Registration Successful",
        description: "Your face has been registered for future attendance.",
      });
    }
  };

  const handleVerificationComplete = (success: boolean) => {
    setIsVerified(success);
    if (success) {
      // Mark attendance in the system
      setAttendanceMarked(true);
      toast({
        title: "Attendance Marked",
        description: "Your attendance has been successfully recorded.",
      });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar userRole="student" />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-2xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { delayChildren: 0.1, staggerChildren: 0.1 }
              }
            }}
          >
            <motion.div variants={fadeInUp}>
              <Card className="glass dark:glass-dark">
                <CardHeader className="text-center">
                  <CardTitle>Attendance Verification</CardTitle>
                  <CardDescription>
                    {lectureId ? `Class: ${classId}, Lecture ID: ${lectureId}` : 'Mark your attendance'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {attendanceMarked ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-green-600">Attendance Successful!</h3>
                      <p className="text-muted-foreground">
                        Your attendance has been recorded for this lecture.
                      </p>
                      <p className="text-sm">
                        Time: {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  ) : !isRegistered ? (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-medium">First Time? Register Your Face</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          To mark attendance, we need to register your face first.
                        </p>
                      </div>
                      <FaceRecognition isRegistration onComplete={handleRegistrationComplete} />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-medium">Verify Your Identity</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Look into the camera to verify your identity and mark attendance.
                        </p>
                      </div>
                      <FaceRecognition onComplete={handleVerificationComplete} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AttendancePage;
