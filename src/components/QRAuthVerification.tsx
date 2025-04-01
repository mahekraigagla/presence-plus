
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, MapPin, QrCode, Loader2, UserCheck, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface QRAuthVerificationProps {
  qrData: {
    lectureId: string;
    classId: string;
    lectureName?: string;
    teacherName?: string;
    timestamp: number;
    location?: {
      lat: number;
      lng: number;
    };
  };
  onComplete: (success: boolean) => void;
}

const QRAuthVerification: React.FC<QRAuthVerificationProps> = ({ qrData, onComplete }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [stage, setStage] = useState<'auth' | 'verifying' | 'location' | 'success' | 'error'>('auth');
  const [progress, setProgress] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationStatus, setLocationStatus] = useState<'checking' | 'invalid' | 'valid' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  // Mock validation - in a real app, this would be done against an API
  const validateCredentials = () => {
    if (!rollNumber || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter your roll number and password",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if the student is authorized for this class
    // In a real app, this would verify against the database
    const isAuthorized = true; // Assume they're authorized for this demo
    
    if (!isAuthorized) {
      toast({
        title: "Authorization Failed",
        description: "You are not enrolled in this class or lecture",
        variant: "destructive"
      });
      setErrorMessage("You are not enrolled in this class. Please contact your teacher for assistance.");
      setStage('error');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCredentials()) return;
    
    setStage('verifying');
    
    // Simulate verification process
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += 5;
      setProgress(progressVal);
      
      if (progressVal >= 100) {
        clearInterval(interval);
        
        // Check if QR code is expired (older than 30 minutes)
        const currentTime = Date.now();
        const qrAge = currentTime - qrData.timestamp;
        const maxAge = 30 * 60 * 1000; // 30 minutes in milliseconds
        
        if (qrAge > maxAge) {
          setErrorMessage("This QR code has expired. Please ask your teacher to generate a new one.");
          setStage('error');
          toast({
            title: "QR Code Expired",
            description: "This QR code is no longer valid. Please request a new one.",
            variant: "destructive"
          });
          return;
        }
        
        // If QR has location data, check user's location
        if (qrData.location) {
          setStage('location');
          checkLocation();
        } else {
          // No location restriction, move to success
          handleSuccess();
        }
      }
    }, 50);
  };

  const checkLocation = () => {
    if (!qrData.location) {
      handleSuccess();
      return;
    }
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setCurrentLocation(userLocation);
          
          // Calculate distance between user and class location
          const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            qrData.location!.lat, qrData.location!.lng
          );
          
          // Set 50 meters as the max allowed distance
          if (distance <= 50) {
            setLocationStatus('valid');
            setTimeout(() => {
              handleSuccess();
            }, 1500);
          } else {
            setLocationStatus('invalid');
            setErrorMessage(`You appear to be ${Math.round(distance)} meters away from the classroom. You must be within 50 meters to mark attendance.`);
            setStage('error');
            toast({
              title: "Location Restriction",
              description: "You are too far from the classroom to mark attendance",
              variant: "destructive"
            });
          }
        },
        (error) => {
          setLocationStatus('error');
          setErrorMessage("Could not verify your location. Please allow location access or contact your teacher for assistance.");
          setStage('error');
          toast({
            title: "Location Error",
            description: "Could not verify your location. Check your permissions.",
            variant: "destructive"
          });
        }
      );
    } else {
      setLocationStatus('error');
      setErrorMessage("Your browser doesn't support geolocation. Please use a different device or contact your teacher for assistance.");
      setStage('error');
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
    }
  };

  // Calculate distance between two points using the Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const handleSuccess = () => {
    setStage('success');
    toast({
      title: "Authentication Successful",
      description: "You've been verified for this lecture. Continue to face recognition.",
      variant: "default"
    });
    
    // Allow some time to see the success state before proceeding
    setTimeout(() => {
      onComplete(true);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto glass dark:glass-dark">
      <CardHeader>
        <CardTitle className="text-center">Student Verification</CardTitle>
        <div className="flex flex-col items-center space-y-2 mt-2">
          <Badge 
            variant="outline" 
            className="px-3 py-1"
          >
            <QrCode className="mr-1 h-3.5 w-3.5" />
            {qrData.lectureName || `Lecture ${qrData.lectureId}`}
          </Badge>
          {qrData.teacherName && (
            <p className="text-sm text-muted-foreground">
              {qrData.teacherName}'s class
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {stage === 'auth' && (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                type="text"
                placeholder="Enter your roll number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Verify Identity
            </Button>
          </motion.form>
        )}

        {stage === 'verifying' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 py-4"
          >
            <div className="flex justify-center">
              <div className="animate-pulse rounded-full bg-primary/20 p-8">
                <ShieldCheck className="h-12 w-12 text-primary" />
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">
              Verifying your credentials...
            </p>
          </motion.div>
        )}

        {stage === 'location' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 py-4"
          >
            <div className="flex justify-center">
              <div className="animate-pulse rounded-full bg-blue-500/20 p-8">
                <MapPin className="h-12 w-12 text-blue-500" />
              </div>
            </div>
            <p className="text-center">
              {locationStatus === 'checking' && (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying your location...
                </span>
              )}
            </p>
          </motion.div>
        )}

        {stage === 'success' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 py-4"
          >
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-8 dark:bg-green-900/30">
                <UserCheck className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-medium text-xl">Authentication Successful</h3>
              <p className="text-muted-foreground">
                Your identity has been verified. Proceeding to face recognition.
              </p>
            </div>
          </motion.div>
        )}

        {stage === 'error' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 py-4"
          >
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-8 dark:bg-red-900/30">
                <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-medium text-xl">Authentication Failed</h3>
              <p className="text-muted-foreground">
                {errorMessage}
              </p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setStage('auth')}>
              Try Again
            </Button>
          </motion.div>
        )}
      </CardContent>
      {stage === 'auth' && (
        <CardFooter className="flex justify-center border-t py-4">
          <p className="text-xs text-muted-foreground text-center">
            By continuing, you confirm that you are physically present in the classroom.
            <br />Attendance fraud is against university policy and subject to disciplinary action.
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default QRAuthVerification;
