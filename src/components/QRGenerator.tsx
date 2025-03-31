import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, RefreshCw, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QRGenerator = ({ onQRCodeGenerated }: { onQRCodeGenerated?: (data: string) => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [expiryTime, setExpiryTime] = useState(5); // Minutes
  const [timeLeft, setTimeLeft] = useState(0); // Seconds
  const { toast } = useToast();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const generateQRCode = () => {
    setIsGenerating(true);

    // Mock QR code generation
    setTimeout(() => {
      const mockQRData = {
        id: Math.random().toString(36).substring(2, 10),
        timestamp: new Date().toISOString(),
        expiryMinutes: expiryTime,
      };

      const qrDataString = JSON.stringify(mockQRData);
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrDataString)}`);
      setTimeLeft(expiryTime * 60); // Convert minutes to seconds
      setIsGenerating(false);

      if (onQRCodeGenerated) onQRCodeGenerated(qrDataString);

      toast({
        title: "QR Code Generated",
        description: `Active for ${expiryTime} minutes.`,
      });
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrCodeUrl).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "The QR code URL has been copied.",
      });
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {qrCodeUrl && (
        <div>
          <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40" />
          <p className="text-sm text-muted-foreground">
            Expires in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')} minutes
          </p>
          <Button onClick={copyToClipboard} className="mt-2">
            <Copy className="mr-2 h-4 w-4" /> Copy QR Code URL
          </Button>
        </div>
      )}
      <Button onClick={generateQRCode} disabled={isGenerating || timeLeft > 0}>
        {isGenerating ? 'Generating...' : 'Generate QR Code'}
      </Button>
    </div>
  );
};

export default QRGenerator;
