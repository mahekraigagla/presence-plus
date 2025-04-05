
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';

const AttendancePage = () => {
  const { classId } = useParams<{ classId: string }>();
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch students
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('*')
          .order('roll_number', { ascending: true });
        
        if (studentsError) throw studentsError;
        
        setStudents(studentsData || []);
        
        // Fetch attendance records
        const dateFilter = selectedDate 
          ? new Date(selectedDate.setHours(0, 0, 0, 0)).toISOString()
          : undefined;
        
        let query = supabase
          .from('attendance_records')
          .select(`
            *,
            students:student_id (
              id,
              full_name,
              roll_number,
              department,
              email
            )
          `)
          .eq('class_id', classId);
        
        if (dateFilter) {
          // Using a date range for the day
          const nextDay = new Date(selectedDate);
          nextDay.setDate(nextDay.getDate() + 1);
          
          query = query
            .gte('timestamp', dateFilter)
            .lt('timestamp', nextDay.toISOString());
        }
        
        if (selectedStatus !== 'all') {
          query = query.eq('status', selectedStatus);
        }
        
        const { data: attendanceData, error: attendanceError } = await query;
        
        if (attendanceError) throw attendanceError;
        
        setAttendanceRecords(attendanceData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [classId, selectedDate, selectedStatus]);
  
  const filteredAttendance = attendanceRecords.filter(record => {
    const studentName = record.students?.full_name?.toLowerCase() || '';
    const rollNumber = record.students?.roll_number?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return studentName.includes(query) || rollNumber.includes(query);
  });
  
  const exportToCSV = () => {
    if (filteredAttendance.length === 0) return;
    
    const headers = ['Roll Number', 'Student Name', 'Department', 'Date & Time', 'Status'];
    
    const csvData = filteredAttendance.map(record => [
      record.students?.roll_number || '',
      record.students?.full_name || '',
      record.students?.department || '',
      record.timestamp ? format(new Date(record.timestamp), 'PPP p') : '',
      record.status
    ]);
    
    let csvContent = headers.join(',') + '\n';
    csvData.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendance-${classId}-${format(selectedDate || new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const hasRecords = filteredAttendance.length > 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole="teacher" />
      
      <main className="flex-grow p-6 pt-24">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Attendance Records - Class {classId}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="md:w-1/4">
                <label className="text-sm font-medium block mb-2">Date</label>
                <DatePicker date={selectedDate} setDate={setSelectedDate} />
              </div>
              
              <div className="md:w-1/4">
                <label className="text-sm font-medium block mb-2">Status</label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:w-1/2">
                <label className="text-sm font-medium block mb-2">Search</label>
                <Input
                  placeholder="Search by name or roll number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {loading ? 'Loading...' : `${filteredAttendance.length} records found`}
                </p>
              </div>
              <Button 
                onClick={exportToCSV}
                disabled={!hasRecords || loading}
                variant="outline"
                size="sm"
              >
                Export to CSV
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : hasRecords ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.students?.roll_number || 'N/A'}</TableCell>
                        <TableCell>{record.students?.full_name || 'N/A'}</TableCell>
                        <TableCell>{record.students?.department || 'N/A'}</TableCell>
                        <TableCell>
                          {record.timestamp ? format(new Date(record.timestamp), 'PPP p') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              record.status === 'Present'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                          >
                            {record.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm capitalize">
                            {record.verification_method?.replace('_', ' ')}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="border rounded-md flex flex-col items-center justify-center h-64 text-center">
                <div className="text-muted-foreground mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 6h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"></path>
                    <path d="M12 2a4 4 0 1 0 0 8 4 4 0 1 0 0-8z"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-lg">No attendance records found</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  There are no attendance records for the selected filters. Try changing the date or status filter.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AttendancePage;
