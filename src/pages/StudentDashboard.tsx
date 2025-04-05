
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Calendar, BarChart2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AttendanceStats from '@/components/AttendanceStats';
import AttendanceTable from '@/components/AttendanceTable';
import { StudentData } from '@/integrations/types/attendance-types';
import QRScanner from '@/components/QRScanner';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasAttendance, setHasAttendance] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please login to access this page",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }
        
        // Fetch student profile
        const { data: student, error } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (error || !student) {
          toast({
            title: "Profile Not Found",
            description: "Could not find your student profile",
            variant: "destructive"
          });
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }
        
        // Store student data
        setStudentData(student);
        localStorage.setItem('currentStudent', JSON.stringify(student));
        
        // Check if student has any attendance records
        const { data: records, error: recordsError } = await supabase
          .from('attendance_records')
          .select('id')
          .eq('student_id', student.id)
          .limit(1);
        
        if (recordsError) {
          console.error("Error checking attendance records:", recordsError);
        }
        
        setHasAttendance(records && records.length > 0);
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Authentication Error",
          description: "Please login again",
          variant: "destructive"
        });
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('currentStudent');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const handleScanQR = () => {
    setShowQRScanner(true);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-semibold mt-4">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-5xl space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <motion.div variants={fadeInUp}>
            <Card className="glass dark:glass-dark border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-semibold">
                    Welcome, {studentData?.full_name}
                  </CardTitle>
                  <CardDescription>
                    Here's an overview of your attendance.
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleScanQR}>
                    <QrCode className="mr-2 h-4 w-4" />
                    Scan QR
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span>{studentData?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>Roll No: {studentData?.roll_number}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="glass dark:glass-dark border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-semibold">
                  Attendance Statistics
                </CardTitle>
                <BarChart2 className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {studentData && <AttendanceStats studentId={studentData?.id} />}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="glass dark:glass-dark border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-semibold">
                  Attendance Records
                </CardTitle>
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {studentData && <AttendanceTable studentId={studentData?.id} />}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      
      {showQRScanner && studentData && (
        <QRScanner 
          onClose={() => setShowQRScanner(false)} 
          studentId={studentData.id} 
        />
      )}
    </div>
  );
};

export default StudentDashboard;
