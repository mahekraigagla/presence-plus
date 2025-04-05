
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { X, Camera, QrCode, ScanLine, CameraOff, RefreshCw } from 'lucide-react';

interface QRScannerProps {
  onClose: () => void;
  studentId?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({ onClose, studentId }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const startScanner = async () => {
    try {
      setScanError('');
      setCameraError(null);
      
      console.log("Starting QR scanner camera...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.autoplay = true;
        videoRef.current.playsInline = true;
        
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          if (videoRef.current) {
            console.log("Starting video playback for QR scanner");
            videoRef.current.play()
              .then(() => {
                console.log("QR scanner video started successfully");
                setIsScanning(true);
                
                // Start the scanning process
                startScanningQRCode();
              })
              .catch(err => {
                console.error("Error playing QR scanner video:", err);
                setCameraError("Could not start video stream. Please check your permissions.");
                setIsScanning(false);
              });
          }
        };
      } else {
        console.error("Video ref is null");
      }
    } catch (error) {
      console.error("Camera access error:", error);
      let errorMessage = "Could not access camera. Please check your permissions.";
      
      if (error instanceof DOMException) {
        if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage = "No camera found on your device.";
        } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = "Camera access denied. Please allow camera access.";
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          errorMessage = "Camera already in use. Close other apps that might be using it.";
        }
      }
      
      setCameraError(errorMessage);
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const stopScanner = () => {
    console.log("Stopping QR scanner");
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
    }
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    setScanProgress(0);
    setIsScanning(false);
  };

  const validateQRData = (qrData: string) => {
    try {
      // QR format: {"classId":"123","lectureId":"456","timestamp":"2023-01-01T10:00:00Z"}
      const data = JSON.parse(qrData);
      
      if (!data.classId || !data.lectureId) {
        return { valid: false, error: "Invalid QR code format" };
      }
      
      return { 
        valid: true, 
        classId: data.classId,
        lectureId: data.lectureId,
        timestamp: data.timestamp || new Date().toISOString()
      };
    } catch (e) {
      return { valid: false, error: "Could not parse QR code data" };
    }
  };

  const startScanningQRCode = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    
    // This is where you would typically integrate a QR scanner library
    // For this demo, we'll simulate finding a QR code after a short delay
    
    // Reset progress
    setScanProgress(0);
    
    // Simulate scanning progress
    scanIntervalRef.current = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 5;
        
        // When progress reaches 100%, simulate finding a QR code
        if (newProgress >= 100) {
          clearInterval(scanIntervalRef.current!);
          
          // Simulate QR code data
          const qrData = JSON.stringify({
            classId: "CS101",
            lectureId: "L001",
            timestamp: new Date().toISOString()
          });
          
          processQRCode(qrData);
          return 100;
        }
        
        return newProgress;
      });
    }, 150);
  };

  const processQRCode = (qrData: string) => {
    const validation = validateQRData(qrData);
    
    if (!validation.valid) {
      setScanError(validation.error || "Invalid QR code");
      toast({
        title: "Invalid QR Code",
        description: validation.error || "Could not recognize the QR code format",
        variant: "destructive"
      });
      
      // Stop scanning but don't close the dialog, allow retry
      stopScanner();
      return;
    }
    
    // Successful scan
    stopScanner();
    toast({
      title: "QR Code Scanned",
      description: "Successfully scanned attendance QR code"
    });
    
    // Navigate to face attendance page with student ID
    if (studentId) {
      const { classId, lectureId, timestamp } = validation as any;
      navigate(`/face-attendance/${classId}?lecture=${lectureId}&timestamp=${timestamp}`);
    } else {
      toast({
        title: "Error",
        description: "Student ID not found. Please login again.",
        variant: "destructive"
      });
    }
    
    // Close the scanner dialog
    onClose();
  };

  const retryScanning = () => {
    setScanError('');
    startScanner();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center space-x-2">
              <QrCode className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Scan Attendance QR Code</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                stopScanner();
                onClose();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <CardContent className="p-0">
            <div className="relative">
              {/* Camera preview */}
              <div className="aspect-video bg-gray-900 relative overflow-hidden">
                {isScanning ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 border-2 border-white/80 rounded-lg relative">
                        {/* Scan animation */}
                        <motion.div
                          className="absolute left-0 right-0 h-0.5 bg-primary"
                          initial={{ y: 0 }}
                          animate={{ 
                            y: [0, 256, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : scanError ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                      <QrCode className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-red-600 font-semibold text-lg">Scan Failed</p>
                      <p className="text-gray-400 text-sm">{scanError}</p>
                    </div>
                  </div>
                ) : cameraError ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                      <CameraOff className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-red-600 font-semibold text-lg">Camera Error</p>
                      <p className="text-gray-400 text-sm">{cameraError}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6">
                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-center">
                      Camera preview will appear here.<br />Click "Start Scanning" below.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Hidden canvas for image processing */}
              <canvas ref={canvasRef} className="hidden" width="640" height="480" />
              
              {isScanning && (
                <div className="p-4 border-t">
                  <div className="flex items-center">
                    <ScanLine className="animate-pulse h-5 w-5 mr-2 text-primary" />
                    <span className="text-sm font-medium mr-2">Scanning</span>
                    <span className="text-xs text-muted-foreground">{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-2 mt-2" />
                </div>
              )}
              
              {/* Control buttons */}
              <div className="p-4 flex justify-center space-x-3">
                {isScanning ? (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      stopScanner();
                    }}
                  >
                    Cancel Scanning
                  </Button>
                ) : (
                  <>
                    {(scanError || cameraError) ? (
                      <Button 
                        onClick={retryScanning}
                        className="bg-primary text-primary-foreground"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                      </Button>
                    ) : (
                      <Button 
                        onClick={startScanner}
                        className="bg-primary text-primary-foreground"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Start Scanning
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QRScanner;
