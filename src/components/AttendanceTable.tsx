
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search, UserCheck, UserX, RefreshCw, Pencil, Filter, Calendar, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Student {
  id: string;
  rollNumber: string;
  name: string;
  status: 'present' | 'absent' | 'pending';
  time?: string;
  verificationMethod: 'QR + Face' | 'QR Only' | 'Manual' | 'Not Verified';
}

interface AttendanceTableProps {
  classId: string;
  date: string;
  lectureId?: string;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ classId, date, lectureId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([
    { 
      id: '1', 
      rollNumber: '101', 
      name: 'John Doe', 
      status: 'present', 
      time: '09:15 AM', 
      verificationMethod: 'QR + Face' 
    },
    { 
      id: '2', 
      rollNumber: '102', 
      name: 'Jane Smith', 
      status: 'present', 
      time: '09:20 AM', 
      verificationMethod: 'QR + Face' 
    },
    { 
      id: '3', 
      rollNumber: '103', 
      name: 'Michael Johnson', 
      status: 'absent', 
      verificationMethod: 'Not Verified' 
    },
    { 
      id: '4', 
      rollNumber: '104', 
      name: 'Emily Davis', 
      status: 'present', 
      time: '09:22 AM', 
      verificationMethod: 'QR Only' 
    },
    { 
      id: '5', 
      rollNumber: '105', 
      name: 'Robert Wilson', 
      status: 'present', 
      time: '09:30 AM', 
      verificationMethod: 'Manual' 
    },
    { 
      id: '6', 
      rollNumber: '106', 
      name: 'Sarah Johnson', 
      status: 'absent', 
      verificationMethod: 'Not Verified' 
    },
    { 
      id: '7', 
      rollNumber: '107', 
      name: 'David Brown', 
      status: 'present', 
      time: '09:18 AM', 
      verificationMethod: 'QR + Face' 
    },
    { 
      id: '8', 
      rollNumber: '108', 
      name: 'Jennifer Garcia', 
      status: 'present', 
      time: '09:25 AM', 
      verificationMethod: 'QR + Face' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(lectureId || 'All Lectures');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent'>('all');
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  
  const { toast } = useToast();

  const lectures = [
    'All Lectures',
    'Lecture 1 - Introduction (09/10/2023)',
    'Lecture 2 - Data Types (09/12/2023)',
    'Lecture 3 - Control Structures (09/14/2023)',
  ];

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeUpdates) return;
    
    const interval = setInterval(() => {
      // Randomly simulate a student marking attendance
      if (Math.random() > 0.7) {
        const absentStudents = students.filter(s => s.status === 'absent');
        if (absentStudents.length > 0) {
          const randomStudent = absentStudents[Math.floor(Math.random() * absentStudents.length)];
          markAttendance(randomStudent.id, 'present', true);
        }
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [students, realTimeUpdates]);

  // Apply filters
  const filteredStudents = students.filter(student => 
    // Search filter
    (student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     student.rollNumber.includes(searchQuery)) &&
    // Status filter
    (statusFilter === 'all' || student.status === statusFilter)
  );

  const markAttendance = (studentId: string, status: 'present' | 'absent', isAutomatic = false) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId 
          ? { 
              ...student, 
              status, 
              time: status === 'present' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
              verificationMethod: isAutomatic ? 'QR + Face' : 'Manual'
            } 
          : student
      )
    );

    if (!isAutomatic) {
      toast({
        title: `Marked ${status}`,
        description: `Student ${students.find(s => s.id === studentId)?.name} marked as ${status}`,
      });
    } else {
      toast({
        title: "Automatic Attendance",
        description: `${students.find(s => s.id === studentId)?.name} just marked attendance via face recognition`,
      });
    }
  };

  const downloadAttendance = (format: 'csv' | 'excel' | 'pdf') => {
    setIsLoading(true);
    
    // Simulate download process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Attendance Downloaded",
        description: `Attendance report downloaded in ${format.toUpperCase()} format`,
      });
    }, 1500);
  };

  const refreshAttendance = () => {
    setIsLoading(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Attendance Refreshed",
        description: "Latest attendance data has been loaded",
      });
    }, 1500);
  };

  // Calculate statistics
  const totalStudents = students.length;
  const presentStudents = students.filter(s => s.status === 'present').length;
  const attendanceRate = Math.round((presentStudents / totalStudents) * 100);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800/30">
          <div className="flex items-center">
            <div className="rounded-full bg-green-500/20 p-3 mr-4">
              <UserCheck className="h-6 w-6 text-green-700 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-400">Present</p>
              <h4 className="text-2xl font-bold text-green-900 dark:text-green-300">{presentStudents}</h4>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800/30">
          <div className="flex items-center">
            <div className="rounded-full bg-red-500/20 p-3 mr-4">
              <UserX className="h-6 w-6 text-red-700 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-400">Absent</p>
              <h4 className="text-2xl font-bold text-red-900 dark:text-red-300">{totalStudents - presentStudents}</h4>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/30">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-500/20 p-3 mr-4">
              <Calendar className="h-6 w-6 text-blue-700 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Attendance Rate</p>
              <h4 className="text-2xl font-bold text-blue-900 dark:text-blue-300">{attendanceRate}%</h4>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <label className="text-sm font-medium block mb-2">Select Lecture</label>
          <Select value={selectedLecture} onValueChange={setSelectedLecture}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a lecture" />
            </SelectTrigger>
            <SelectContent>
              {lectures.map((lecture) => (
                <SelectItem key={lecture} value={lecture}>{lecture}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-2/3 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or roll number..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Filter Attendance</h4>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="real-time"
                      checked={realTimeUpdates}
                      onCheckedChange={setRealTimeUpdates}
                    />
                    <Label htmlFor="real-time">Real-time updates</Label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button 
              onClick={refreshAttendance} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-md border shadow-sm">
        <div className="flex flex-wrap justify-between items-center p-4 border-b">
          <h3 className="font-medium text-lg">
            {selectedLecture === 'All Lectures' ? 'All Attendance Records' : selectedLecture}
          </h3>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button variant="outline" size="sm" onClick={() => downloadAttendance('csv')} disabled={isLoading}>
              <FileText className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadAttendance('excel')} disabled={isLoading}>
              <FileText className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadAttendance('pdf')} disabled={isLoading}>
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Roll No</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Time</TableHead>
                <TableHead className="font-semibold">Verification</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                      <span>Loading attendance data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{student.rollNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Badge className={`${
                        student.status === 'present' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 hover:dark:bg-green-900/40' 
                          : 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 hover:dark:bg-red-900/40'
                      }`}>
                        {student.status === 'present' ? 'Present' : 'Absent'}
                      </Badge>
                    </TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>{student.time || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {student.verificationMethod}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => markAttendance(student.id, 'present')}
                          disabled={student.status === 'present'}
                        >
                          <UserCheck className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => markAttendance(student.id, 'absent')}
                          disabled={student.status === 'absent'}
                        >
                          <UserX className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;
