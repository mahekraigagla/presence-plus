
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Calendar, UserCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import QRScanner from '@/components/QRScanner';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import AttendanceStats from '@/components/AttendanceStats';
import AttendanceTable from '@/components/AttendanceTable';

const StudentDashboard = () => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasAttendanceRecords, setHasAttendanceRecords] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please login to access the dashboard",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }
        
        // Get student profile
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (studentError || !studentData) {
          console.error("Error fetching student data:", studentError);
          toast({
            title: "Profile not found",
            description: "Could not find your student profile",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }
        
        setStudent(studentData);
        
        // Check if student has any attendance records
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('attendance_records')
          .select('id')
          .eq('student_id', studentData.id)
          .limit(1);
        
        if (attendanceError) {
          console.error("Error checking attendance records:", attendanceError);
        } else {
          setHasAttendanceRecords(attendanceData && attendanceData.length > 0);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar userRole="student" />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar userRole="student" />
      
      {showQRScanner && (
        <QRScanner onClose={() => setShowQRScanner(false)} />
      )}
      
      <main className="flex-grow pt-20 pb-10">
        <div className="container px-4 mx-auto">
          <motion.div
            className="grid grid-cols-1 gap-6"
            initial="initial"
            animate="animate"
            variants={{
              initial: { opacity: 0 },
              animate: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.div variants={fadeIn} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Student Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {student?.full_name || 'Student'}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => setShowQRScanner(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan QR Code
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </motion.div>
            
            {hasAttendanceRecords ? (
              <Tabs defaultValue="overview" className="w-full">
                <motion.div variants={fadeIn}>
                  <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="history">Attendance History</TabsTrigger>
                  </TabsList>
                </motion.div>
                
                <TabsContent value="overview" className="mt-6 space-y-6">
                  <motion.div variants={fadeIn}>
                    <AttendanceStats studentId={student?.id} />
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="history" className="mt-6">
                  <motion.div variants={fadeIn}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          Attendance History
                        </CardTitle>
                        <CardDescription>
                          View your past attendance records
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AttendanceTable studentId={student?.id} />
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            ) : (
              <motion.div variants={fadeIn}>
                <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                        <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300 mb-1">
                          No attendance records found
                        </h3>
                        <p className="text-amber-700 dark:text-amber-400 text-sm">
                          You haven't marked any attendance yet. Please mark your first attendance to see statistics and history.
                        </p>
                      </div>
                      <Button 
                        onClick={() => setShowQRScanner(true)}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        Mark Attendance
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
