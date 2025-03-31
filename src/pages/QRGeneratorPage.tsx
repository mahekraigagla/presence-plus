
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, UserX } from 'lucide-react';
import Navbar from '@/components/Navbar';
import QRGenerator from '@/components/QRGenerator';

const QRGeneratorPage = () => {
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
              <h1 className="text-2xl font-bold">QR Code Generator</h1>
              <p className="text-muted-foreground mt-1">Generate QR codes for attendance tracking</p>
            </motion.div>
            
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
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default QRGeneratorPage;
