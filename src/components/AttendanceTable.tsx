
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  
  const { toast } = useToast();

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.rollNumber.includes(searchQuery)
  );

  const markAttendance = (studentId: string, status: 'present' | 'absent') => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId 
          ? { 
              ...student, 
              status, 
              time: status === 'present' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
              verificationMethod: 'Manual'
            } 
          : student
      )
    );

    toast({
      title: `Marked ${status}`,
      description: `Student ${students.find(s => s.id === studentId)?.name} marked as ${status}`,
    });
  };

  const downloadAttendance = (format: 'csv' | 'excel' | 'pdf') => {
    // In a real application, this would connect to a backend to generate the file
    // For this demo, we'll just show a success toast
    toast({
      title: "Attendance Downloaded",
      description: `Attendance report downloaded in ${format.toUpperCase()} format`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          <Button onClick={() => downloadAttendance('csv')} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button onClick={() => downloadAttendance('excel')} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button onClick={() => downloadAttendance('pdf')} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
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
                  <TableCell>{student.time || '—'}</TableCell>
                  <TableCell>{student.verificationMethod}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => markAttendance(student.id, 'present')}
                      >
                        <UserCheck className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => markAttendance(student.id, 'absent')}
                      >
                        <UserX className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendanceTable;
