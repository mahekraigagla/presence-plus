
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import FaceRecognition from '@/components/FaceRecognition';
import QRAuthVerification from '@/components/QRAuthVerification';
import Navbar from '@/components/Navbar';
import { Check, QrCode, UserX } from 'lucide-react';

const AttendancePage = () => {
  const { classId } = useParams<{ classId: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const lectureId = searchParams.get('lecture') || '';
  const timestamp = searchParams.get('timestamp') || '';
  const hasLocationData = searchParams.has('lat') && searchParams.has('lng');
  
  const [stage, setStage] = useState<'auth' | 'face-recognition' | 'success' | 'failed'>('auth');
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if the student has registered their face before
    const hasFaceRegistered = localStorage.getItem('faceRegistered') === 'true';
    setIsFirstVisit(!hasFaceRegistered);
    
    // Check if we have proper QR code data
    if (!classId || !lectureId || !timestamp) {
      toast({
        title: "Invalid QR Code",
        description: "This QR code is missing required information. Please scan a valid QR code.",
        variant: "destructive"
      });
    }
    
    // In a real app, you would fetch the lecture and class details from the API here
  }, [classId, lectureId, timestamp, toast]);

  const handleAuthComplete = (success: boolean) => {
    if (success) {
      setStage('face-recognition');
    } else {
      toast({
        title: "Authentication Failed",
        description: "Could not verify your identity. Please try again or contact your teacher.",
        variant: "destructive"
      });
    }
  };

  const handleFaceRecognitionComplete = (success: boolean) => {
    if (success) {
      setStage('success');
      setAttendanceMarked(true);
      
      // In a real app, you would submit the attendance to an API here
      toast({
        title: "Attendance Marked",
        description: `Your attendance for ${getClassNameById(classId || '')} has been recorded successfully.`,
      });
    } else {
      setStage('failed');
      toast({
        title: "Face Recognition Failed",
        description: "Could not verify your face. Please try again or contact your teacher.",
        variant: "destructive"
      });
    }
  };

  // Mock function to get class name from class ID
  const getClassNameById = (id: string) => {
    const classes: Record<string, string> = {
      'cs101': 'Introduction to Computer Science',
      'cs102': 'Data Structures and Algorithms',
      'cs103': 'Database Systems',
    };
    return classes[id] || `Class ${id}`;
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
            className="grid grid-cols-1 gap-6"
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
              <h1 className="text-2xl font-bold">{getClassNameById(classId || '')}</h1>
              <p className="text-muted-foreground mt-1">Attendance verification for Lecture {lectureId.split('-')[1] || lectureId}</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex justify-center">
              {stage === 'auth' && (
                <QRAuthVerification 
                  qrData={{
                    lectureId,
                    classId: classId || '',
                    lectureName: getClassNameById(classId || ''),
                    teacherName: 'Prof. Anderson',
                    timestamp: parseInt(timestamp),
                    location: hasLocationData ? {
                      lat: parseFloat(searchParams.get('lat') || '0'),
                      lng: parseFloat(searchParams.get('lng') || '0'),
                    } : undefined,
                  }}
                  onComplete={handleAuthComplete}
                />
              )}
              
              {stage === 'face-recognition' && (
                <FaceRecognition 
                  isRegistration={isFirstVisit}
                  onComplete={handleFaceRecognitionComplete}
                />
              )}
              
              {stage === 'success' && (
                <Card className="w-full max-w-md mx-auto glass dark:glass-dark">
                  <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 dark:bg-green-900/30">
                      <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Attendance Confirmed</h2>
                    <p className="text-muted-foreground mb-6">
                      Your attendance has been successfully recorded for {getClassNameById(classId || '')}.
                    </p>
                    <div className="w-full p-4 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                        <span className="font-medium">{new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Time:</span>
                        <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Lecture ID:</span>
                        <span className="font-medium">{lectureId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Verification:</span>
                        <span className="font-medium">QR + Face Recognition</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      A confirmation has been sent to your registered email address.
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {stage === 'failed' && (
                <Card className="w-full max-w-md mx-auto glass dark:glass-dark">
                  <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6 dark:bg-red-900/30">
                      <UserX className="h-10 w-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
                    <p className="text-muted-foreground mb-6">
                      We couldn't verify your identity. Please try again or contact your teacher for assistance.
                    </p>
                    <button 
                      className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded"
                      onClick={() => setStage('face-recognition')}
                    >
                      Try Again
                    </button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AttendancePage;
