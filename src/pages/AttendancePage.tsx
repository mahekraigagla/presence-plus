
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import FaceRecognition from '@/components/FaceRecognition';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

const AttendancePage = () => {
  const [searchParams] = useSearchParams();
  const { classId } = useParams();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const lectureId = searchParams.get('lecture') || '';
  const timestamp = searchParams.get('timestamp') || '';
  const latitude = searchParams.get('lat') || null;
  const longitude = searchParams.get('lng') || null;

  // Class information mapping
  const classInfo = {
    'cs101': 'Introduction to Computer Science',
    'cs102': 'Data Structures and Algorithms',
    'cs103': 'Database Systems',
  };

  useEffect(() => {
    // Check if user has registered face before
    // In a real app, this would check against user data in the backend
    const hasRegisteredFace = localStorage.getItem('faceRegistered') === 'true';
    setIsRegistered(hasRegisteredFace);
    
    // Check if the QR code has location restrictions
    if (latitude && longitude) {
      checkLocation(Number(latitude), Number(longitude));
    }
  }, [latitude, longitude]);

  const checkLocation = (targetLat: number, targetLng: number) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLat = position.coords.latitude;
          const currentLng = position.coords.longitude;
          
          // Calculate rough distance (this is a simplified calculation)
          const distance = calculateDistance(currentLat, currentLng, targetLat, targetLng);
          
          if (distance > 0.1) { // More than 100 meters away
            toast({
              title: "Location Verification Failed",
              description: "You're not in the required location to mark attendance",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Location Verified",
              description: "Your location has been verified",
            });
          }
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not verify your location. Please enable location services.",
            variant: "destructive"
          });
        }
      );
    }
  };

  // Simple distance calculation (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

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
                    {classId && lectureId ? (
                      <div className="space-y-1">
                        <p>Class: {classInfo[classId] || classId}</p>
                        <p>Lecture ID: {lectureId}</p>
                        <p>Date: {new Date(parseInt(timestamp) || Date.now()).toLocaleDateString()}</p>
                      </div>
                    ) : 'Mark your attendance'}
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
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg space-y-2">
                        <p>
                          <span className="font-medium">Class:</span> {classInfo[classId as string] || classId}
                        </p>
                        <p>
                          <span className="font-medium">Date:</span> {new Date().toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium">Time:</span> {new Date().toLocaleTimeString()}
                        </p>
                        <p>
                          <span className="font-medium">Verification Method:</span> QR Code + Face Recognition
                        </p>
                      </div>
                    </div>
                  ) : !isRegistered ? (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-medium">First Time? Register Your Face</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          To mark attendance, we need to register your face first.
                        </p>
                      </div>
                      
                      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="flex items-center justify-between w-full">
                            <div className="flex items-center text-sm">
                              <Info className="h-4 w-4 mr-2" />
                              <span>Why do we need your face data?</span>
                            </div>
                            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="text-sm p-4 bg-muted/50 rounded-lg mt-2 text-muted-foreground">
                          <p>Your face data is used to verify your identity when marking attendance. This ensures that 
                          attendance can only be marked by you and prevents proxy attendance.</p>
                          <p className="mt-2">Your data is securely stored and is only used for attendance verification purposes.</p>
                        </CollapsibleContent>
                      </Collapsible>
                      
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
