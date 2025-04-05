
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { User, ChevronLeft, Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { OpenCVAttendanceData } from '@/integrations/types/attendance-types';

const FaceAttendancePage = () => {
  const { classId = '' } = useParams<{ classId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studentData, setStudentData] = useState<any>(null);
  const [rollNumber, setRollNumber] = useState('');
  const [verifying, setVerifying] = useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const lectureId = searchParams.get('lecture') || '';
  const timestamp = searchParams.get('timestamp') || '';
  
  // Verification process
  const verifyRollNumber = async () => {
    if (!rollNumber.trim()) {
      toast({
        title: "Roll Number Required",
        description: "Please enter your roll number",
        variant: "destructive"
      });
      return;
    }
    
    setVerifying(true);
    
    try {
      // Fetch student data by roll number
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('roll_number', rollNumber.trim())
        .single();
      
      if (error || !data) {
        throw new Error('Invalid roll number. Please check and try again.');
      }
      
      setStudentData(data);
      
      toast({
        title: "Student Found",
        description: `Welcome, ${data.full_name}. Please proceed with face verification.`
      });
      
      // Prepare the data for the external OpenCV application
      const attendanceData: OpenCVAttendanceData = {
        studentId: data.id,
        classId: classId,
        lectureId: lectureId,
        timestamp: timestamp || new Date().toISOString()
      };
      
      // Store the data in localStorage for the external application to access
      localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
      
      // Open the external OpenCV application
      openExternalAttendanceSystem();
      
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Could not verify roll number",
        variant: "destructive"
      });
      setStudentData(null);
    } finally {
      setVerifying(false);
    }
  };

  const openExternalAttendanceSystem = () => {
    // Open the external OpenCV application in a new window
    window.open('https://github.com/mahekraigagla/opencv.git', '_blank');
    
    toast({
      title: "Opening Attendance System",
      description: "The face recognition system is opening in a new window. Please follow the instructions there."
    });
  };

  const handleReturnToDashboard = () => {
    navigate('/student-dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <h1 className="text-3xl font-bold">Mark Attendance</h1>
            <p className="text-muted-foreground">
              Please verify your identity to mark attendance for class {classId}
            </p>
          </div>
          
          <div className="max-w-md mx-auto space-y-6">
            {/* Roll Number Verification */}
            {!studentData && (
              <Card>
                <CardHeader>
                  <CardTitle>Student Verification</CardTitle>
                  <CardDescription>Enter your roll number to proceed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="roll-number" className="text-sm font-medium">Roll Number</label>
                      <Input
                        id="roll-number"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="Enter your roll number"
                        disabled={verifying}
                      />
                    </div>
                    
                    <Button 
                      onClick={verifyRollNumber}
                      className="w-full"
                      disabled={verifying}
                    >
                      {verifying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify Roll Number'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Face Verification Instructions */}
            {studentData && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass dark:glass-dark rounded-lg p-6 space-y-6 max-w-md w-full mx-auto shadow-lg"
              >
                <div className="text-center space-y-2">
                  <h3 className="font-semibold flex justify-center items-center text-xl">
                    <Shield className="mr-2 h-5 w-5" />
                    Face Recognition
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Hi {studentData.full_name}, please complete the face recognition in the new window
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0 text-blue-500">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-medium">Instructions:</p>
                      <ol className="list-decimal pl-5 mt-1 space-y-1">
                        <li>The face recognition system has opened in a new window</li>
                        <li>Follow the instructions provided in that window</li>
                        <li>Your attendance will be marked after successful verification</li>
                        <li>Return here when complete</li>
                      </ol>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => openExternalAttendanceSystem()}
                  >
                    Reopen Face Recognition
                  </Button>
                  
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleReturnToDashboard}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FaceAttendancePage;
