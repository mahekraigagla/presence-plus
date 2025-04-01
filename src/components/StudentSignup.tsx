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
import { UserCheck, Save, ArrowRight, BookOpen, School, User, UserCircle, KeyRound, GraduationCap, CreditCard } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const signupSchema = z.object({
  rollNumber: z.string().min(3, "Roll number must be at least 3 characters"),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  division: z.string().min(1, "Division is required"),
  className: z.string().min(1, "Class is required"),
  department: z.string().min(2, "Department is required"),
  year: z.string().min(1, "Year is required"),
  email: z.string().email("Please enter a valid email address")
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
      department: '',
      year: '',
      email: ''
    },
  });

  const handleSubmit = (values: SignupFormValues) => {
    setStep('saving');
    
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 5;
      setProgress(progressValue);
      
      if (progressValue >= 100) {
        clearInterval(interval);
        
        const existingStudents = JSON.parse(localStorage.getItem('students') || '[]');
        const newStudent = {
          ...values,
          id: Date.now().toString(),
          faceRegistered: false,
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
              Create your account to start marking attendance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative p-6 pt-6">
        {step === 'form' ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
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
                          <Input type="password" placeholder="Create a strong password" className="bg-white/50 dark:bg-gray-900/50" {...field} />
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
                          <Input placeholder="e.g., Computer Science" className="bg-white/50 dark:bg-gray-900/50" {...field} />
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
                          <Input placeholder="e.g., 1st, 2nd, 3rd, 4th" className="bg-white/50 dark:bg-gray-900/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="division"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
                          Division
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., A, B, C" className="bg-white/50 dark:bg-gray-900/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="className"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                          Class
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 10th, CS101" className="bg-white/50 dark:bg-gray-900/50" {...field} />
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
                  Register & Continue
                </Button>
              </motion.div>
            </form>
          </Form>
        ) : (
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
    </Card>
  );
};

export default StudentSignup;
