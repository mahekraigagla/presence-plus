
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import QRGenerator from '@/components/QRGenerator';
import AttendanceTable from '@/components/AttendanceTable';

const QRGeneratorPage = () => {
  const [activeTab, setActiveTab] = useState('generate');
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar userRole="teacher" />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { delayChildren: 0.1, staggerChildren: 0.1 }
              }
            }}
          >
            {/* Page Title */}
            <motion.div variants={fadeInUp}>
              <h1 className="text-2xl font-bold">QR Attendance System</h1>
              <p className="text-muted-foreground mt-1">Generate QR codes and monitor attendance in real-time</p>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="generate">Generate QR</TabsTrigger>
                  <TabsTrigger value="attendance">Attendance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="generate">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <QRGenerator />
                    </div>
                    
                    <Card className="glass dark:glass-dark h-full">
                      <CardHeader>
                        <CardTitle>Instructions</CardTitle>
                        <CardDescription>How to use the QR attendance system</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">1. Generate a QR Code</h4>
                          <p className="text-sm text-muted-foreground">
                            Select your class and generate a QR code. You can set an expiry time and add location restrictions.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">2. Share with Students</h4>
                          <p className="text-sm text-muted-foreground">
                            Display the QR code on your screen or projector for students to scan.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">3. Students Scan and Verify</h4>
                          <p className="text-sm text-muted-foreground">
                            Students scan the QR code with their devices and verify their identity with face recognition.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">4. Monitor Attendance</h4>
                          <p className="text-sm text-muted-foreground">
                            Switch to the Attendance tab to see who has marked their attendance in real-time.
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => setActiveTab('attendance')} className="w-full">
                          View Attendance
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="attendance">
                  <Card className="glass dark:glass-dark">
                    <CardHeader>
                      <CardTitle>Attendance Records</CardTitle>
                      <CardDescription>Monitor and manage student attendance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AttendanceTable classId="cs101" date={new Date().toLocaleDateString()} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default QRGeneratorPage;
