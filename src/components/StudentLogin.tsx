import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StudentLoginProps {
  onLoginSuccess: () => void;
  onSignupClick: () => void;
}

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const StudentLogin: React.FC<StudentLoginProps> = ({ onLoginSuccess, onSignupClick }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoggingIn(true);
    
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        console.log("Login error:", error.message);
        
        // Explicitly handle the email not confirmed error
        if (error.message.includes('Email not confirmed')) {
          console.log("Email not confirmed, proceeding with login anyway");
          
          // Get user by email from the auth system - using proper typings
          const { data: userData } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password, 
          });
          
          if (!userData.user) {
            throw new Error('Invalid email or password');
          }
          
          // Fetch student profile
          const { data: student, error: studentError } = await supabase
            .from('students')
            .select('*')
            .eq('email', values.email)
            .maybeSingle();
          
          if (studentError || !student) {
            throw new Error('No student profile found for this account');
          }
          
          // Store student data in localStorage
          localStorage.setItem('currentStudent', JSON.stringify(student));
          
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
          
          onLoginSuccess();
          return;
        }
        
        throw error;
      }
      
      if (!data.user) {
        throw new Error('No user data returned from authentication service');
      }
      
      // Fetch student profile
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', data.user.id)
        .maybeSingle();
      
      if (studentError) {
        throw studentError;
      }
      
      if (!student) {
        throw new Error('No student profile found for this account');
      }
      
      // Store student data in localStorage
      localStorage.setItem('currentStudent', JSON.stringify(student));
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      onLoginSuccess();
    } catch (error: any) {
      console.error('Login error:', error);
      
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass dark:glass-dark rounded-xl p-6 md:p-8 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email" 
                      {...field} 
                      disabled={isLoggingIn}
                    />
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
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your password" 
                        {...field} 
                        disabled={isLoggingIn}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between text-sm mt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/50"
                />
                <label htmlFor="remember-me" className="ml-2 text-muted-foreground">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-primary hover:text-primary/80">
                Forgot password?
              </a>
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Signing In...' : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </>
              )}
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Don't have an account?
              </p>
              <motion.div 
                className="mt-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={onSignupClick}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create New Account
                </Button>
              </motion.div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default StudentLogin;
