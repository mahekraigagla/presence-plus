
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FaceVerification from '@/components/FaceVerification';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const FaceVerificationPage = () => {
  const { classId = '' } = useParams<{ classId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);
  const [loading, setLoading] = useState(true);
  
  const searchParams = new URLSearchParams(location.search);
  const lectureId = searchParams.get('lecture') || '';
  const timestamp = searchParams.get('timestamp') || '';
  const studentId = searchParams.get('studentId') || '';
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
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
        
        setIsAuthenticated(true);
        
        // Check if user is a student or teacher
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        
        if (studentData) {
          setUserRole('student');
        } else {
          const { data: teacherData, error: teacherError } = await supabase
            .from('teachers')
            .select('id')
            .eq('user_id', session.user.id)
            .single();
          
          if (teacherData) {
            setUserRole('teacher');
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const handleOpenExternalProject = () => {
    // Open the external project in a new tab
    window.open('https://github.com/mahekraigagla/opencv.git', '_blank');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar userRole={userRole || 'student'} />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <h1 className="text-3xl font-bold">Mark Attendance</h1>
            <p className="text-muted-foreground">
              Please verify your identity to mark attendance for class {classId}
            </p>
          </div>

          <div className="text-center mb-8">
            <Button 
              onClick={handleOpenExternalProject} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              Open Face Recognition System
            </Button>
            <p className="mt-2 text-muted-foreground">Click the button above to launch the face recognition system</p>
          </div>
          
          <FaceVerification
            classId={classId}
            lectureId={lectureId}
            timestamp={timestamp}
            studentId={studentId}
          />
        </div>
      </main>
    </div>
  );
};

export default FaceVerificationPage;
