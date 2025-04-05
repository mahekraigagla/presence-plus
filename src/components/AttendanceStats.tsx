
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AttendanceStatsProps } from '@/integrations/types/attendance-types';

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ studentId, role }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    present: number;
    absent: number;
    total: number;
    percentage: number;
  }>({
    present: 0,
    absent: 0,
    total: 0,
    percentage: 0,
  });
  const [hasRecords, setHasRecords] = useState(false);

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      try {
        setLoading(true);
        
        let query = supabase.from('attendance_records').select('*');
        
        // If studentId is provided, filter by student
        if (studentId) {
          query = query.eq('student_id', studentId);
        }
        
        // For teacher role, we might want to get all attendance records
        // This is just placeholder logic - real implementation would depend on requirements
        if (role === 'teacher') {
          // No additional filter needed for teacher view
          // Could add date ranges, specific classes, etc.
        }
        
        const { data: records, error } = await query;
        
        if (error) throw error;
        
        if (records && records.length > 0) {
          const present = records.filter(r => r.status === 'Present').length;
          const total = records.length;
          const absent = total - present;
          const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
          
          setStats({
            present,
            absent,
            total,
            percentage
          });
          
          setHasRecords(true);
        } else {
          setHasRecords(false);
        }
      } catch (error) {
        console.error('Error fetching attendance stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendanceStats();
  }, [studentId, role]);

  const chartData = [
    { name: 'Present', value: stats.present, color: '#22c55e' },
    { name: 'Absent', value: stats.absent, color: '#ef4444' },
  ];

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
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
          {role === 'teacher' 
            ? "No attendance records available yet. Start a class session to collect attendance."
            : "Please mark your first attendance to see statistics and data visualization here."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.absent}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance Rate</CardTitle>
          <CardDescription>Overall attendance percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex items-center justify-between">
            <span>{stats.percentage}%</span>
          </div>
          <Progress value={stats.percentage} className="h-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance Distribution</CardTitle>
          <CardDescription>Breakdown of your attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceStats;
