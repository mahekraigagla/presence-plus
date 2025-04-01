
import React, { useRef, useState, useEffect } from 'react';
import { Camera, User, Check, AlertCircle, CameraOff, RefreshCw, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FaceRecognitionProps {
  isRegistration?: boolean;
  onComplete?: (success: boolean) => void;
  studentName?: string;
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({ 
  isRegistration = false,
  onComplete,
  studentName = 'Student'
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
  const { toast } = useToast();

  // Helper function to get stored face data
  const getStoredFaceData = () => {
    const currentStudent = JSON.parse(localStorage.getItem('currentStudent') || '{}');
    return currentStudent.faceData || null;
  };

  // Helper function to store face data
  const storeFaceData = (faceData: string) => {
    // Get current student
    const currentStudent = JSON.parse(localStorage.getItem('currentStudent') || '{}');
    currentStudent.faceData = faceData;
    currentStudent.faceRegistered = true;
    
    // Update current student
    localStorage.setItem('currentStudent', JSON.stringify(currentStudent));
    
    // Also update in the students array
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const updatedStudents = students.map((s: any) => 
      s.rollNumber === currentStudent.rollNumber ? currentStudent : s
    );
    
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  useEffect(() => {
    return () => {
      // Cleanup camera stream when component unmounts
      if (isCapturing) {
        stopCamera();
      }
    };
  }, [isCapturing]);

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
        
        if (isRegistration) {
          registerFace(image);
        } else {
          verifyFace(image);
        }
      }
    }
  };

  const registerFace = (image: string) => {
    setVerificationStatus('verifying');
    
    // In a real app, you would send the image to a backend API for registration
    // For demo purposes, we'll store it in localStorage
    setTimeout(() => {
      // Store face data in localStorage
      storeFaceData(image);
      
      setVerificationStatus('success');
      
      toast({
        title: "Registration Successful",
        description: "Your face has been registered successfully",
      });
      
      // Notify parent component
      if (onComplete) {
        onComplete(true);
      }
    }, 2000);
  };

  const verifyFace = (image: string) => {
    setVerificationStatus('verifying');
    
    // In a real app, you would send the image to a backend API for verification
    // For demo purposes, we're simulating by checking localStorage
    setTimeout(() => {
      const storedFaceData = getStoredFaceData();
      
      // If no face data is stored, verification fails
      if (!storedFaceData) {
        setVerificationStatus('failed');
        toast({
          title: "Verification Failed",
          description: "No registered face found. Please register your face first.",
          variant: "destructive"
        });
        
        if (onComplete) {
          onComplete(false);
        }
        return;
      }
      
      // For demo purposes, we'll assume verification is successful
      // In a real app, you would use a face comparison algorithm
      const isVerified = true;
      
      setVerificationStatus(isVerified ? 'success' : 'failed');
      
      toast({
        title: isVerified ? "Identity Verified" : "Verification Failed",
        description: isVerified 
          ? "Your identity has been successfully verified" 
          : "We couldn't verify your identity. Please try again.",
        variant: isVerified ? "default" : "destructive"
      });
      
      if (onComplete) {
        onComplete(isVerified);
      }
    }, 2000);
  };

  const retryCapture = () => {
    setCapturedImage(null);
    setVerificationStatus('idle');
    startCamera();
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
          {isRegistration ? (
            <>
              <User className="mr-2 h-5 w-5" />
              Face Registration
            </>
          ) : (
            <>
              <Camera className="mr-2 h-5 w-5" />
              Face Recognition
            </>
          )}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isRegistration 
            ? "Register your face to mark attendance in the future" 
            : `Verify your identity to mark attendance, ${studentName}`}
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
                  <Avatar className="w-16 h-16">
                    <AvatarFallback>{studentName?.[0] || 'S'}</AvatarFallback>
                  </Avatar>
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
              <Loader2 className="h-12 w-12 animate-spin mx-auto" />
              <p className="font-medium">{isRegistration ? "Registering your face..." : "Verifying your identity..."}</p>
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
                {isRegistration ? "Registration Successful" : "Identity Verified"}
              </p>
              <p className="text-sm text-green-600/80">
                {isRegistration 
                  ? "Your face has been registered successfully. You can now use face recognition to mark your attendance." 
                  : "Your identity has been verified successfully. Your attendance has been marked."}
              </p>
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
                {isRegistration ? "Registration Failed" : "Verification Failed"}
              </p>
              <p className="text-sm text-red-600/80">
                {isRegistration 
                  ? "We couldn't register your face. Please make sure your face is clearly visible and try again." 
                  : "We couldn't verify your identity. Please make sure your face is clearly visible and try again."}
              </p>
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

export default FaceRecognition;
