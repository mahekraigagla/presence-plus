
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, RefreshCw, MapPin, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const QRGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [expiryTime, setExpiryTime] = useState(5); // Minutes
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [hasLocation, setHasLocation] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [lectureId, setLectureId] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const { toast } = useToast();

  // Available classes for the teacher
  const classes = [
    { id: 'cs101', name: 'Introduction to Computer Science' },
    { id: 'cs102', name: 'Data Structures and Algorithms' },
    { id: 'cs103', name: 'Database Systems' },
  ];

  useEffect(() => {
    // Get the base URL of the application
    const url = new URL(window.location.href);
    setBaseUrl(`${url.protocol}//${url.host}`);
  }, []);

  const generateQRCode = () => {
    if (!selectedClass) {
      toast({
        title: "Class Required",
        description: "Please select a class to generate a QR code",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Generate a unique lecture ID if not set
    const uniqueLectureId = lectureId || `${selectedClass}-${Date.now()}`;
    setLectureId(uniqueLectureId);
    
    // Build the attendance URL
    const attendanceUrl = `${baseUrl}/attendance/${selectedClass}?lecture=${uniqueLectureId}&timestamp=${Date.now()}`;
    if (hasLocation) {
      attendanceUrl += `&lat=${location.latitude}&lng=${location.longitude}`;
    }
    
    // Mock QR code generation
    setTimeout(() => {
      // For demo, we're using a placeholder QR code URL
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(attendanceUrl)}`);
      setIsGenerating(false);
      
      toast({
        title: "QR Code Generated",
        description: `Active for ${expiryTime} minutes${hasLocation ? ' at your current location' : ''}`,
      });
    }, 1500);
  };

  const copyQRCode = () => {
    // In a real app, you might use the clipboard API to copy the image or URL
    const attendanceUrl = `${baseUrl}/attendance/${selectedClass}?lecture=${lectureId}&timestamp=${Date.now()}`;
    navigator.clipboard.writeText(attendanceUrl).then(() => {
      setCopied(true);
      toast({
        title: "URL Copied",
        description: "Attendance URL copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    });
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

  const clearLocation = () => {
    setHasLocation(false);
    toast({
      title: "Location Removed",
      description: "Location data will not be used for this QR code",
    });
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
          <label className="text-sm font-medium">Select Class</label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map(cls => (
                <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Lecture ID (optional)</label>
          <Input 
            placeholder="Leave blank for auto-generated ID"
            value={lectureId}
            onChange={(e) => setLectureId(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Validity Period (minutes)</label>
          <Select value={expiryTime.toString()} onValueChange={(val) => setExpiryTime(Number(val))}>
            <SelectTrigger>
              <SelectValue placeholder="Select validity period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="10">10 minutes</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center">
          {!hasLocation ? (
            <Button 
              variant="outline" 
              size="sm"
              className="flex space-x-2"
              onClick={getLocation}
            >
              <MapPin size={16} />
              <span>Add Location</span>
            </Button>
          ) : (
            <div className="flex w-full items-center space-x-2">
              <div className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 rounded-md text-sm flex items-center">
                <MapPin size={14} className="mr-1" />
                <span className="truncate">
                  Location added
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={clearLocation}
              >
                <X size={16} className="text-muted-foreground" />
              </Button>
            </div>
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
              {selectedClass && (
                <p className="text-xs font-medium">Class: {classes.find(c => c.id === selectedClass)?.name}</p>
              )}
              {lectureId && (
                <p className="text-xs text-muted-foreground">Lecture ID: {lectureId}</p>
              )}
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
        disabled={isGenerating || !selectedClass}
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
