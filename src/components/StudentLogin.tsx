
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserRound, Lock, LogIn, AlertCircle } from 'lucide-react';
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

  return (
    <Card className="w-full max-w-md mx-auto glass dark:glass-dark">
      <CardHeader>
        <CardTitle>Student Login</CardTitle>
        <CardDescription>
          Enter your credentials to mark attendance
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-6 py-4">
            <div className="flex justify-center">
              <div className="animate-pulse rounded-full bg-primary/20 p-8">
                <LogIn className="h-12 w-12 text-primary" />
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">
              Verifying your credentials...
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <div className="relative">
                <UserRound className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="rollNumber"
                  type="text"
                  placeholder="Enter your roll number"
                  className="pl-9"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
            
            <div className="text-center space-y-2 pt-2">
              <p className="text-sm text-muted-foreground">
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
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentLogin;
