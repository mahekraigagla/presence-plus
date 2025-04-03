
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserRound, Lock, LogIn, AlertCircle, Fingerprint } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface StudentLoginProps {
  onLoginSuccess: () => void;
  onSignupClick: () => void;
}

const StudentLogin: React.FC<StudentLoginProps> = ({ onLoginSuccess, onSignupClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Progress bar animation
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 10;
      setProgress(progressValue);
      
      if (progressValue >= 100) {
        clearInterval(interval);
      }
    }, 50);
    
    try {
      // Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) throw authError;
      
      if (data.user) {
        // Get student details
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
        
        if (studentError) throw studentError;
        
        // Store current student data in localStorage for UI purposes
        localStorage.setItem('currentStudent', JSON.stringify(studentData));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${studentData.full_name}!`,
          variant: "default"
        });
        
        onLoginSuccess();
      }
    } catch (error: any) {
      setError(error.message || 'Invalid email or password');
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      clearInterval(interval);
      setProgress(0);
    }
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
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
