
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, RefreshCw, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QRGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [expiryTime, setExpiryTime] = useState(5); // Minutes
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [hasLocation, setHasLocation] = useState(false);
  const { toast } = useToast();

  const generateQRCode = () => {
    setIsGenerating(true);
    
    // Mock QR code generation
    setTimeout(() => {
      // In a real app, this would be generated from the backend
      // For demo, we're using a placeholder QR code URL
      const mockQRData = {
        id: Math.random().toString(36).substring(2, 10),
        timestamp: new Date().toISOString(),
        expiryMinutes: expiryTime,
        location: hasLocation ? location : null
      };
      
      // Simulate a QR code with placeholder API
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(mockQRData))}`);
      setIsGenerating(false);
      
      toast({
        title: "QR Code Generated",
        description: `Active for ${expiryTime} minutes${hasLocation ? ' at your current location' : ''}`,
      });
    }, 1500);
  };

  const copyQRCode = () => {
    // In a real app, you might use the clipboard API to copy the image
    // For demo purposes, we're just showing the copy animation
    setCopied(true);
    toast({
      title: "QR Code Copied",
      description: "Share it with your students for attendance",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setHasLocation(true);
          toast({
            title: "Location Detected",
            description: "Your current location will be used for this QR code",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not get your location. Check your browser permissions.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="glass dark:glass-dark rounded-lg p-6 space-y-6 max-w-md w-full mx-auto">
      <div className="text-center space-y-2">
        <h3 className="font-semibold">Generate Attendance QR Code</h3>
        <p className="text-sm text-muted-foreground">
          Students can scan this QR code to mark their attendance
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Validity Period (minutes)</label>
          <select 
            value={expiryTime}
            onChange={(e) => setExpiryTime(Number(e.target.value))}
            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          >
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm"
            className={`flex space-x-2 ${hasLocation ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : ''}`}
            onClick={getLocation}
          >
            <MapPin size={16} />
            <span>{hasLocation ? 'Location Added' : 'Add Location'}</span>
          </Button>
          {hasLocation && (
            <span className="ml-2 text-xs text-muted-foreground">
              Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        {qrCodeUrl ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <img 
                src={qrCodeUrl} 
                alt="Attendance QR Code" 
                className="rounded-md shadow-sm"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button 
                  size="icon" 
                  variant="ghost"
                  className="rounded-full bg-white/80 hover:bg-white/90"
                  onClick={copyQRCode}
                >
                  {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            <div className="text-sm text-center space-y-2">
              <p className="font-medium">Valid for {expiryTime} minutes</p>
              <p className="text-xs text-muted-foreground">Generated at {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        ) : (
          <div className="w-[200px] h-[200px] bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
            <span className="text-sm text-muted-foreground">QR Code will appear here</span>
          </div>
        )}
      </div>
      
      <Button 
        className="w-full"
        onClick={generateQRCode}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : qrCodeUrl ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New Code
          </>
        ) : (
          'Generate QR Code'
        )}
      </Button>
    </div>
  );
};

export default QRGenerator;
