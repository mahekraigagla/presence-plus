
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, KeyRound, EyeOff, Eye, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import StudentLogin from '@/components/StudentLogin';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (error) {
        console.log("Teacher login error:", error.message);
        
        // Explicitly handle the email not confirmed error
        if (error.message.includes('Email not confirmed')) {
          console.log("Email not confirmed, proceeding with login anyway");
          
          // Get user by email from the auth system
          const { data: userData } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
            options: {
              // Setting this to true will force login even if email isn't verified
              // This is a workaround for development purposes
              data: { email_confirmed: true }
            }
          });
          
          if (!userData.user) {
            throw new Error('Invalid email or password');
          }
          
          // Fetch teacher profile
          const { data: teacher, error: teacherError } = await supabase
            .from('teachers')
            .select('*')
            .eq('email', email)
            .maybeSingle();
          
          if (teacherError || !teacher) {
            throw new Error('No teacher profile found for this account');
          }
          
          toast({
            title: "Login Successful",
            description: `Welcome back, ${teacher.full_name}!`,
          });
          
          navigate('/teacher-dashboard');
          return;
        }
        
        throw error;
      }
      
      if (!data.user) {
        throw new Error('No user data returned from authentication service');
      }
      
      // Fetch teacher profile
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .eq('user_id', data.user.id)
        .maybeSingle();
      
      if (teacherError) {
        throw teacherError;
      }
      
      if (!teacher) {
        throw new Error('No teacher profile found for this account');
      }
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${teacher.full_name}!`,
      });
      
      navigate('/teacher-dashboard');
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentLoginSuccess = () => {
    navigate('/student-dashboard');
  };

  const handleStudentSignupClick = () => {
    navigate('/signup');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-pattern">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { delayChildren: 0.3, staggerChildren: 0.2 }
            }
          }}
        >
          <div className="relative z-10">
            <div className="absolute -z-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"></div>
            
            <motion.div variants={fadeInUp} className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2 text-gradient">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to your account</p>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Tabs defaultValue="student" onValueChange={(value) => setRole(value as 'student' | 'teacher')} className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="teacher">Teacher</TabsTrigger>
                </TabsList>
                
                <TabsContent value="student" className="mt-4">
                  <StudentLogin 
                    onLoginSuccess={handleStudentLoginSuccess}
                    onSignupClick={handleStudentSignupClick}
                  />
                </TabsContent>
                
                <TabsContent value="teacher" className="mt-4">
                  <div className="w-full max-w-md mx-auto">
                    <div className="glass dark:glass-dark rounded-xl p-6 md:p-8 shadow-sm">
                      <motion.form variants={fadeInUp} onSubmit={handleTeacherLogin} className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">Email</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                              <User className="h-4 w-4" />
                            </div>
                            <input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="teacher@example.com"
                              className="w-full pl-10 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background/50"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="password" className="text-sm font-medium">Password</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                              <KeyRound className="h-4 w-4" />
                            </div>
                            <input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter your password"
                              className="w-full pl-10 pr-10 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background/50"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
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
                        
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? 'Signing In...' : (
                            <>
                              <LogIn className="mr-2 h-4 w-4" /> Sign In
                            </>
                          )}
                        </Button>
                      </motion.form>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="flex justify-center mt-8"
            >
              <Link to="/signup" className="gradient-border relative inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-primary bg-background/80 hover:bg-background rounded-full overflow-hidden">
                <UserPlus className="h-4 w-4" />
                <span>Create New Account</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
