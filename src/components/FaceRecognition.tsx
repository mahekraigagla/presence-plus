
import React, { useRef, useState, useEffect } from 'react';
import { Camera, User, Check, AlertCircle, CameraOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface FaceRecognitionProps {
  isRegistration?: boolean;
  onComplete?: (success: boolean) => void;
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({ 
  isRegistration = false,
  onComplete
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);
  const { toast } = useToast();

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
        setIsCameraAvailable(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCameraAvailable(false);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Check your browser permissions.",
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
    // For demo purposes, we're simulating a response after a delay
    setTimeout(() => {
      // Simulate successful registration
      const isSuccess = true;
      
      setVerificationStatus(isSuccess ? 'success' : 'failed');
      
      toast({
        title: isSuccess ? "Registration Successful" : "Registration Failed",
        description: isSuccess 
          ? "Your face has been registered successfully" 
          : "We couldn't register your face. Please try again.",
        variant: isSuccess ? "default" : "destructive"
      });
      
      // Store face registration status in localStorage
      if (isSuccess) {
        localStorage.setItem('faceRegistered', 'true');
      }
      
      if (onComplete) {
        onComplete(isSuccess);
      }
    }, 2000);
  };

  const verifyFace = (image: string) => {
    setVerificationStatus('verifying');
    
    // In a real app, you would send the image to a backend API for verification
    // For demo purposes, we're simulating a response after a delay
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes, but with higher success rate
      const isVerified = Math.random() > 0.2; // 80% success rate for demo
      
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

  return (
    <div className="glass dark:glass-dark rounded-lg p-6 space-y-6 max-w-md w-full mx-auto">
      <div className="text-center space-y-2">
        <h3 className="font-semibold flex justify-center items-center">
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
            : "Verify your identity to mark attendance"}
        </p>
      </div>
      
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center shadow-lg">
        {isCapturing ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured face"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            {isCameraAvailable ? (
              <>
                <User className="w-12 h-12 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Camera preview will appear here</span>
              </>
            ) : (
              <>
                <CameraOff className="w-12 h-12 text-red-500" />
                <span className="text-sm text-red-500">Camera not available</span>
                <p className="text-xs text-muted-foreground px-4 text-center">
                  Please check your camera permissions in browser settings
                </p>
              </>
            )}
          </div>
        )}
        
        {verificationStatus === 'verifying' && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
            <div className="text-white text-center space-y-2">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              <p>{isRegistration ? "Registering your face..." : "Verifying your identity..."}</p>
            </div>
            <div className="w-64">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        )}
        
        {verificationStatus === 'success' && (
          <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">
                {isRegistration ? "Registration Successful" : "Identity Verified"}
              </p>
              <p className="text-sm text-green-600/80 max-w-xs mx-auto">
                {isRegistration 
                  ? "Your face has been registered successfully. You can now use face recognition to mark your attendance." 
                  : "Your identity has been verified successfully. Your attendance has been marked."}
              </p>
            </div>
          </div>
        )}
        
        {verificationStatus === 'failed' && (
          <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-600 font-medium">
                {isRegistration ? "Registration Failed" : "Verification Failed"}
              </p>
              <p className="text-sm text-red-600/80 max-w-xs mx-auto">
                {isRegistration 
                  ? "We couldn't register your face. Please make sure your face is clearly visible and try again." 
                  : "We couldn't verify your identity. Please make sure your face is clearly visible and try again."}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="flex justify-center">
        {isCapturing ? (
          <Button 
            onClick={captureImage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Camera className="mr-2 h-4 w-4" />
            Capture Photo
          </Button>
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
    </div>
  );
};

export default FaceRecognition;
