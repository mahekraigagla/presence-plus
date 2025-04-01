
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UserCheck, Save, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const signupSchema = z.object({
  rollNumber: z.string().min(3, "Roll number must be at least 3 characters"),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  division: z.string().min(1, "Division is required"),
  className: z.string().min(1, "Class is required"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface StudentSignupProps {
  onComplete: (studentData: SignupFormValues) => void;
  onCancel: () => void;
}

const StudentSignup: React.FC<StudentSignupProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'form' | 'saving'>('form');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      rollNumber: '',
      fullName: '',
      password: '',
      division: '',
      className: '',
    },
  });

  const handleSubmit = (values: SignupFormValues) => {
    setStep('saving');
    
    // Simulate saving data
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 5;
      setProgress(progressValue);
      
      if (progressValue >= 100) {
        clearInterval(interval);
        
        // Store student data in localStorage for demo purposes
        // In a real app, this would be saved to a database
        const existingStudents = JSON.parse(localStorage.getItem('students') || '[]');
        const newStudent = {
          ...values,
          id: Date.now().toString(),
          faceRegistered: false, // Will be set to true after face registration
        };
        
        localStorage.setItem('students', JSON.stringify([...existingStudents, newStudent]));
        localStorage.setItem('currentStudent', JSON.stringify(newStudent));
        
        toast({
          title: "Registration successful",
          description: "Your account has been created. Now please register your face.",
        });
        
        onComplete(values);
      }
    }, 50);
  };

  return (
    <Card className="w-full max-w-md mx-auto glass dark:glass-dark">
      <CardHeader>
        <CardTitle>Student Registration</CardTitle>
        <CardDescription>
          Register your details for attendance tracking
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {step === 'form' ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Division</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., A, B, C" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="className"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 10th, 12th, CS101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Register
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex justify-center">
              <div className="animate-pulse rounded-full bg-primary/20 p-8">
                <UserCheck className="h-12 w-12 text-primary" />
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">
              Creating your account...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentSignup;
