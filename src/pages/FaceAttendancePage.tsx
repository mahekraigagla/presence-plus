
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Camera, Check, AlertCircle, User, ChevronLeft, Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

const FaceAttendancePage = () => {
  const { classId = '' } = useParams<{ classId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studentData, setStudentData] = useState<any>(null);
  const [rollNumber, setRollNumber] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);
  const [cameraError, setCameraError] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [storedFaceImage, setStoredFaceImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
      
      if (!data.face_registered || !data.face_image) {
        throw new Error('Face not registered. Please contact your administrator.');
      }
      
      setStudentData(data);
      setStoredFaceImage(data.face_image);
      
      toast({
        title: "Student Found",
        description: `Welcome, ${data.full_name}. Please proceed with face verification.`
      });
      
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
  
  // Camera functions
  const startCamera = async () => {
    try {
      setCameraError('');
      setIsCameraAvailable(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error("Error playing video:", err);
            setCameraError("Could not start video stream. Please check your permissions.");
            setIsCameraAvailable(false);
          });
          setIsCapturing(true);
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCameraAvailable(false);
      
      if (err instanceof DOMException) {
        if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setCameraError("No camera found. Please ensure your device has a camera.");
        } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError("Camera access denied. Please allow camera access in your browser permissions.");
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setCameraError("Your camera is in use by another application. Please close other programs using your camera.");
        } else {
          setCameraError(`Camera error: ${err.message || "Unknown error"}`);
        }
      } else {
        setCameraError("Could not access camera. Please check your browser permissions.");
      }
      
      toast({
        title: "Camera Error",
        description: cameraError || "Could not access your camera. Check your browser permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCapturing(false);
    }
  };

  const startCountdown = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null || !isCapturing) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      captureImage();
    }
  }, [countdown, isCapturing]);

  useEffect(() => {
    if (verificationStatus === 'verifying') {
      let progressValue = 0;
      const interval = setInterval(() => {
        progressValue += 4;
        setProgress(progressValue);
        if (progressValue >= 100) {
          clearInterval(interval);
        }
      }, 80);
      
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [verificationStatus]);

  useEffect(() => {
    return () => {
      if (isCapturing) {
        stopCamera();
      }
    };
  }, [isCapturing]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL('image/png');
        setCapturedImage(image);
        stopCamera();
        setCountdown(null);
        
        verifyFace(image);
      }
    }
  };

  const verifyFace = (image: string) => {
    setVerificationStatus('verifying');
    
    try {
      if (!storedFaceImage) {
        setVerificationStatus('failed');
        toast({
          title: "Verification Failed",
          description: "No registered face found. Please register your face first.",
          variant: "destructive"
        });
        return;
      }
      
      setTimeout(async () => {
        try {
          // In a real-world app, you would use a face recognition library here
          // For this demo, we'll simulate a successful match
          const isVerified = true;
          
          if (isVerified) {
            // Record attendance
            const { error: attendanceError } = await supabase
              .from('attendance_records')
              .insert([
                {
                  student_id: studentData.id,
                  class_id: classId,
                  lecture_id: lectureId,
                  timestamp: timestamp || new Date().toISOString(),
                  verification_method: 'face_recognition',
                  status: 'Present'
                }
              ]);
            
            if (attendanceError) {
              console.error("Error recording attendance:", attendanceError);
              toast({
                title: "Attendance Error",
                description: "Error recording attendance: " + attendanceError.message,
                variant: "destructive"
              });
              setVerificationStatus('failed');
              return;
            }
            
            setVerificationStatus('success');
            
            toast({
              title: "Attendance Marked",
              description: "Your attendance has been successfully recorded.",
            });
          } else {
            setVerificationStatus('failed');
            
            toast({
              title: "Verification Failed",
              description: "Face does not match! Attendance not marked.",
              variant: "destructive"
            });
          }
        } catch (error: any) {
          console.error("Verification error:", error);
          setVerificationStatus('failed');
          
          toast({
            title: "Verification Error",
            description: error.message || "An error occurred during face verification",
            variant: "destructive"
          });
        }
      }, 2000);
    } catch (error: any) {
      console.error("Face verification error:", error);
      setVerificationStatus('failed');
      
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify your face",
        variant: "destructive"
      });
    }
  };

  const retryCapture = () => {
    setCapturedImage(null);
    setVerificationStatus('idle');
    startCamera();
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
            
            {/* Face Verification */}
            {studentData && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass dark:glass-dark rounded-lg p-6 space-y-6 max-w-md w-full mx-auto shadow-lg"
              >
                <div className="text-center space-y-2">
                  <h3 className="font-semibold flex justify-center items-center text-xl">
                    <Shield className="mr-2 h-5 w-5" />
                    Face Verification
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Hi {studentData.full_name}, please verify your identity
                  </p>
                </div>
                
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center shadow-inner border border-gray-200 dark:border-gray-700">
                  {isCapturing ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {countdown !== null && countdown > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-black/70 flex items-center justify-center text-white text-4xl font-bold">
                            {countdown}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : capturedImage ? (
                    <div className="w-full h-full">
                      <img
                        src={capturedImage}
                        alt="Captured face"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 p-6">
                      {isCameraAvailable ? (
                        <>
                          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                          </div>
                          <div className="text-center space-y-2">
                            <p className="text-muted-foreground">Camera preview will appear here</p>
                            <p className="text-sm text-muted-foreground">Click "Start Camera" below to begin</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center dark:bg-red-900/30">
                            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="text-center space-y-2">
                            <p className="text-red-600 font-medium">Camera not available</p>
                            <p className="text-sm text-muted-foreground px-4 text-center">
                              {cameraError || "Please check your camera permissions in browser settings"}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  
                  {verificationStatus === 'verifying' && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                      <div className="text-white text-center space-y-2">
                        <div className="h-12 w-12 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full"></div>
                        <p className="font-medium">Verifying your identity...</p>
                      </div>
                      <div className="w-64">
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                  )}
                  
                  {verificationStatus === 'success' && (
                    <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center space-y-4 bg-white/90 dark:bg-gray-800/90 p-6 rounded-lg max-w-xs">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                          <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-green-600 font-bold text-xl">
                          Attendance Marked
                        </p>
                        <p className="text-sm text-green-600/80">
                          Your attendance has been successfully recorded for this class.
                        </p>
                        <Button 
                          onClick={handleReturnToDashboard}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          Return to Dashboard
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {verificationStatus === 'failed' && (
                    <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center space-y-4 bg-white/90 dark:bg-gray-800/90 p-6 rounded-lg max-w-xs">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                          <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <p className="text-red-600 font-bold text-xl">
                          Verification Failed
                        </p>
                        <p className="text-sm text-red-600/80">
                          Face does not match! Attendance not marked. Please try again.
                        </p>
                        <Button 
                          onClick={retryCapture}
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <canvas ref={canvasRef} className="hidden" />
                
                <div className="flex justify-center space-x-2">
                  {isCapturing ? (
                    <>
                      <Button 
                        onClick={startCountdown} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        disabled={countdown !== null}
                      >
                        {countdown !== null 
                          ? `Taking photo in ${countdown}...` 
                          : "Take photo"}
                      </Button>
                      <Button 
                        onClick={captureImage}
                        variant="outline"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Capture Now
                      </Button>
                    </>
                  ) : capturedImage ? (
                    <div className="flex space-x-4">
                      {verificationStatus === 'idle' && (
                        <Button 
                          onClick={retryCapture} 
                          variant="outline"
                        >
                          Retake Photo
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button 
                      onClick={startCamera}
                      disabled={!isCameraAvailable}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Start Camera
                    </Button>
                  )}
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
