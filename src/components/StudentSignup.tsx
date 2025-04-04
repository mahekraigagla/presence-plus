
import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, UserPlus, Camera, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StudentSignupProps {
  onComplete: () => void;
  onCancel: () => void;
}

const studentSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  rollNumber: z.string().min(1, { message: 'Roll number is required' }),
  department: z.string().min(1, { message: 'Department is required' }),
  year: z.string().min(1, { message: 'Year is required' }),
});

// List of allowed student emails
const ALLOWED_STUDENT_EMAILS = [
  'mahek.raigagla@somaiya.edu',
  'jiya.mehta@gmail.com',
  'rahul@gmail.com',
  'manavi.k@gmail.com',
  'pratham.shah@gmail.com'
];

const StudentSignup: React.FC<StudentSignupProps> = ({ onComplete, onCancel }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'details' | 'face-capture'>('details');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [photosTaken, setPhotosTaken] = useState(0);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  
  // Create refs outside of any conditional render to ensure they're always available
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '123456789', // Default password as requested
      rollNumber: '',
      department: '',
      year: '',
    },
  });

  // Auto-fill the password field for the allowed emails
  useEffect(() => {
    const email = form.watch('email');
    if (ALLOWED_STUDENT_EMAILS.includes(email)) {
      form.setValue('password', '123456789');
    }
  }, [form.watch('email'), form]);

  // Stop camera when component unmounts or when leaving the face capture step
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle countdown for auto-capture
  useEffect(() => {
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
      setCameraError(null);
      console.log("Attempting to start camera...");
      
      // Stop any existing streams first
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      
      if (!videoRef.current) {
        console.error("Video ref is null before accessing camera");
        setCameraError("Camera component not initialized properly. Please refresh and try again.");
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      
      setCameraStream(stream);
      console.log("Camera stream obtained successfully");
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for metadata to load before playing
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded, attempting to play");
          
          if (videoRef.current) {
            // Ensure video element is not null when we try to play
            videoRef.current.play()
              .then(() => {
                console.log("Camera started successfully for face registration");
                setIsCapturing(true);
                // Start countdown for first photo after a short delay
                setTimeout(() => startCountdown(), 1500);
              })
              .catch(err => {
                console.error("Error starting camera playback:", err);
                setCameraError("Failed to start camera. Please check your permissions.");
                setIsCapturing(false);
              });
          }
        };
      } else {
        console.error("Video element reference is null after stream setup");
        setCameraError("Camera component not initialized properly. Please refresh and try again.");
      }
    } catch (err) {
      console.error("Camera access error:", err);
      let errorMessage = "Could not access camera. Please check your permissions.";
      
      if (err instanceof DOMException) {
        if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMessage = "No camera found on your device.";
        } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMessage = "Camera access denied. Please allow camera access.";
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMessage = "Camera already in use. Close other apps that might be using it.";
        }
      }
      
      setCameraError(errorMessage);
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    console.log("Stopping camera...");
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
      setCameraStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCapturing(false);
    console.log("Camera stopped");
  };

  const startCountdown = () => {
    console.log("Starting countdown for photo capture");
    setCountdown(3);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas ref is null during capture");
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Check if video is playing and has dimensions
    if (video.readyState !== 4 || video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("Video not ready for capture");
      toast({
        title: "Camera Error",
        description: "Camera stream not ready. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    console.log(`Capturing image with dimensions: ${video.videoWidth}x${video.videoHeight}`);
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (!context) {
      console.error("Could not get canvas context");
      return;
    }
    
    try {
      // Capture the image from video
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      console.log("Image captured successfully");
      
      // Store captured image
      setCapturedImages(prev => [...prev, imageData]);
      setPhotosTaken(prev => prev + 1);
      setCountdown(null);
      
      // If we've taken 3 photos, stop the camera
      if (photosTaken >= 2) { // This will be the 3rd photo (0, 1, 2)
        console.log("All photos captured, stopping camera");
        stopCamera();
      } else {
        // Reset countdown for next photo after a short delay
        console.log("Preparing for next photo");
        setTimeout(() => {
          startCountdown();
        }, 1000);
      }
    } catch (err) {
      console.error("Error during image capture:", err);
      toast({
        title: "Capture Error",
        description: "Failed to capture image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetCapture = () => {
    console.log("Resetting capture process");
    setCapturedImages([]);
    setPhotosTaken(0);
    setCountdown(null);
    startCamera();
  };

  const onDetailsSubmit = async (data: z.infer<typeof studentSchema>) => {
    console.log("Processing form submission:", data);
    
    // Check if email is in the allowed list
    if (!ALLOWED_STUDENT_EMAILS.includes(data.email.toLowerCase())) {
      toast({
        title: "Registration Restricted",
        description: "This email is not authorized for student registration.",
        variant: "destructive"
      });
      return;
    }
    
    // First, check if the email already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('students')
      .select('email')
      .eq('email', data.email);
    
    if (checkError) {
      console.error("Error checking existing user:", checkError);
      toast({
        title: "Signup Error",
        description: "Could not verify email uniqueness. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    if (existingUsers && existingUsers.length > 0) {
      toast({
        title: "Account Already Exists",
        description: "An account with this email already exists. Please log in instead.",
        variant: "destructive"
      });
      return;
    }
    
    // Proceed to face capture
    console.log("Details validated, proceeding to face capture");
    setCurrentStep('face-capture');
  };

  const completeSignup = async () => {
    setIsSubmitting(true);
    console.log("Completing signup process");
    
    try {
      const data = form.getValues();
      
      if (capturedImages.length === 0) {
        toast({
          title: "Face Registration Required",
          description: "Please capture your face photos before completing signup.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log("Creating Supabase auth user");
      // Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName
          }
        }
      });
      
      if (authError) {
        throw new Error(authError.message);
      }
      
      if (!authData.user) {
        throw new Error("Failed to create user account.");
      }
      
      console.log("Auth user created successfully, storing student details");
      // Store student details with face image
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: authData.user.id,
          full_name: data.fullName,
          email: data.email,
          roll_number: data.rollNumber,
          department: data.department,
          year: data.year,
          face_image: capturedImages[0], // Store first image
          face_registered: true
        });
      
      if (studentError) {
        console.error("Error creating student profile:", studentError);
        throw new Error(`Failed to create student profile: ${studentError.message}`);
      }
      
      console.log("Student profile created successfully");
      // Success!
      toast({
        title: "Account Created",
        description: "Your account has been created successfully. You can now log in.",
      });
      
      // Signal completion to parent
      onComplete();
      
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-md w-full max-w-lg mx-auto bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
      <CardContent className="pt-6">
        {currentStep === 'details' ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onDetailsSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Create a password" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rollNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your roll number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Information Technology">Information Technology</SelectItem>
                          <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                          <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                          <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="First Year">First Year</SelectItem>
                          <SelectItem value="Second Year">Second Year</SelectItem>
                          <SelectItem value="Third Year">Third Year</SelectItem>
                          <SelectItem value="Fourth Year">Fourth Year</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary"
                >
                  Next: Face Registration
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Face Registration</h3>
              <p className="text-sm text-muted-foreground">
                Please capture 3 photos of your face for identity verification
              </p>
              
              <div className="text-sm bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 p-3 rounded-md">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p>Make sure your face is clearly visible and well-lit</p>
                </div>
              </div>
            </div>
            
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              {isCapturing ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  
                  {countdown !== null && countdown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-black/70 flex items-center justify-center text-white text-4xl font-bold">
                        {countdown}
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-center">
                    Photo {photosTaken + 1} of 3
                  </div>
                </div>
              ) : capturedImages.length > 0 ? (
                <div className="relative w-full h-full">
                  <div className="grid grid-cols-3 gap-1 h-full">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="relative h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {index < capturedImages.length ? (
                          <img 
                            src={capturedImages[index]} 
                            alt={`Captured face ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs">Photo {index + 1}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="absolute top-2 right-2">
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {capturedImages.length}/3 captured
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                    <Camera className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500">Camera preview will appear here</p>
                  
                  {cameraError && (
                    <div className="mt-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 p-2 rounded max-w-xs text-center">
                      {cameraError}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="flex flex-col space-y-4">
              {!isCapturing && capturedImages.length === 0 ? (
                <Button 
                  onClick={startCamera} 
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </Button>
              ) : isCapturing ? (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={startCountdown}
                    disabled={countdown !== null}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {countdown !== null 
                      ? `Taking photo in ${countdown}...` 
                      : "Capture Photo"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={stopCamera}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {capturedImages.length === 3 ? (
                    <Button
                      onClick={completeSignup}
                      className="bg-green-600 hover:bg-green-700 col-span-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Account..." : "Complete Registration"}
                    </Button>
                  ) : (
                    <Button
                      onClick={startCamera}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Continue Capturing
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={resetCapture}
                    disabled={isSubmitting}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset Photos
                  </Button>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep('details')}
                  disabled={isSubmitting}
                >
                  Back to Details
                </Button>
                
                {capturedImages.length > 0 && capturedImages.length < 3 && (
                  <Button
                    variant="outline"
                    onClick={completeSignup}
                    disabled={isSubmitting || capturedImages.length === 0}
                  >
                    {isSubmitting ? "Creating Account..." : "Complete with Current Photos"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentSignup;
