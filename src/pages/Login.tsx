
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, KeyRound, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      
      if (email && password) {
        // In a real app, you would validate credentials with a backend
        toast({
          title: "Login Successful",
          description: `Logged in as ${role}`,
        });
        
        // Redirect based on role
        if (role === 'student') {
          navigate('/student-dashboard');
        } else {
          navigate('/teacher-dashboard');
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Please enter valid credentials",
          variant: "destructive"
        });
      }
    }, 1500);
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-md"
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
          <div className="glass dark:glass-dark rounded-xl p-6 md:p-8 shadow-sm">
            <motion.div variants={fadeInUp} className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Welcome to Presence+</h1>
              <p className="text-muted-foreground">Sign in to your account</p>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Tabs defaultValue="student" onValueChange={(value) => setRole(value as 'student' | 'teacher')} className="w-full mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="teacher">Teacher</TabsTrigger>
                </TabsList>
                
                <TabsContent value="student">
                  <p className="text-sm text-center text-muted-foreground mt-2">
                    Access your attendance records and mark your presence
                  </p>
                </TabsContent>
                
                <TabsContent value="teacher">
                  <p className="text-sm text-center text-muted-foreground mt-2">
                    Manage class attendance and generate reports
                  </p>
                </TabsContent>
              </Tabs>
            </motion.div>
            
            <motion.form variants={fadeInUp} onSubmit={handleLogin} className="space-y-4">
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
                    placeholder={role === 'student' ? "student@example.com" : "teacher@example.com"}
                    className="w-full pl-10 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-transparent"
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
                    className="w-full pl-10 pr-10 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-transparent"
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
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
              
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <a href="#" className="text-primary hover:text-primary/80 font-medium">
                  Contact administrator
                </a>
              </p>
            </motion.form>
          </div>
          
          <motion.p 
            variants={fadeInUp} 
            className="text-center text-xs text-muted-foreground mt-8"
          >
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
