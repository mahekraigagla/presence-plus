
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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

const StudentSignup: React.FC<StudentSignupProps> = ({ onComplete, onCancel }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      rollNumber: '',
      department: '',
      year: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof studentSchema>) => {
    setIsSubmitting(true);
    
    try {
      // First check if user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('students')
        .select('email')
        .eq('email', data.email)
        .limit(1);
      
      if (checkError) {
        console.error("Error checking existing user:", checkError);
      }
      
      if (existingUsers && existingUsers.length > 0) {
        toast({
          title: "User Already Exists",
          description: "A student with this email already exists. Please login or use a different email.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName
          },
          emailRedirectTo: window.location.origin + '/login'
        }
      });
      
      if (authError) {
        // Check if the error is about existing user
        if (authError.message.includes('User already registered')) {
          toast({
            title: "User Already Exists",
            description: "A user with this email already exists. Please login or use a different email.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
        throw new Error(authError.message);
      }
      
      if (!authData.user) {
        throw new Error("Failed to create user account.");
      }
      
      // Store student details
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: authData.user.id,
          full_name: data.fullName,
          email: data.email,
          roll_number: data.rollNumber,
          department: data.department,
          year: data.year,
          face_registered: false
        });
      
      if (studentError) {
        console.error("Student creation error:", studentError);
        // Check if this is a unique constraint error (user already exists)
        if (studentError.code === '23505') {
          toast({
            title: "User Already Exists",
            description: "A student with this email already exists. Please login instead.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
        
        throw studentError;
      }
      
      // Success!
      toast({
        title: "Account Created",
        description: "Your account has been created successfully. You can now log in.",
      });
      
      // Sign out the user since we want them to explicitly log in
      await supabase.auth.signOut();
      
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Register Account"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StudentSignup;
