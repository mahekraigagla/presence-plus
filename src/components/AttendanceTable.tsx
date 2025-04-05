
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface AttendanceTableProps {
  studentId: string;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ studentId }) => {
  const [loading, setLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [hasRecords, setHasRecords] = useState(false);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        if (!studentId) return;
        
        setLoading(true);
        
        // Fetch attendance records for the student
        const { data, error } = await supabase
          .from('attendance_records')
          .select(`
            *,
            classes:class_id (
              name,
              department,
              year
            )
          `)
          .eq('student_id', studentId)
          .order('timestamp', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setAttendanceRecords(data);
          setHasRecords(true);
        } else {
          setHasRecords(false);
        }
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendanceRecords();
  }, [studentId]);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!hasRecords) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
            <line x1="16" x2="16" y1="2" y2="6"></line>
            <line x1="8" x2="8" y1="2" y2="6"></line>
            <line x1="3" x2="21" y1="10" y2="10"></line>
          </svg>
        </div>
        <h3 className="text-lg font-medium">No attendance records found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Please mark your first attendance to see your attendance history here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                {record.timestamp ? format(new Date(record.timestamp), 'PPP p') : 'N/A'}
              </TableCell>
              <TableCell>
                {record.classes?.name || 'N/A'}
                <div className="text-xs text-muted-foreground">
                  {record.classes?.department} - {record.classes?.year}
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  record.status === 'Present'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {record.status}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm capitalize">
                  {record.verification_method.replace('_', ' ')}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;
