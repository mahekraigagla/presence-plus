
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';

const MarkAttendancePage = () => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const startFaceRecognition = () => {
    setStatus('scanning');
    
    // Simulate face recognition process
    setTimeout(() => {
      // 80% chance of success for demo purposes
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        setStatus('success');
        toast({
          title: "Attendance Marked",
          description: "Your attendance has been recorded successfully.",
        });
      } else {
        setStatus('error');
        toast({
          title: "Face Recognition Failed",
          description: "Please ensure good lighting and try again.",
          variant: "destructive"
        });
      }
    }, 3000);
  };

  const resetProcess = () => {
    setStatus('idle');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-pattern overflow-hidden">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 mt-16">
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient">
                Mark Your Attendance
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                No manual entries—just look at the camera and you're done!
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 text-left">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Position Your Face</h3>
                    <p className="text-muted-foreground">
                      Center your face in the camera frame in a well-lit area
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 text-left">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Verification</h3>
                    <p className="text-muted-foreground">
                      Our AI will quickly verify your identity
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 text-left">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Attendance Confirmed</h3>
                    <p className="text-muted-foreground">
                      Your attendance is automatically recorded
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="glass dark:glass-dark rounded-2xl p-8 w-full max-w-md">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-6 border-2 border-primary/20">
                  {status === 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-center p-6">
                      <Camera className="h-20 w-20 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Camera will activate when you start</p>
                    </div>
                  )}
                  
                  {status === 'scanning' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/30">
                      <div className="w-64 h-64 border-4 border-primary rounded-full animate-pulse"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin mb-4 mx-auto"></div>
                        <p className="text-foreground font-medium">Scanning your face...</p>
                      </div>
                    </div>
                  )}
                  
                  {status === 'success' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/20 text-center p-6">
                      <CheckCircle className="h-20 w-20 text-green-500 mb-4" />
                      <h3 className="text-xl font-bold text-green-500 mb-2">Success!</h3>
                      <p className="text-muted-foreground">Your attendance has been marked</p>
                    </div>
                  )}
                  
                  {status === 'error' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/20 text-center p-6">
                      <AlertCircle className="h-20 w-20 text-red-500 mb-4" />
                      <h3 className="text-xl font-bold text-red-500 mb-2">Face Not Recognized</h3>
                      <p className="text-muted-foreground">Please try again with better lighting</p>
                    </div>
                  )}
                  
                  <img 
                    src="/placeholder.svg" 
                    alt="Camera feed placeholder" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="flex flex-col gap-3">
                  {(status === 'idle' || status === 'error') && (
                    <Button 
                      onClick={startFaceRecognition}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      size="lg"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Start Face Recognition
                    </Button>
                  )}
                  
                  {status === 'scanning' && (
                    <Button 
                      disabled
                      className="w-full"
                      size="lg"
                    >
                      Processing...
                    </Button>
                  )}
                  
                  {status === 'success' && (
                    <Button 
                      onClick={resetProcess}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Attendance Marked
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarkAttendancePage;
