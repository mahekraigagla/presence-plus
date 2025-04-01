
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserRound, Lock, LogIn, AlertCircle, Fingerprint } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StudentLoginProps {
  onLoginSuccess: () => void;
  onSignupClick: () => void;
}

const StudentLogin: React.FC<StudentLoginProps> = ({ onLoginSuccess, onSignupClick }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rollNumber || !password) {
      setError('Please enter both roll number and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate loading
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 10;
      setProgress(progressValue);
      
      if (progressValue >= 100) {
        clearInterval(interval);
        
        // Check login credentials from localStorage
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const student = students.find((s: any) => 
          s.rollNumber === rollNumber && s.password === password
        );
        
        if (student) {
          // Set current student in localStorage
          localStorage.setItem('currentStudent', JSON.stringify(student));
          
          toast({
            title: "Login successful",
            description: `Welcome back, ${student.fullName}!`,
            // Changed from 'success' to 'default' to fix the TypeScript error
            variant: "default"
          });
          
          onLoginSuccess();
        } else {
          setError('Invalid roll number or password');
          toast({
            title: "Login failed",
            description: "Invalid roll number or password",
            variant: "destructive"
          });
          setIsLoading(false);
        }
      }
    }, 50);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
        <CardHeader className="pb-6">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Fingerprint className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Student Login</CardTitle>
          <CardDescription className="text-center text-gray-500 dark:text-gray-400">
            Enter your credentials to mark attendance
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 py-4"
            >
              <div className="flex justify-center">
                <div className="animate-pulse rounded-full bg-primary/20 p-8">
                  <LogIn className="h-12 w-12 text-primary" />
                </div>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-center text-sm text-muted-foreground">
                Verifying your credentials...
              </p>
            </motion.div>
          ) : (
            <motion.form 
              initial="hidden"
              animate="visible"
              variants={formVariants}
              onSubmit={handleLogin} 
              className="space-y-5"
            >
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 flex items-center space-x-2"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}
              
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="rollNumber" className="text-gray-700 dark:text-gray-300">Roll Number</Label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="rollNumber"
                    type="text"
                    placeholder="Enter your roll number"
                    className="pl-10 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button type="submit" className="w-full h-11 font-medium">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants} className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    First time marking attendance?
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={onSignupClick}
                  >
                    Register Now
                  </Button>
                </div>
              </motion.div>
            </motion.form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentLogin;
