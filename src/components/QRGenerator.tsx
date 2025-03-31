
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, RefreshCw, MapPin, X, QrCode, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const QRGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [expiryTime, setExpiryTime] = useState(5); // Minutes
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [hasLocation, setHasLocation] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [lectureId, setLectureId] = useState('');
  const [lectureName, setLectureName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);
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
    let attendanceUrl = `${baseUrl}/attendance/${selectedClass}?lecture=${uniqueLectureId}&timestamp=${Date.now()}`;
    if (hasLocation) {
      attendanceUrl += `&lat=${location.latitude}&lng=${location.longitude}`;
    }
    
    // Mock QR code generation
    setTimeout(() => {
      // For demo, we're using a placeholder QR code URL
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(attendanceUrl)}`);
      setIsGenerating(false);
      setShowPreview(true);
      
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

  const shareQRCode = () => {
    if (navigator.share) {
      const attendanceUrl = `${baseUrl}/attendance/${selectedClass}?lecture=${lectureId}&timestamp=${Date.now()}`;
      navigator.share({
        title: 'Attendance QR Code',
        text: `Scan this QR code to mark attendance for ${classes.find(c => c.id === selectedClass)?.name}`,
        url: attendanceUrl,
      })
      .then(() => {
        toast({
          title: "QR Code Shared",
          description: "Successfully shared attendance URL",
        });
      })
      .catch((error) => {
        toast({
          title: "Sharing Failed",
          description: "Could not share the attendance URL",
          variant: "destructive"
        });
      });
    } else {
      toast({
        title: "Sharing Not Supported",
        description: "Your browser doesn't support native sharing",
        variant: "destructive"
      });
    }
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
        <h3 className="font-semibold flex items-center justify-center">
          <QrCode className="mr-2 h-5 w-5" />
          Generate Attendance QR Code
        </h3>
        <p className="text-sm text-muted-foreground">
          Students can scan this QR code to mark their attendance
        </p>
      </div>
      
      {!showPreview ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card className="border-dashed">
              <CardContent className="p-4 space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Select Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Lecture ID</label>
                    <Input 
                      placeholder="Auto-generated ID"
                      value={lectureId}
                      onChange={(e) => setLectureId(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Lecture Name</label>
                    <Input 
                      placeholder="Optional"
                      value={lectureName}
                      onChange={(e) => setLectureName(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Validity Period (minutes)</label>
                  <Select value={expiryTime.toString()} onValueChange={(val) => setExpiryTime(Number(val))}>
                    <SelectTrigger className="bg-background">
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
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium" htmlFor="location-restriction">
                      Location Restriction
                    </Label>
                    <Switch
                      id="location-restriction"
                      checked={hasLocation}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          getLocation();
                        } else {
                          clearLocation();
                        }
                      }}
                    />
                  </div>
                  
                  {hasLocation && (
                    <div className="flex mt-2 text-xs text-green-600 dark:text-green-400 items-center bg-green-50 dark:bg-green-900/20 p-2 rounded">
                      <MapPin size={12} className="mr-1" />
                      <span>Location restriction active</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
            ) : (
              'Generate QR Code'
            )}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-md blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <Card className="relative shadow-xl">
              <CardContent className="p-4 flex flex-col items-center">
                <img 
                  src={qrCodeUrl} 
                  alt="Attendance QR Code" 
                  className="rounded-md"
                />
                <div className="mt-4 text-center space-y-1">
                  <h4 className="font-medium">{classes.find(c => c.id === selectedClass)?.name}</h4>
                  {lectureName && <p className="text-sm">{lectureName}</p>}
                  <p className="text-xs text-muted-foreground">Valid for {expiryTime} minutes</p>
                  <p className="text-xs text-muted-foreground">ID: {lectureId}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex space-x-2 w-full">
            <Button 
              className="flex-1"
              variant="outline"
              onClick={copyQRCode}
            >
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              Copy URL
            </Button>
            <Button 
              className="flex-1"
              variant="outline"
              onClick={shareQRCode}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          
          <Button 
            className="w-full"
            onClick={() => {
              setShowPreview(false);
              setQrCodeUrl('');
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New Code
          </Button>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
