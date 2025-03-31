
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search, UserCheck, UserX, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ classId, date }) => {
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
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState('All Lectures');
  
  const { toast } = useToast();

  const lectures = [
    'All Lectures',
    'Lecture 1 - Introduction (09/10/2023)',
    'Lecture 2 - Data Types (09/12/2023)',
    'Lecture 3 - Control Structures (09/14/2023)',
  ];

  // Simulate real-time updates
  useEffect(() => {
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
  }, [students]);

  const filteredStudents = students.filter(student => 
    (student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.rollNumber.includes(searchQuery))
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

  return (
    <div className="space-y-4">
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

      <div className="bg-white dark:bg-gray-800 rounded-md border p-4">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h3 className="font-medium text-lg">
            {selectedLecture === 'All Lectures' ? 'All Attendance Records' : selectedLecture}
          </h3>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button onClick={() => downloadAttendance('csv')} variant="outline" size="sm" disabled={isLoading}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button onClick={() => downloadAttendance('excel')} variant="outline" size="sm" disabled={isLoading}>
              <Download className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <Button onClick={() => downloadAttendance('pdf')} variant="outline" size="sm" disabled={isLoading}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === 'present' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {student.status === 'present' ? 'Present' : 'Absent'}
                      </span>
                    </TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>{student.time || '—'}</TableCell>
                    <TableCell>{student.verificationMethod}</TableCell>
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
