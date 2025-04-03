
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Camera, X, QrCode, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface QRScannerProps {
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scannedData, setScannedData] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setScanError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);
        scanQRCode();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setScanError('Could not access camera. Please check permissions or try a different browser.');
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions or try again.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsScanning(false);
    }
  };

  const scanQRCode = async () => {
    if (!isScanning) return;
    
    // In a real implementation, you'd use a QR code scanning library like jsQR
    // For this example, we'll simulate a successful scan after a short delay
    
    setTimeout(() => {
      if (!isScanning) return;
      
      // Simulate QR code data (in a real app, this would come from jsQR)
      const mockQRData = {
        classId: 'cs101',
        lecture: 'lecture-5',
        timestamp: new Date().toISOString(),
        lat: '40.7128',
        lng: '-74.0060'
      };
      
      const qrUrl = `/attendance/${mockQRData.classId}?lecture=${mockQRData.lecture}&timestamp=${mockQRData.timestamp}&lat=${mockQRData.lat}&lng=${mockQRData.lng}`;
      
      setScannedData(qrUrl);
      stopCamera();
      
      toast({
        title: "QR Code Scanned",
        description: "Successfully scanned attendance QR code.",
      });
    }, 3000);
    
    // In a real implementation with jsQR, you'd do something like:
    // 
    // const checkQRInterval = setInterval(() => {
    //   if (!canvasRef.current || !videoRef.current || !isScanning) {
    //     clearInterval(checkQRInterval);
    //     return;
    //   }
    // 
    //   const canvas = canvasRef.current;
    //   const video = videoRef.current;
    //   const context = canvas.getContext('2d');
    // 
    //   if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
    //     canvas.height = video.videoHeight;
    //     canvas.width = video.videoWidth;
    //     context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // 
    //     const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    //     const code = jsQR(imageData.data, imageData.width, imageData.height);
    // 
    //     if (code) {
    //       clearInterval(checkQRInterval);
    //       setScannedData(code.data);
    //       stopCamera();
    //     }
    //   }
    // }, 100);
  };

  const handleProceed = () => {
    if (scannedData) {
      navigate(scannedData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
        <CardHeader className="relative border-b">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>
            Scan the QR code displayed by your teacher to mark attendance
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-900 rounded-md overflow-hidden">
              {isScanning ? (
                <>
                  <video 
                    ref={videoRef} 
                    className="w-full h-full object-cover"
                    muted 
                    playsInline
                  />
                  <div className="absolute inset-0 border-2 border-white/30 border-dashed rounded-md"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-primary animate-pulse rounded-md"></div>
                  </div>
                </>
              ) : scannedData ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                  <p className="text-green-700 dark:text-green-300 font-medium text-center">
                    QR code successfully scanned!
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6">
                  <QrCode className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
                    Camera preview will appear here. Please enable camera access when prompted.
                  </p>
                </div>
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            {scanError && (
              <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">{scanError}</p>
              </div>
            )}
            
            <div className="space-y-2">
              {!scannedData ? (
                <Button 
                  className="w-full bg-primary" 
                  onClick={startCamera}
                  disabled={isScanning}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {isScanning ? 'Scanning...' : 'Start Camera'}
                </Button>
              ) : (
                <Button 
                  className="w-full bg-primary" 
                  onClick={handleProceed}
                >
                  Proceed to Mark Attendance
                </Button>
              )}
              
              {isScanning && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={stopCamera}
                >
                  Cancel Scanning
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QRScanner;
