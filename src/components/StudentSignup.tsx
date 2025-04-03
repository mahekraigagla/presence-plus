
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UserCheck, RefreshCw, Eye, EyeOff, GraduationCap, User, CreditCard, KeyRound, School, Camera } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';

const signupSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  rollNumber: z.string().min(3, "Roll number must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  department: z.string().min(1, "Department is required"),
  year: z.string().min(1, "Year is required"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface StudentSignupProps {
  onComplete: () => void;
  onCancel: () => void;
}

const StudentSignup: React.FC<StudentSignupProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'form' | 'face-registration' | 'saving'>('form');
  const [progress, setProgress] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignupFormValues | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceError, setFaceError] = useState('');
  const [duplicateAccount, setDuplicateAccount] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);
  const [faceImages, setFaceImages] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      rollNumber: '',
      fullName: '',
      password: '',
      department: '',
      year: '',
      email: ''
    },
  });

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      console.log("Starting camera...");
      setFaceError('');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setFaceError('Camera access not supported in your browser. Please try a different browser.');
        toast({
          title: "Camera Error",
          description: "Camera access not supported in your browser.",
          variant: "destructive"
        });
        return;
      }
      
      const constraints = {
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.autoplay = true;
        videoRef.current.playsInline = true;
        
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log("Video playback started successfully");
                setIsCapturing(true);
              })
              .catch(err => {
                console.error("Error playing video:", err);
                setFaceError('Error starting video stream. Please check camera permissions.');
              });
          }
        };
      } else {
        console.error("Video reference is null");
        setFaceError('Could not initialize camera. Please try again.');
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      let errorMessage = 'Unable to access camera. Please check your permissions and try again.';
      
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera access was denied. Please allow camera access in your browser settings.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please ensure your device has a working camera.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera is in use by another application. Please close other applications that might be using your camera.';
        }
      }
      
      setFaceError(errorMessage);
      toast({
        title: "Camera Error",
        description: errorMessage,
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
    if (videoRef.current && canvasRef.current && isCapturing) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL('image/png');
        
        if (captureCount < 3) {
          setFaceImages(prev => [...prev, image]);
          setCaptureCount(prev => prev + 1);
          
          toast({
            title: `Face ${captureCount + 1} captured`,
            description: captureCount < 2 ? "Please capture more face angles for better recognition" : "All faces captured!",
          });
          
          if (captureCount >= 2) {
            setCapturedImage(image);
            setFaceDetected(true);
            stopCamera();
          }
        } else {
          setCapturedImage(image);
          setFaceDetected(true);
          stopCamera();
        }
        
        detectFace(image);
      }
    }
  };

  const detectFace = (imageData: string) => {
    // In a real application, we would use a face detection library here
    // For now, we'll just simulate success
    setFaceDetected(true);
    setFaceError('');
  };

  const retryCapture = () => {
    setCapturedImage(null);
    setFaceImages([]);
    setCaptureCount(0);
    setFaceDetected(false);
    setFaceError('');
    startCamera();
  };

  const handleFormSubmit = async (values: SignupFormValues) => {
    try {
      console.log("Checking if account already exists...");
      const { data: existingStudents, error: studentCheckError } = await supabase
        .from('students')
        .select('id, email')
        .eq('email', values.email);
      
      if (studentCheckError) {
        console.error("Error checking existing students:", studentCheckError);
        throw studentCheckError;
      }
      
      const { data: existingTeachers, error: teacherCheckError } = await supabase
        .from('teachers')
        .select('id, email')
        .eq('email', values.email);
      
      if (teacherCheckError) {
        console.error("Error checking existing teachers:", teacherCheckError);
        throw teacherCheckError;
      }
      
      console.log("Existing students:", existingStudents);
      console.log("Existing teachers:", existingTeachers);
      
      if ((existingStudents && existingStudents.length > 0) || 
          (existingTeachers && existingTeachers.length > 0)) {
        setDuplicateAccount(true);
        toast({
          title: "Account already exists",
          description: "An account with this email already exists. Please log in instead.",
          variant: "destructive"
        });
        return;
      }
      
      setDuplicateAccount(false);
      setFormData(values);
      setStep('face-registration');
    } catch (error) {
      console.error("Error checking existing account:", error);
      toast({
        title: "Error",
        description: "Could not verify account. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFaceRegistrationComplete = async () => {
    if (!formData || !faceDetected || faceImages.length === 0) {
      toast({
        title: "Registration Error",
        description: "Please complete form and face registration to continue.",
        variant: "destructive"
      });
      return;
    }
    
    setStep('saving');
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 5;
      setProgress(progressValue);
      
      if (progressValue >= 100) {
        clearInterval(interval);
        completeSignup();
      }
    }, 50);
  };

  const completeSignup = async () => {
    try {
      if (!formData || faceImages.length === 0) return;
      
      console.log("Creating user with Supabase Auth...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      
      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }
      
      console.log("Auth data:", authData);
      
      if (authData.user) {
        console.log("Inserting student record...");
        const { error: studentError } = await supabase
          .from('students')
          .insert([{
            user_id: authData.user.id,
            full_name: formData.fullName,
            roll_number: formData.rollNumber,
            email: formData.email,
            department: formData.department,
            year: formData.year,
            face_image: faceImages[0],
            face_registered: true
          }]);
          
        if (studentError) {
          console.error("Student insert error:", studentError);
          throw studentError;
        }
        
        console.log("Student record created successfully");
        
        await supabase.auth.signOut();
        
        toast({
          title: "Registration successful",
          description: "Your face has been registered. Please log in to continue.",
        });
        
        onComplete();
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive"
      });
      setStep('form');
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto glass dark:glass-dark border-0 shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 dark:from-blue-900/10 dark:to-purple-900/10" />
      
      <CardHeader className="relative pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Student Registration</CardTitle>
            <CardDescription className="text-muted-foreground">
              {step === 'form' ? 'Create your account to start marking attendance' : 
               step === 'face-registration' ? 'Register your face for attendance verification' :
               'Creating your account...'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative p-6 pt-6">
        {duplicateAccount && (
          <div className="p-4 mb-6 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex gap-3">
              <div className="text-amber-600 dark:text-amber-400 mt-0.5">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-300">Account already exists</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                  An account with this email already exists. Please log in instead.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-3 bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300 dark:bg-amber-800/30 dark:hover:bg-amber-800/50 dark:text-amber-300 dark:border-amber-700"
                  onClick={onCancel}
                >
                  Go to Login
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {step === 'form' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
              <motion.div 
                variants={formVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="bg-white/50 dark:bg-gray-900/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="rollNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                          Roll Number
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., RN2023001" className="bg-white/50 dark:bg-gray-900/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" className="bg-white/50 dark:bg-gray-900/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Create a strong password" 
                              className="bg-white/50 dark:bg-gray-900/50 pr-10" 
                              {...field} 
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <School className="h-3.5 w-3.5 text-muted-foreground" />
                          Department
                        </FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="bg-white/50 dark:bg-gray-900/50">
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="COMP">COMP</SelectItem>
                              <SelectItem value="IT">IT</SelectItem>
                              <SelectItem value="AI-DS">AI-DS</SelectItem>
                              <SelectItem value="EXTC">EXTC</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                          Year
                        </FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="bg-white/50 dark:bg-gray-900/50">
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FY">FY</SelectItem>
                              <SelectItem value="SY">SY</SelectItem>
                              <SelectItem value="TY">TY</SelectItem>
                              <SelectItem value="LY">LY</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 pt-4 mt-4 border-t border-gray-100 dark:border-gray-800"
              >
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel} 
                  className="flex-1 bg-white dark:bg-gray-900"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Continue to Face Registration
                </Button>
              </motion.div>
            </form>
          </Form>
        )}

        {step === 'face-registration' && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold mb-2">Face Registration</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                We need to capture your face for attendance verification. Please ensure you're in a well-lit environment and your face is clearly visible.
              </p>
              {captureCount > 0 && (
                <div className="mt-2 text-primary font-medium">
                  {captureCount}/3 photos captured
                </div>
              )}
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 aspect-video rounded-lg overflow-hidden relative">
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
                  {faceImages.length > 0 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {faceImages.map((img, index) => (
                        <div 
                          key={index} 
                          className="w-12 h-12 rounded-full overflow-hidden border-2 border-white"
                        >
                          <img src={img} alt={`Face ${index+1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  {faceDetected && (
                    <div className="absolute inset-0 border-4 border-green-500 rounded-lg animate-pulse opacity-50"></div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <Camera className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">Camera preview will appear here</p>
                  <Button 
                    onClick={startCamera}
                    className="mt-4 bg-primary"
                    size="sm"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Enable Camera
                  </Button>
                </div>
              )}
            </div>
            
            {faceError && (
              <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm">
                {faceError}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              {isCapturing ? (
                <>
                  <Button 
                    onClick={captureImage}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Photo ({captureCount + 1}/3)
                  </Button>
                  {captureCount >= 3 && (
                    <Button 
                      onClick={() => {
                        stopCamera();
                        setFaceDetected(true);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Use These Photos
                    </Button>
                  )}
                </>
              ) : capturedImage ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={retryCapture}
                    className="flex-1"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retake Photos
                  </Button>
                  
                  <Button 
                    onClick={handleFaceRegistrationComplete}
                    disabled={!faceDetected || faceImages.length === 0}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Complete Registration
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={startCamera}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </Button>
              )}
            </div>
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button 
                variant="link" 
                onClick={() => setStep('form')}
                className="text-muted-foreground"
              >
                Back to Form
              </Button>
            </div>
          </div>
        )}
        
        {step === 'saving' && (
          <div className="py-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="flex flex-col items-center justify-center space-y-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-6">
                  <UserCheck className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-semibold">Creating Your Account</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  We're setting up your profile. This will only take a moment.
                </p>
              </div>
              
              <div className="w-full max-w-md">
                <Progress value={progress} className="h-2" />
                <p className="text-right text-xs text-muted-foreground mt-1">{progress}%</p>
              </div>
            </motion.div>
          </div>
        )}
      </CardContent>
      
      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
};

export default StudentSignup;
