
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Camera, Check, AlertCircle, RotateCcw, Loader2, UserCheck, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface FaceVerificationProps {
  classId: string;
  lectureId: string;
  timestamp: string;
}

const FaceVerification: React.FC<FaceVerificationProps> = ({ classId, lectureId, timestamp }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'failure' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    if (!rollNumber) {
      setErrorMessage('Please enter your ID card number first');
      return;
    }
    
    setErrorMessage('');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCapturing(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setErrorMessage('Could not access camera. Please check permissions or try a different browser.');
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
    if (!videoRef.current || !canvasRef.current) return;
    
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
      verifyFace(image);
    }
  };

  const verifyFace = async (capturedImage: string) => {
    setIsVerifying(true);
    
    try {
      // Get student data from Supabase
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('roll_number', rollNumber)
        .single();
      
      if (studentError) throw new Error('Student not found with this ID card number');
      
      if (!studentData.face_registered || !studentData.face_image) {
        throw new Error('Face not registered. Please register your face first.');
      }
      
      // In a real app, you would compare the captured image with the stored face image
      // using face recognition algorithms like face-api.js or similar libraries
      // For this demo, we'll simulate a match
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate match/non-match (80% success rate for demo)
      const isMatch = Math.random() > 0.2;
      
      if (isMatch) {
        // If match, record attendance
        const { error: attendanceError } = await supabase
          .from('attendance_records')
          .insert([{
            student_id: studentData.id,
            class_id: classId,
            lecture_id: lectureId,
            timestamp: new Date().toISOString(),
            verification_method: 'Face Recognition',
            status: 'Present'
          }]);
        
        if (attendanceError) throw attendanceError;
        
        setVerificationResult('success');
        toast({
          title: "Attendance Marked",
          description: "Your face has been verified successfully and attendance has been recorded.",
        });
      } else {
        setVerificationResult('failure');
        toast({
          title: "Verification Failed",
          description: "Your face does not match our records. Please try again or contact support.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setVerificationResult('failure');
      setErrorMessage(error.message || 'Face verification failed. Please try again.');
      toast({
        title: "Verification Failed",
        description: error.message || "An error occurred during verification.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const resetProcess = () => {
    setCapturedImage(null);
    setVerificationResult(null);
    setErrorMessage('');
  };

  const goBack = () => {
    if (verificationResult === 'success') {
      navigate('/student-dashboard');
    } else {
      resetProcess();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-4 max-w-2xl"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <UserCheck className="h-6 w-6" />
            Face Verification
          </CardTitle>
          <CardDescription className="text-white/80">
            Verify your identity to mark attendance
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          {verificationResult === 'success' ? (
            <div className="py-8 text-center space-y-6">
              <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">Attendance Marked!</h3>
                <p className="text-muted-foreground">
                  Your attendance has been successfully recorded.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                <dl className="divide-y divide-green-100 dark:divide-green-900/30">
                  <div className="flex justify-between py-2">
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Class:</dt>
                    <dd className="text-sm font-medium">{classId}</dd>
                  </div>
                  <div className="flex justify-between py-2">
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Lecture:</dt>
                    <dd className="text-sm font-medium">{lectureId}</dd>
                  </div>
                  <div className="flex justify-between py-2">
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Time:</dt>
                    <dd className="text-sm font-medium">{new Date().toLocaleTimeString()}</dd>
                  </div>
                  <div className="flex justify-between py-2">
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Date:</dt>
                    <dd className="text-sm font-medium">{new Date().toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>
              
              <Button onClick={goBack} className="w-full">
                Return to Dashboard
              </Button>
            </div>
          ) : verificationResult === 'failure' ? (
            <div className="py-8 text-center space-y-6">
              <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">Verification Failed</h3>
                <p className="text-muted-foreground">
                  {errorMessage || "Your face does not match our records. Attendance was not marked."}
                </p>
              </div>
              
              <Button onClick={resetProcess} variant="outline" className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              
              <Button onClick={goBack} variant="ghost" className="w-full">
                Return to Dashboard
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="rollNumber">ID Card Number</Label>
                <Input
                  id="rollNumber"
                  placeholder="Enter your ID card number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  disabled={isCapturing || isVerifying}
                />
              </div>
              
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {isCapturing ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : capturedImage ? (
                  <div className="relative">
                    <img
                      src={capturedImage}
                      alt="Captured face"
                      className="w-full h-full object-cover"
                    />
                    {isVerifying && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="h-12 w-12 text-white animate-spin" />
                        <p className="text-white text-sm">Verifying your face...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <User className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-muted-foreground text-center px-8">
                      Enter your ID card number and click "Start Camera" to begin
                    </p>
                  </div>
                )}
              </div>
              
              {errorMessage && (
                <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm">
                  {errorMessage}
                </div>
              )}
              
              <div className="space-y-3">
                {isCapturing ? (
                  <Button
                    className="w-full"
                    onClick={captureImage}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Image
                  </Button>
                ) : capturedImage ? (
                  isVerifying ? (
                    <Button disabled className="w-full">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={resetProcess}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Retake Photo
                    </Button>
                  )
                ) : (
                  <Button
                    className="w-full"
                    disabled={!rollNumber}
                    onClick={startCamera}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate('/student-dashboard')}
                  disabled={isVerifying}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
};

export default FaceVerification;
