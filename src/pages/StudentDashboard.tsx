import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, QrCode, Calendar, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import AttendanceStats from '@/components/AttendanceStats';
import FaceRecognition from '@/components/FaceRecognition';
import QrScanner from 'react-qr-scanner'; // Replace react-qr-reader with react-qr-scanner

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isScanning, setIsScanning] = useState(false); // State to toggle QR scanning
  const [qrResult, setQrResult] = useState(null); // State to store scanned QR code result

  const handleScan = (data: string | null) => {
    if (data) {
      setQrResult(data);
      setIsScanning(false); // Stop scanning after successful scan
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scan Error:', error);
  };

  // Sample upcoming classes for demo
  const upcomingClasses = [
    {
      id: 1,
      subject: 'Introduction to Computer Science',
      time: '09:00 AM - 10:30 AM',
      room: 'Room 101',
      teacher: 'Dr. Smith',
      isNext: true
    },
    {
      id: 2,
      subject: 'Data Structures and Algorithms',
      time: '11:00 AM - 12:30 PM',
      room: 'Room 203',
      teacher: 'Prof. Johnson',
      isNext: false
    },
    {
      id: 3,
      subject: 'Database Systems',
      time: '02:00 PM - 03:30 PM',
      room: 'Lab 3',
      teacher: 'Dr. Williams',
      isNext: false
    }
  ];
  
  // Sample recent attendance activities
  const recentActivities = [
    {
      id: 1,
      subject: 'Web Development',
      date: 'Today, 08:30 AM',
      status: 'Present',
      verificationMethod: 'QR Code + Face'
    },
    {
      id: 2,
      subject: 'Mobile App Development',
      date: 'Yesterday, 01:45 PM',
      status: 'Present',
      verificationMethod: 'QR Code + Face'
    },
    {
      id: 3,
      subject: 'Introduction to Computer Science',
      date: 'Oct 15, 09:15 AM',
      status: 'Absent',
      verificationMethod: 'N/A'
    }
  ];

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
      <Navbar userRole="student" />
      
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
            {/* Welcome Section */}
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Welcome, John Doe</h1>
                <p className="text-muted-foreground">Student ID: STU-12345 | Computer Science, Year 2</p>
              </div>
              <Button onClick={() => setActiveTab('scan')} className="md:w-auto w-full">
                <QrCode className="mr-2 h-4 w-4" />
                Scan Attendance QR
              </Button>
            </motion.div>
            
            {/* Main Dashboard Content */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <motion.div variants={fadeInUp}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="scan">Scan QR</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
              </motion.div>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="glass dark:glass-dark">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">87%</div>
                      <p className="text-xs text-muted-foreground mt-1">48/55 classes attended</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass dark:glass-dark">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Classes Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground mt-1">Next class in 32 minutes</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass dark:glass-dark">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">10/12</div>
                      <p className="text-xs text-muted-foreground mt-1">Classes attended this week</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass dark:glass-dark">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-500">Good</div>
                      <p className="text-xs text-muted-foreground mt-1">Above required threshold</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div variants={fadeInUp} className="md:col-span-2">
                    <AttendanceStats role="student" />
                  </motion.div>
                  
                  <motion.div variants={fadeInUp}>
                    <Card className="glass dark:glass-dark h-full">
                      <CardHeader>
                        <CardTitle>Next Class</CardTitle>
                        <CardDescription>Coming up soon</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {upcomingClasses.filter(c => c.isNext).map(classItem => (
                          <div key={classItem.id} className="space-y-2">
                            <h3 className="font-semibold text-lg">{classItem.subject}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{classItem.time}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <QrCode className="h-4 w-4 mr-2" />
                              <span>{classItem.room}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span>Instructor: {classItem.teacher}</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab('schedule')}>
                          View Full Schedule
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </div>
                
                <motion.div variants={fadeInUp}>
                  <Card className="glass dark:glass-dark">
                    <CardHeader>
                      <CardTitle>Recent Attendance</CardTitle>
                      <CardDescription>Your most recent attendance records</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivities.map(activity => (
                          <div key={activity.id} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                            <div>
                              <h4 className="font-medium">{activity.subject}</h4>
                              <p className="text-sm text-muted-foreground">{activity.date}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className={`font-medium ${activity.status === 'Present' ? 'text-green-500' : 'text-red-500'}`}>
                                {activity.status}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {activity.verificationMethod}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              {/* Scan QR Tab */}
              <TabsContent value="scan">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={fadeInUp} className="space-y-6">
                    <Card className="glass dark:glass-dark">
                      <CardHeader>
                        <CardTitle>Scan QR Code</CardTitle>
                        <CardDescription>Scan the teacher's QR code to mark your attendance</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center py-10">
                        <Button onClick={() => setIsScanning(!isScanning)}>
                          {isScanning ? 'Stop Scanning' : 'Scan QR Code'}
                        </Button>
                        {isScanning && (
                          <div className="qr-scanner">
                            <QrScanner
                              delay={300}
                              onError={handleError}
                              onScan={(result) => handleScan(result?.text || null)}
                              style={{ width: '100%' }}
                            />
                          </div>
                        )}
                        {qrResult && (
                          <div className="mt-4">
                            <p className="text-green-600 font-bold">Scanned QR Code:</p>
                            <p>{qrResult}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
              
              {/* Schedule Tab */}
              <TabsContent value="schedule">
                <motion.div variants={fadeInUp} className="space-y-6">
                  <Card className="glass dark:glass-dark">
                    <CardHeader>
                      <CardTitle>Today's Schedule</CardTitle>
                      <CardDescription>Your classes for today, {new Date().toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingClasses.map((classItem, index) => (
                          <div key={classItem.id} className={`p-4 rounded-lg border ${classItem.isNext ? 'bg-primary/5 border-primary/20' : ''}`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <div>
                                <h4 className="font-medium">{classItem.subject}</h4>
                                <p className="text-sm text-muted-foreground">{classItem.room} • {classItem.teacher}</p>
                              </div>
                              <div className="flex flex-col items-start md:items-end">
                                <span className="font-medium">{classItem.time}</span>
                                {classItem.isNext && (
                                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                    Next Class
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass dark:glass-dark">
                    <CardHeader>
                      <CardTitle>Weekly Overview</CardTitle>
                      <CardDescription>Your class schedule for this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-10 text-muted-foreground">
                        <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Weekly calendar view will be displayed here</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              {/* History Tab */}
              <TabsContent value="history">
                <motion.div variants={fadeInUp} className="space-y-6">
                  <Card className="glass dark:glass-dark">
                    <CardHeader>
                      <CardTitle>Attendance History</CardTitle>
                      <CardDescription>Detailed records of your past attendance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="present">Present</TabsTrigger>
                          <TabsTrigger value="absent">Absent</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="all" className="space-y-4">
                          {[...recentActivities, ...recentActivities].map((activity, index) => (
                            <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                              <div>
                                <h4 className="font-medium">{activity.subject}</h4>
                                <p className="text-sm text-muted-foreground">{activity.date}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                  ${activity.status === 'Present' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}
                                >
                                  {activity.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                        
                        <TabsContent value="present" className="space-y-4">
                          {[...recentActivities].filter(a => a.status === 'Present').map((activity, index) => (
                            <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                              <div>
                                <h4 className="font-medium">{activity.subject}</h4>
                                <p className="text-sm text-muted-foreground">{activity.date}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                  Present
                                </span>
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                        
                        <TabsContent value="absent" className="space-y-4">
                          {[...recentActivities].filter(a => a.status === 'Absent').map((activity, index) => (
                            <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                              <div>
                                <h4 className="font-medium">{activity.subject}</h4>
                                <p className="text-sm text-muted-foreground">{activity.date}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                  Absent
                                </span>
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                  
                  <AttendanceStats role="student" />
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
