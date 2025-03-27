
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, QrCode, Calendar, Download, ArrowRight, UserCheck, UserX, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import AttendanceStats from '@/components/AttendanceStats';
import QRGenerator from '@/components/QRGenerator';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  
  // Sample classes for demo
  const classes = [
    {
      id: 1,
      name: 'Introduction to Computer Science',
      time: '09:00 AM - 10:30 AM',
      room: 'Room 101',
      students: 35,
      attendance: 31
    },
    {
      id: 2,
      name: 'Data Structures and Algorithms',
      time: '11:00 AM - 12:30 PM',
      room: 'Room 203',
      students: 28,
      attendance: 25
    },
    {
      id: 3,
      name: 'Database Systems',
      time: '02:00 PM - 03:30 PM',
      room: 'Lab 3',
      students: 22,
      attendance: 19
    }
  ];
  
  // Sample recent attendance activities
  const recentActivities = [
    {
      id: 1,
      student: 'Jane Smith',
      time: '09:05 AM',
      class: 'Web Development',
      verificationMethod: 'QR Code + Face',
      status: 'Verified'
    },
    {
      id: 2,
      student: 'John Wilson',
      time: '09:06 AM',
      class: 'Web Development',
      verificationMethod: 'QR Code + Face',
      status: 'Verified'
    },
    {
      id: 3,
      student: 'Alice Johnson',
      time: '09:07 AM',
      class: 'Web Development',
      verificationMethod: 'QR Code only',
      status: 'Partial'
    },
    {
      id: 4,
      student: 'Bob Miller',
      time: '09:10 AM',
      class: 'Web Development',
      verificationMethod: 'Manual',
      status: 'Manual'
    }
  ];
  
  // Sample attendance issues
  const attendanceIssues = [
    {
      id: 1,
      student: 'Mark Wilson',
      class: 'Introduction to Computer Science',
      issue: 'Low attendance (62%)',
      action: 'Send warning'
    },
    {
      id: 2,
      student: 'Sarah Thomas',
      class: 'Data Structures and Algorithms',
      issue: 'Camera verification failed multiple times',
      action: 'Manual verification'
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

  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Attendance report has been downloaded as CSV",
    });
  };

  const handleSendNotification = () => {
    toast({
      title: "Notification Sent",
      description: "Warning notification has been sent to Mark Wilson",
    });
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
            {/* Welcome Section */}
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Welcome, Prof. Anderson</h1>
                <p className="text-muted-foreground">Faculty ID: FAC-5678 | Computer Science Department</p>
              </div>
              <Button onClick={() => setActiveTab('qr')} className="md:w-auto w-full">
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR Code
              </Button>
            </motion.div>
            
            {/* Main Dashboard Content */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <motion.div variants={fadeInUp}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="qr">QR Generator</TabsTrigger>
                  <TabsTrigger value="classes">Classes</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
              </motion.div>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="glass dark:glass-dark">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">124</div>
                      <p className="text-xs text-muted-foreground mt-1">Across 5 classes</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass dark:glass-dark">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Today's Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">89%</div>
                      <p className="text-xs text-muted-foreground mt-1">75/85 students present</p>
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
                      <div className="text-2xl font-bold">92%</div>
                      <p className="text-xs text-muted-foreground mt-1">Average attendance rate</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div variants={fadeInUp} className="md:col-span-2">
                    <AttendanceStats role="teacher" />
                  </motion.div>
                  
                  <motion.div variants={fadeInUp}>
                    <Card className="glass dark:glass-dark h-full">
                      <CardHeader>
                        <CardTitle>Today's Classes</CardTitle>
                        <CardDescription>Your teaching schedule for today</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {classes.map((classItem) => (
                          <div key={classItem.id} className="pb-3 mb-3 border-b last:border-0 last:mb-0 last:pb-0">
                            <h3 className="font-medium">{classItem.name}</h3>
                            <div className="text-sm text-muted-foreground space-y-1 mt-1">
                              <div className="flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-2" />
                                <span>{classItem.time}</span>
                              </div>
                              <div className="flex items-center">
                                <QrCode className="h-3.5 w-3.5 mr-2" />
                                <span>{classItem.room}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-3.5 w-3.5 mr-2" />
                                <span>{classItem.students} students enrolled</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab('classes')}>
                          View All Classes
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={fadeInUp}>
                    <Card className="glass dark:glass-dark">
                      <CardHeader>
                        <CardTitle>Live Attendance</CardTitle>
                        <CardDescription>Students who recently marked attendance</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between pb-3 border-b last:border-0 last:pb-0">
                              <div>
                                <h4 className="font-medium">{activity.student}</h4>
                                <p className="text-xs text-muted-foreground">{activity.class} • {activity.time}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  activity.status === 'Verified' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                    : activity.status === 'Partial'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                  {activity.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={fadeInUp}>
                    <Card className="glass dark:glass-dark">
                      <CardHeader>
                        <CardTitle>Attendance Issues</CardTitle>
                        <CardDescription>Students requiring attention</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {attendanceIssues.map((issue) => (
                            <div key={issue.id} className="pb-3 border-b last:border-0 last:pb-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">{issue.student}</h4>
                                  <p className="text-xs text-muted-foreground">{issue.class}</p>
                                  <p className="text-sm mt-1 text-red-500">{issue.issue}</p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={handleSendNotification}
                                >
                                  <Bell className="h-3.5 w-3.5 mr-1" />
                                  {issue.action}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
              
              {/* QR Generator Tab */}
              <TabsContent value="qr">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={fadeInUp}>
                    <QRGenerator />
                  </motion.div>
                  
                  <motion.div variants={fadeInUp}>
                    <Card className="glass dark:glass-dark h-full">
                      <CardHeader>
                        <CardTitle>Live Attendance Feed</CardTitle>
                        <CardDescription>Students who recently marked attendance</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between pb-3 border-b last:border-0 last:pb-0">
                              <div>
                                <h4 className="font-medium">{activity.student}</h4>
                                <p className="text-xs text-muted-foreground">{activity.class} • {activity.time}</p>
                                <p className="text-xs text-muted-foreground">Method: {activity.verificationMethod}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  activity.status === 'Verified' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                    : activity.status === 'Partial'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                  {activity.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button className="w-1/2" variant="outline" size="sm">
                          <UserCheck className="h-4 w-4 mr-2" />
                          Mark Present
                        </Button>
                        <Button className="w-1/2" variant="outline" size="sm">
                          <UserX className="h-4 w-4 mr-2" />
                          Mark Absent
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
              
              {/* Classes Tab */}
              <TabsContent value="classes">
                <motion.div variants={fadeInUp} className="space-y-6">
                  <Card className="glass dark:glass-dark">
                    <CardHeader>
                      <CardTitle>Your Classes</CardTitle>
                      <CardDescription>All classes you are teaching this semester</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {classes.map((classItem) => (
                          <div key={classItem.id} className="p-4 rounded-lg border">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                              <div>
                                <h3 className="text-lg font-medium">{classItem.name}</h3>
                                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                                  <div className="text-sm text-muted-foreground flex items-center">
                                    <Calendar className="h-4 w-4 mr-1.5" />
                                    <span>{classItem.time}</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground flex items-center">
                                    <QrCode className="h-4 w-4 mr-1.5" />
                                    <span>{classItem.room}</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground flex items-center">
                                    <Users className="h-4 w-4 mr-1.5" />
                                    <span>{classItem.students} students</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col xs:flex-row gap-2">
                                <Button variant="outline" size="sm" onClick={() => setActiveTab('qr')}>
                                  <QrCode className="h-4 w-4 mr-2" />
                                  QR Code
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Users className="h-4 w-4 mr-2" />
                                  Students
                                </Button>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t">
                              <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
                                <div>
                                  <p className="text-sm font-medium">Today's Attendance: 
                                    <span className="ml-1 text-green-500">{Math.round((classItem.attendance / classItem.students) * 100)}%</span>
                                  </p>
                                  <p className="text-xs text-muted-foreground">{classItem.attendance} of {classItem.students} students present</p>
                                </div>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Attendance Sheet
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              {/* Reports Tab */}
              <TabsContent value="reports">
                <motion.div variants={fadeInUp} className="space-y-6">
                  <Card className="glass dark:glass-dark">
                    <CardHeader>
                      <CardTitle>Attendance Reports</CardTitle>
                      <CardDescription>Generate and download attendance reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="glass dark:glass-dark rounded-lg p-4 flex flex-col items-center text-center">
                            <div className="p-2 rounded-full bg-primary/10 mb-3">
                              <Download className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium">Daily Report</h3>
                            <p className="text-sm text-muted-foreground mt-1 mb-4">Today's attendance summary</p>
                            <Button variant="outline" size="sm" className="mt-auto w-full" onClick={handleDownloadReport}>
                              Download
                            </Button>
                          </div>
                          
                          <div className="glass dark:glass-dark rounded-lg p-4 flex flex-col items-center text-center">
                            <div className="p-2 rounded-full bg-primary/10 mb-3">
                              <Download className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium">Weekly Report</h3>
                            <p className="text-sm text-muted-foreground mt-1 mb-4">This week's attendance summary</p>
                            <Button variant="outline" size="sm" className="mt-auto w-full" onClick={handleDownloadReport}>
                              Download
                            </Button>
                          </div>
                          
                          <div className="glass dark:glass-dark rounded-lg p-4 flex flex-col items-center text-center">
                            <div className="p-2 rounded-full bg-primary/10 mb-3">
                              <Download className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium">Monthly Report</h3>
                            <p className="text-sm text-muted-foreground mt-1 mb-4">This month's attendance summary</p>
                            <Button variant="outline" size="sm" className="mt-auto w-full" onClick={handleDownloadReport}>
                              Download
                            </Button>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t">
                          <h3 className="font-medium mb-4">Custom Report</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium block mb-2">Class</label>
                              <select className="w-full rounded-md border border-input py-2 px-3 bg-transparent">
                                <option value="">All Classes</option>
                                {classes.map((classItem) => (
                                  <option key={classItem.id} value={classItem.id}>
                                    {classItem.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium block mb-2">Date Range</label>
                              <select className="w-full rounded-md border border-input py-2 px-3 bg-transparent">
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="semester">This Semester</option>
                                <option value="custom">Custom Range</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium block mb-2">Format</label>
                              <select className="w-full rounded-md border border-input py-2 px-3 bg-transparent">
                                <option value="csv">CSV</option>
                                <option value="pdf">PDF</option>
                                <option value="excel">Excel</option>
                              </select>
                            </div>
                          </div>
                          
                          <Button className="mt-4" onClick={handleDownloadReport}>
                            <Download className="mr-2 h-4 w-4" />
                            Generate Custom Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <AttendanceStats role="teacher" />
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
