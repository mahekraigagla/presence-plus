
import React, { useState, useEffect, useRef } from 'react';
import { Camera, User, Check, AlertCircle, CameraOff, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface FaceVerificationProps {
  classId: string;
  lectureId: string;
  timestamp: string;
}

const FaceVerification: React.FC<FaceVerificationProps> = ({ 
  classId,
  lectureId,
  timestamp
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);
  const [cameraError, setCameraError] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please login to mark attendance",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }
        
        // Get student profile
        const { data: student, error } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (error || !student) {
          console.error("Error fetching student data:", error);
          toast({
            title: "Profile not found",
            description: "Could not find your student profile",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }
        
        console.log("Student data fetched:", student);
        setStudentData(student);

        // Check if student has registered their face
        if (!student.face_registered || !student.face_image) {
          toast({
            title: "Face not registered",
            description: "You need to register your face first. Please contact your administrator.",
            variant: "destructive"
          });
          navigate('/student-dashboard');
        }
      } catch (err) {
        console.error("Error setting up face verification:", err);
        toast({
          title: "Setup Error",
          description: "An error occurred while setting up face verification",
          variant: "destructive"
        });
      }
    };

    fetchStudentData();

    return () => {
      // Cleanup camera stream when component unmounts
      if (isCapturing) {
        stopCamera();
      }
    };
  }, [navigate, toast]);

  useEffect(() => {
    // Progress bar animation for verification
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
    // Handle countdown for auto-capture
    if (countdown === null || !isCapturing) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      captureImage();
    }
  }, [countdown, isCapturing]);

  const startCamera = async () => {
    try {
      // Reset states
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

  const verifyFace = async (capturedFaceImage: string) => {
    if (!studentData || !studentData.face_image) {
      toast({
        title: "Verification Failed",
        description: "No registered face found. Please register your face first.",
        variant: "destructive"
      });
      setVerificationStatus('failed');
      return;
    }
    
    setVerificationStatus('verifying');
    
    try {
      // In a real-world application, you would send both images to the server
      // for comparison using a facial recognition library like face-api.js
      
      // For this demo, we'll simulate verification with a delay
      setTimeout(async () => {
        try {
          // In a real implementation, this would be the result of the face comparison
          const isVerified = true;
          
          // If verified, record attendance
          if (isVerified) {
            // Insert attendance record
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
          }
          
          setVerificationStatus(isVerified ? 'success' : 'failed');
          
          toast({
            title: isVerified ? "Identity Verified" : "Verification Failed",
            description: isVerified 
              ? "Your identity has been successfully verified and attendance has been marked." 
              : "We couldn't verify your identity. Please try again.",
            variant: isVerified ? "default" : "destructive"
          });
          
        } catch (error) {
          console.error("Verification processing error:", error);
          setVerificationStatus('failed');
          toast({
            title: "Verification Error",
            description: "An error occurred during verification.",
            variant: "destructive"
          });
        }
      }, 2000);
      
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus('failed');
      toast({
        title: "Verification Error",
        description: "An error occurred during verification.",
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

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
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
          Verify your identity to mark attendance for class {classId}
        </p>
      </div>
      
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center shadow-inner border border-gray-200 dark:border-gray-700">
        <AnimatePresence mode="wait">
          {isCapturing ? (
            <motion.div key="camera" {...fadeIn} className="w-full h-full relative">
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
            </motion.div>
          ) : capturedImage ? (
            <motion.div key="captured" {...fadeIn} className="w-full h-full">
              <img
                src={capturedImage}
                alt="Captured face"
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            <motion.div key="placeholder" {...fadeIn} className="flex flex-col items-center justify-center space-y-4 p-6">
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
                    <CameraOff className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-red-600 font-medium">Camera not available</p>
                    <p className="text-sm text-muted-foreground px-4 text-center">
                      {cameraError || "Please check your camera permissions in browser settings"}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
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
                Identity Verified
              </p>
              <p className="text-sm text-green-600/80">
                Your identity has been verified successfully. Your attendance has been marked.
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
                We couldn't verify your identity. Please make sure your face is clearly visible and try again.
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
                : "Take photo (Auto in 3s)"}
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
            {verificationStatus === 'success' ? (
              <Button variant="outline" onClick={retryCapture}>
                <Camera className="mr-2 h-4 w-4" />
                Take New Photo
              </Button>
            ) : (
              <Button 
                onClick={retryCapture} 
                variant={verificationStatus === 'failed' ? 'default' : 'outline'}
                className={verificationStatus === 'failed' ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
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
      
      {cameraError && !isCapturing && !capturedImage && (
        <div className="text-center mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCameraError('');
              setIsCameraAvailable(true);
              startCamera();
            }}
          >
            <RefreshCw className="mr-2 h-3 w-3" />
            Retry Camera Access
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default FaceVerification;
