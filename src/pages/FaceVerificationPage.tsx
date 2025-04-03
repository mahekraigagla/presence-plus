
import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FaceVerification from '@/components/FaceVerification';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const FaceVerificationPage = () => {
  const { classId = '' } = useParams<{ classId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const lectureId = searchParams.get('lecture') || '';
  const timestamp = searchParams.get('timestamp') || '';
  const studentId = searchParams.get('studentId') || '';
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar userRole="student" />
      
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
